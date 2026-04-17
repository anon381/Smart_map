from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from rag import rag_pipeline
from trust_engine import calculate_trust_score, get_realism_status

app = FastAPI(title="SmartMap AI Verification & RAG System")

class QueryRequest(BaseModel):
    query: str
    location: Optional[dict] = None
    fast_mode: bool = True

class VerifyRequest(BaseModel):
    name: str
    lat: float
    lng: float
    image_url: Optional[str] = None
    contributor_reputation: float = 0.5
    confirmations: int = 0

@app.get("/")
def home():
    return {"message": "SmartMap AI Verification running"}

@app.post("/query")
def query_endpoint(data: QueryRequest):
    return rag_pipeline(
        data.query, 
        location=data.location, 
        fast_mode=data.fast_mode
    )

@app.post("/verify")
def verify_endpoint(data: VerifyRequest):
    # Prepare data for trust engine
    location_data = data.dict()
    
    score = calculate_trust_score(location_data)
    status = get_realism_status(score)
    
    return {
        "name": data.name,
        "trust_score": score,
        "status": status,
        "details": {
            "reputation": data.contributor_reputation,
            "confirmations": data.confirmations,
            "location": {"lat": data.lat, "lng": data.lng}
        }
    }