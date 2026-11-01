"""
ai.py
=====
AI-powered Q&A endpoint for IranGard.
"""

import sys
import os

# ---------------------------------------------------------------------------
# Path setup - direct approach
# ---------------------------------------------------------------------------

# Add the ai directory directly
ai_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))),
    "ai"
)
sys.path.insert(0, ai_path)

# ---------------------------------------------------------------------------
# AI module imports
# ---------------------------------------------------------------------------

import importlib.util

def import_from_ai(module_name):
    """Helper to import from ai directory"""
    module_path = os.path.join(ai_path, f"{module_name}.py")
    spec = importlib.util.spec_from_file_location(module_name, module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

router_module = import_from_ai("router")
rag_engine_module = import_from_ai("rag_engine")
database_module = import_from_ai("database")

route = router_module.route
db_exists = rag_engine_module.db_exists
test_connection = database_module.test_connection

import ollama

# ---------------------------------------------------------------------------
# FastAPI imports
# ---------------------------------------------------------------------------

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Router setup
# ---------------------------------------------------------------------------

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


class AskRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=3,
        max_length=500,
        example="جاذبه‌های تاریخی اصفهان کدومان؟"
    )


class AskResponse(BaseModel):
    success: bool
    data: dict


class HealthResponse(BaseModel):
    success: bool
    data: dict


@router.post("/ask", response_model=AskResponse)
def ask(body: AskRequest):
    try:
        result = route(body.question)

        return {
            "success": True,
            "data": {
                "answer": result["answer"],
                "source": result["source"],
                "tier": result["tier"],
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI pipeline error: {str(e)}"
        )


@router.get("/health", response_model=HealthResponse)
def health_check():
    services = {}

    try:
        ollama.list()
        services["ollama"] = {"status": "ok"}
    except Exception as e:
        services["ollama"] = {"status": "error", "detail": str(e)}

    try:
        vector_db_ready = db_exists()
        services["chroma_db"] = {"status": "ok" if vector_db_ready else "not_built"}
    except Exception as e:
        services["chroma_db"] = {"status": "error", "detail": str(e)}

    try:
        db_ok = test_connection()
        services["postgres"] = {"status": "ok" if db_ok else "error"}
    except Exception as e:
        services["postgres"] = {"status": "error", "detail": str(e)}

    all_ok = all(s["status"] == "ok" for s in services.values())

    return {
        "success": all_ok,
        "data": {
            "status": "healthy" if all_ok else "degraded",
            "services": services
        }
    }