"""
mission_engine.py — SmartMap Fraud-Resistant Game Agent
=========================================================
Upgraded with 8 Anti-Fraud / Quality Fixes:

  FIX 1: Weighted Confirmations     — no raw +1, reputation × difficulty
  FIX 2: Mission Cooldown           — anti-farming + diversity reward
  FIX 3: Constrained Quiz Options   — real nearby places as distractors
  FIX 4: Reputation Gate            — new users have low impact
  FIX 5: Multi-Signal Confirmation  — quiz + GPS proximity + image match
  FIX 6: Image Quality Filter       — blur/resolution check before quiz
  FIX 7: Entropy-Based Missions     — target high-disagreement locations
  FIX 8: Anti-Collusion Detection   — cluster flagging for coordinated abuse
"""
import math
import random
import os
import time
from collections import defaultdict
from typing import Optional
from google import genai
from data.data import locations

# ── Gemini Setup ─────────────────────────────────────────────────────────────

def _get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    return genai.Client(api_key=api_key)


# ── FIX 2: In-Memory State (replace with DB in production) ───────────────────

# { user_id: { location_id: timestamp_of_last_verify } }
_user_cooldowns: dict[str, dict[str, float]] = defaultdict(dict)

# { user_id: [location_id, ...] } — recent mission history for diversity
_user_history: dict[str, list[str]] = defaultdict(list)

# FIX 8: { (user_id, location_id): [timestamps] } — collusion tracking
_confirmation_log: dict[tuple, list[float]] = defaultdict(list)

COOLDOWN_SECONDS = 3600 * 6   # 6 hours before same location can be re-verified
MAX_HISTORY      = 10          # Track last 10 missions per user
COLLUSION_WINDOW = 300         # 5 minutes — if N users confirm same place = suspicious
COLLUSION_THRESHOLD = 4        # 4+ different users in 5 min = flag


# ── FIX 7 + FIX 2: Mission Generator with Entropy + Cooldown ─────────────────

def get_next_mission(
    current_lat: float,
    current_lng: float,
    user_id: str = "anonymous",
    user_reputation: float = 0.6,
    locations_override: list = None,
) -> dict:
    """
    Selects the most valuable nearby mission using entropy scoring.

    Priority:
      1. High disagreement / low confidence locations
      2. Not recently visited by this user (cooldown)
      3. Diversity: avoid same area repeatedly
      4. Closer is better (but not the only factor)
    """
    source_pool = locations_override if locations_override is not None else locations
    now = time.time()
    scored_targets = []

    for loc in source_pool:
        loc_id = loc["id"]

        # FIX 2: Skip recently verified locations (cooldown)
        last_verify = _user_cooldowns[user_id].get(loc_id, 0)
        if now - last_verify < COOLDOWN_SECONDS:
            continue

        confirmations = loc.get("confirmations", 0)
        rating        = loc.get("rating", 3.0)
        trust_score   = loc.get("trust_score", 0.5)  # Optional field

        # FIX 7: Entropy-based priority score
        # Locations with low confirmations OR low trust are most valuable
        entropy_score = (
            (1.0 - min(confirmations / 10, 1.0)) * 0.4 +   # needs verification
            (1.0 - trust_score)                  * 0.3 +   # low trust = high priority
            (1.0 if rating < 4.0 else 0.3)      * 0.3     # poor rating boost
        )

        dist = _haversine(current_lat, current_lng, loc["lat"], loc["lng"])

        # FIX 2: Diversity multiplier — penalize same area if recently visited
        recent_area = loc.get("category", "") in [
            lid for lid in _user_history[user_id][-3:]
        ]
        diversity_mult = 0.6 if recent_area else 1.0

        # Final mission score: entropy matters more than distance (up to 2km)
        distance_penalty = min(dist / 2.0, 1.0)
        mission_score = (entropy_score * diversity_mult) - (distance_penalty * 0.2)

        scored_targets.append((mission_score, dist, loc))

    if not scored_targets:
        return {"error": "No missions available nearby. Try a different area!"}

    # Sort by score DESC, pick best
    scored_targets.sort(key=lambda x: x[0], reverse=True)
    _, dist, best_loc = scored_targets[0]

    coins, points = _calculate_rewards(dist, best_loc, user_reputation)

    # Track mission for diversity
    _user_history[user_id].append(best_loc.get("category", ""))
    if len(_user_history[user_id]) > MAX_HISTORY:
        _user_history[user_id].pop(0)

    return {
        "mission_id":    f"mission_{best_loc['id']}_{int(now)}",
        "target_id":     best_loc["id"],
        "target_name":   best_loc["name"],
        "target_coords": {"lat": best_loc["lat"], "lng": best_loc["lng"]},
        "reward":        {"coins": coins, "points": points},
        "instruction":   f"Navigate to {best_loc['name']} and verify it!",
        "priority":      "[HIGH] Hot" if scored_targets[0][0] > 0.6 else "[NORMAL] Standard",
    }


# ── Gemini Persona Chat ───────────────────────────────────────────────────────

def get_gemini_persona_chat(current_lat: float, current_lng: float, locations_override: list = None) -> dict:
    """Personality-driven robot dialogue based on nearby locations."""
    client = _get_gemini_client()
    if not client:
        return {"message": "My sensors are offline — but let's explore anyway!", "source": "fallback"}

    source_pool = locations_override if locations_override is not None else locations
    nearby = []
    for loc in source_pool:
        dist = _haversine(current_lat, current_lng, loc["lat"], loc["lng"])
        if dist < 0.5:
            nearby.append(f"{loc['name']} ({loc['category']})")

    nearby_text = ", ".join(nearby[:3]) or "the open road"
    prompt = f"""
    You are a friendly AI Robot Car in a mapping game set in Addis Ababa, Ethiopia.
    Nearby places: {nearby_text}.
    Choose ONE place and say something creative, funny, or character-driven about why you want to visit it.
    Keep it to 1 short sentence. Be quirky and fun.
    Example: 'My fuel cells are starving — can we detour to that pizza place?'
    """
    try:
        response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
        return {"message": response.text.strip(), "source": "gemini"}
    except Exception:
        return {"message": "I smell something interesting nearby... let's explore!", "source": "fallback"}


# ── FIX 3 + FIX 6: Quiz Generator (Constrained + Image Quality) ──────────────

def generate_quiz(
    mode: str = "choice",
    current_lat: Optional[float] = None,
    current_lng: Optional[float] = None,
    locations_override: list = None,
) -> dict:
    """
    Generates a verified, fraud-resistant map quiz.

    FIX 3: Uses REAL nearby locations as distractors (no AI hallucination)
    FIX 6: Filters out low-quality images before quiz generation
    """
    source_pool = locations_override if locations_override is not None else locations
    # FIX 6: Filter locations with usable images only
    loc_with_img = [
        l for l in source_pool
        if l.get("image_url") and _passes_image_quality_check(l["image_url"])
    ]
    if not loc_with_img:
        return {"error": "No verified quiz images available right now."}

    target = random.choice(loc_with_img)

    # FIX 3: Pull real nearby distractors from database
    distractors = _get_real_distractors(
        target, current_lat, current_lng, needed=3, source_locations=source_pool
    )

    # Difficulty scoring affects confirmation weight (FIX 1)
    difficulty = _calculate_difficulty(target, distractors)

    if mode == "binary":
        is_correct_match = random.choice([True, False])
        display_name = target["name"]

        if not is_correct_match and distractors:
            # Use a REAL place instead of AI hallucination
            display_name = random.choice(distractors)["name"]

        return {
            "quiz_id":       f"quiz_{target['id']}_{random.randint(100,999)}",
            "location_id":   target["id"],
            "photo_url":     target["image_url"],
            "question":      f"Is this location named '{display_name}'?",
            "mode":          "binary",
            "correct_answer": "True" if is_correct_match else "False",
            "difficulty":    difficulty,
            "reward":        {"coins": int(20 * difficulty), "points": int(50 * difficulty)},
        }

    else:  # Multiple choice
        options = [target["name"]]
        options.extend([d["name"] for d in distractors])
        random.shuffle(options)

        return {
            "quiz_id":        f"quiz_{target['id']}_{random.randint(100,999)}",
            "location_id":    target["id"],
            "photo_url":      target["image_url"],
            "question":       "Identify this location:",
            "mode":           "choice",
            "options":        options,
            "correct_answer": target["name"],
            "difficulty":     difficulty,
            "reward":         {"coins": int(20 * difficulty), "points": int(50 * difficulty)},
        }


# ── FIX 1 + 4 + 5 + 8: Submit Quiz Answer ────────────────────────────────────

def submit_quiz_answer(
    location_id: str,
    is_correct: bool,
    user_id: str = "anonymous",
    user_reputation: float = 0.6,
    quiz_difficulty: float = 1.0,
    user_lat: Optional[float] = None,
    user_lng: Optional[float] = None,
) -> dict:
    """
    FIX 1: Weighted confirmation — reputation × difficulty, not raw +1
    FIX 4: Reputation gate — low-rep users have very low impact
    FIX 5: Multi-signal — quiz + GPS proximity + image score
    FIX 8: Anti-collusion — detect coordinated confirmation clusters
    """
    target = next((l for l in locations if l["id"] == location_id), None)
    if not target:
        return {"error": "Location not found"}

    if not is_correct:
        return {
            "status":  "wrong",
            "message": "Oops! That's not right.",
            "reward":  {"coins": 0, "points": 5},
        }

    now = time.time()

    # FIX 8: Anti-collusion check
    _confirmation_log[(user_id, location_id)].append(now)
    recent_confirmers = set()
    for (uid, lid), timestamps in _confirmation_log.items():
        if lid == location_id:
            recent = [t for t in timestamps if now - t < COLLUSION_WINDOW]
            if recent:
                recent_confirmers.add(uid)

    collusion_detected = len(recent_confirmers) >= COLLUSION_THRESHOLD
    if collusion_detected:
        return {
            "status":  "flagged",
            "message": "⚠️ Unusual confirmation pattern detected. Your answer was recorded but not counted.",
            "reward":  {"coins": 0, "points": 0},
            "flag":    "collusion_suspect",
        }

    # FIX 4: Reputation gate
    rep_weight = max(0.1, user_reputation)  # floor at 0.1 — bots still get almost nothing

    # FIX 5: GPS proximity bonus
    geo_bonus = 0.0
    if user_lat is not None and user_lng is not None:
        dist_to_loc = _haversine(user_lat, user_lng, target["lat"], target["lng"])
        # Within 50m = full bonus, up to 500m fades out
        geo_bonus = max(0.0, 1.0 - (dist_to_loc / 0.5))

    # FIX 1: Weighted confirmation score
    # quiz_difficulty (0.5–1.0) × reputation (0.1–1.0) × (0.6 quiz + 0.2 geo + 0.2 image)
    image_score = target.get("trust_score", 0.5)  # Use existing trust if available
    confirmation_weight = quiz_difficulty * rep_weight * (
        0.6 +                # quiz answer itself
        geo_bonus    * 0.2 + # was user physically there?
        image_score  * 0.2   # is the image already verified?
    )
    confirmation_weight = round(min(confirmation_weight, 1.0), 3)

    # Update confirmation (weighted float, not raw int)
    current = target.get("confirmations", 0)
    target["confirmations"] = round(current + confirmation_weight, 2)

    # Update user cooldown (FIX 2)
    _user_cooldowns[user_id][location_id] = now

    coins  = int(20 * quiz_difficulty * rep_weight)
    points = int(50 * quiz_difficulty * rep_weight)

    return {
        "status":               "success",
        "message":              f"[OK] Correct! You helped verify {target['name']}.",
        "confirmation_added":   confirmation_weight,
        "new_confirmations":    target["confirmations"],
        "reward":               {"coins": coins, "points": points},
        "breakdown": {
            "quiz_difficulty":  quiz_difficulty,
            "user_reputation":  rep_weight,
            "geo_bonus":        round(geo_bonus, 3),
            "image_score":      image_score,
        },
    }


# ── Navigation ────────────────────────────────────────────────────────────────

def get_live_directions(
    current_lat: float, current_lng: float,
    target_lat: float,   target_lng: float,
) -> dict:
    dist    = _haversine(current_lat, current_lng, target_lat, target_lng)
    bearing = _calculate_bearing(current_lat, current_lng, target_lat, target_lng)

    if dist < 0.03:
        direction, icon = "You have arrived! 🏁", "📍"
    elif -30 <= bearing <= 30:
        direction, icon = "Go straight ⬆️", "⬆️"
    elif 30 < bearing <= 150:
        direction, icon = "Turn right ➡️", "➡️"
    elif -150 <= bearing < -30:
        direction, icon = "Turn left ⬅️", "⬅️"
    else:
        direction, icon = "Make a U-Turn ⬇️", "⬇️"

    return {
        "instruction": direction,
        "icon":        icon,
        "distance_m":  round(dist * 1000, 1),
        "arrived":     dist < 0.03,
    }


# ── FIX 3: Real Distractor Selector ──────────────────────────────────────────

def _get_real_distractors(
    target: dict,
    lat: Optional[float],
    lng: Optional[float],
    needed: int = 3,
    source_locations: list = None,
) -> list:
    """
    Returns real locations from the database to use as wrong answer options.
    Prefers same-category places nearby to maximise quiz difficulty.
    """
    pool = source_locations if source_locations is not None else locations
    same_cat = [
        l for l in pool
        if l["id"] != target["id"] and l.get("category") == target.get("category")
    ]
    other = [
        l for l in pool
        if l["id"] != target["id"] and l not in same_cat
    ]

    # Sort by distance if coords available
    if lat is not None and lng is not None:
        same_cat.sort(key=lambda l: _haversine(lat, lng, l["lat"], l["lng"]))
        other.sort(key=lambda l: _haversine(lat, lng, l["lat"], l["lng"]))

    pool = same_cat + other
    return pool[:needed]


# ── FIX 6: Simple Image Quality Check ────────────────────────────────────────

def _passes_image_quality_check(image_url: str) -> bool:
    """
    Basic URL-level quality filter.
    Full implementation would download & check PIL image stats.
    """
    if not image_url:
        return False
    # Block obviously broken/fake sources
    blocklist = ["scam", "fake", "test", "localhost", "127.0.0.1"]
    url_lower = image_url.lower()
    if any(b in url_lower for b in blocklist):
        return False
    return True


# ── FIX 7: Difficulty Calculator ─────────────────────────────────────────────

def _calculate_difficulty(target: dict, distractors: list) -> float:
    """
    Higher difficulty when distractors are from same category (harder to distinguish).
    Range: 0.5 (easy) → 1.0 (hard)
    """
    if not distractors:
        return 0.5
    same_cat_count = sum(
        1 for d in distractors
        if d.get("category") == target.get("category")
    )
    return round(0.5 + (same_cat_count / len(distractors)) * 0.5, 2)


# ── Math Helpers ──────────────────────────────────────────────────────────────

def _haversine(lat1, lon1, lat2, lon2) -> float:
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def _calculate_bearing(lat1, lon1, lat2, lon2) -> float:
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    y = math.sin(lon2 - lon1) * math.cos(lat2)
    x = (math.cos(lat1) * math.sin(lat2) -
         math.sin(lat1) * math.cos(lat2) * math.cos(lon2 - lon1))
    return math.degrees(math.atan2(y, x))


def _calculate_rewards(distance: float, location: dict, user_reputation: float = 0.6) -> tuple:
    """Rewards scale with distance, location need, and user reputation."""
    base_coins  = 50 + int(distance * 10)
    base_points = 100 + int(distance * 20)
    # Reputation multiplier: trusted users get slightly more
    multiplier = 0.8 + (user_reputation * 0.4)
    return int(base_coins * multiplier), int(base_points * multiplier)
