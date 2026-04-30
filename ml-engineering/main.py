"""
main.py — SmartMap Unified Full-Service Backend
===============================================
This is the consolidated entry point for all ML-Engineering services:
- Smart Search & RAG (AI Powered)
- Image Verification (4-Layer AI Engine)
- Robot Missions & Persona (Gemini Dialogue)
- Map Validation Quizzes (Crowdsourcing)
- Live Navigation Guidance
"""

import os
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

# ── Dynamic Modules Integration ──────────────────────────────────────────────
from engines.verification.image_verifier import verify_location_image
from engines.trust_engine import calculate_trust_score, get_realism_status
from engines.rag import rag_pipeline
from game.mission_engine import (
    get_next_mission, 
    get_live_directions, 
    get_gemini_persona_chat, 
    generate_quiz,
    submit_quiz_answer
)
from data.data import locations

# ── App Initialization ──────────────────────────────────────────────────────

app = FastAPI(
    title="SmartMap Unified Backend",
    description="The complete AI logic engine for SmartMap — consolidated for maximum performance."
)

# ── Data Models ─────────────────────────────────────────────────────────────

class VerifyRequest(BaseModel):
    id: str
    name: str
    category: str
    image_url: Optional[str] = None
    lat: float
    lng: float
    rating: float = 0

class QueryRequest(BaseModel):
    query: str
    location: Optional[Dict[str, float]] = None
    fast_mode: bool = True
    locations_list: List[Dict[str, Any]] = []

class QuizSubmitRequest(BaseModel):
    location_id: str
    is_correct: bool

class LocationRecord(BaseModel):
    id: str
    name: str
    category: str
    image_url: Optional[str] = None
    lat: float
    lng: float
    rating: float

# ── Endpoints ───────────────────────────────────────────────────────────────

@app.get("/")
async def status():
    return {
        "status": "online",
        "service": "SmartMap Unified Backend",
        "version": "5.0.0 (Unified)",
        "endpoints": [
            "/verify", 
            "/query", 
            "/rag", 
            "/mission/next", 
            "/mission/persona", 
            "/quiz/generate", 
            "/quiz/submit",
            "/navigation/guide"
        ]
    }

@app.get("/query", response_model=List[LocationRecord])
async def database_query(
    q: Optional[str] = Query(None),
    cat: Optional[str] = Query(None)
):
    """Simple database-driven search for locations."""
    results = locations
    if q:
        results = [l for l in results if q.lower() in l["name"].lower()]
    if cat:
        results = [l for l in results if cat.lower() == l["category"].lower()]
    return results

@app.post("/verify")
async def verify_location(request: VerifyRequest):
    """
    Runs the 4-layer AI Verification on a location based on its stored image.
    """
    record = request.model_dump()
    
    try:
        result = verify_location_image(
            record.get("image_url", ""), 
            location_name=record["name"], 
            category=record["category"]
        )
        return {
            "valid": result["is_verified"],
            "confidence": result["image_confidence"],
            "reasoning": result["summary"],
            "image_confidence": result["image_confidence"],
            "is_verified": result["is_verified"],
            "verdict": result["verdict"],
            "summary": result["summary"],
            "layers": result["layers"],
            "metadata": {
                "id": record["id"],
                "name": record["name"],
                "category": record["category"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rag")
async def rag_query(data: QueryRequest):
    """Advanced AI RAG pipeline query — combines local and external data."""
    return rag_pipeline(
        data.query, 
        location=data.location, 
        fast_mode=data.fast_mode,
        locations_list=data.locations_list
    )

# ── Mission & Game Engine Endpoints ─────────────────────────────────────────

class MissionRequest(BaseModel):
    lat: float
    lng: float
    locations_list: List[Dict[str, Any]] = []

class QuizRequest(BaseModel):
    lat: float
    lng: float
    locations_list: List[Dict[str, Any]] = []
    mode: str = "choice"

@app.post("/mission/next")
async def next_mission(req: MissionRequest):
    """Calculates the best verification mission for the user based on distance and trust needs."""
    return get_next_mission(req.lat, req.lng, locations_override=req.locations_list if req.locations_list else None)

@app.post("/mission/persona")
async def robot_persona(req: MissionRequest):
    """Triggers Gemini-powered dynamic dialogue for the Robotic Car persona."""
    return get_gemini_persona_chat(req.lat, req.lng, locations_override=req.locations_list if req.locations_list else None)

@app.post("/quiz/generate")
async def quiz_generate(req: QuizRequest):
    """
    Generates a Map Verification Quiz.
    Modes: 'choice' (MCQ) or 'binary' (True/False)
    """
    return generate_quiz(mode=req.mode, current_lat=req.lat, current_lng=req.lng, 
                         locations_override=req.locations_list if req.locations_list else None)

@app.post("/quiz/submit")
async def quiz_submit(request: QuizSubmitRequest):
    """
    Submits a quiz result. Correct answers improve the map's trust data!
    """
    return submit_quiz_answer(request.location_id, request.is_correct)

@app.get("/navigation/guide")
async def nav_guide(c_lat: float, c_lng: float, t_lat: float, t_lng: float):
    """Provides human-readable navigation icons and distance updates."""
    return get_live_directions(c_lat, c_lng, t_lat, t_lng)

# ── Main Entry ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("  SmartMap Unified Backend — [PORT 5000]")
    print("  Status: All Systems Consolidated")
    print("="*60 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=5001)