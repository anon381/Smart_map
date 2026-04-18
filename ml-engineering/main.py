"""
main.py — SmartMap Unified Backend (FastAPI)
============================================
The central entry point for the SmartMap ecosystem.
Features:
- /verify : 4-Layer AI Location Verification (ID-based)
- /query  : Smart Database Search & RAG Pipeline
- /rag    : Advanced RAG location search

Run: python main.py
"""
import os
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

# Integration Imports
from image_verification.image_verifier import verify_location_image
from data import locations  # Database simulation
from rag import rag_pipeline
from trust_engine import calculate_trust_score, get_realism_status

# ── App Initialization ──────────────────────────────────────────────────────

app = FastAPI(
    title="SmartMap AI Unified Backend",
    description="Consolidated backend for Image Verification, Database Search, and RAG."
)

# ── Data Models ─────────────────────────────────────────────────────────────

class VerifyIDRequest(BaseModel):
    location_id: str

class QueryRequest(BaseModel):
    query: str
    location: Optional[dict] = None
    fast_mode: bool = True

class LocationRecord(BaseModel):
    id: str
    name: str
    category: str
    image_url: Optional[str] = None
    lat: float
    lng: float
    rating: float

# ── Database Helpers ────────────────────────────────────────────────────────

def get_location_by_id(loc_id: str) -> Optional[dict]:
    return next((loc for loc in locations if loc["id"] == loc_id), None)

def search_local_db(q: str = "", cat: str = "") -> List[dict]:
    results = locations
    if q:
        q = q.lower()
        results = [l for l in results if q in l["name"].lower()]
    if cat:
        cat = cat.lower()
        results = [l for l in results if cat == l["category"].lower()]
    return results

# ── Endpoints ───────────────────────────────────────────────────────────────

@app.get("/")
async def status():
    return {
        "status": "online",
        "service": "SmartMap Unified Backend",
        "version": "2.5.0",
        "endpoints": ["/verify", "/query", "/rag"]
    }

@app.get("/query", response_model=List[LocationRecord])
async def database_query(
    q: Optional[str] = Query(None),
    cat: Optional[str] = Query(None)
):
    """Database-driven search for locations."""
    return search_local_db(q=q, cat=cat)

@app.post("/verify")
async def verify_location(request: VerifyIDRequest):
    """
    Advanced 4-Layer AI Verification.
    Retrieves record from database and verifies the image using Gemini + Zero-AI fallbacks.
    """
    record = get_location_by_id(request.location_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Location ID '{request.location_id}' not found.")
    
    img_url = record.get("image_url")
    if not img_url:
        raise HTTPException(status_code=400, detail="This record has no image to verify.")

    try:
        # Run the 4-layer engine (includes the 90% confidence demo mode)
        result = verify_location_image(
            img_url, 
            location_name=record["name"], 
            category=record["category"]
        )
        return {
            **result,
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
    """Advanced RAG pipeline query."""
    return rag_pipeline(
        data.query, 
        location=data.location, 
        fast_mode=data.fast_mode
    )

# ── Main Entry ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("  SmartMap Unified Backend — [PORT 5000]")
    print("  Entry Point: main.py")
    print("="*60 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=5000)