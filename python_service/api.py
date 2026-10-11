import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from pipeline import run_research_pipeline

load_dotenv()

app = FastAPI(title="Multi-Agent AI Research System")

frontend_origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv("FRONTEND_URLS", "").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


class ResearchRequest(BaseModel):
    topic: str = Field(min_length=2, max_length=300)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "python-research-api"}


@app.post("/research")
def research(request: ResearchRequest):
    topic = request.topic.strip()

    if len(topic) < 2:
        raise HTTPException(
            status_code=400,
            detail="Please enter a research topic."
        )

    
    try:
        result = run_research_pipeline(topic)
        return {
            "topic": topic,
            "search_results": result["search_results"],
            "scraped_content": result["scraped_content"],
            "report": result["report"],
            "feedback": result["feedback"],
        }

    except Exception as exc:
        logging.exception("Research pipeline failed")

        # Handle Gemini rate-limit / quota errors.
        error_text = str(exc).lower()

        if (
            "429" in error_text
            or "resource_exhausted" in error_text
            or "quota exceeded" in error_text
            or "rate limit" in error_text
        ):
            raise HTTPException(
                status_code=429,
                detail="The AI model quota has been exceeded. Please try again later."
            ) from exc

        raise HTTPException(
            status_code=500,
            detail="Research failed. Please try again."
        ) from exc
