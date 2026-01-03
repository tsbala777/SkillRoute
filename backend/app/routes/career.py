from fastapi import APIRouter, HTTPException
from app.models.student import StudentProfile
from app.services.career_agent import decide_career

router = APIRouter(
    prefix="/career",
    tags=["Career"]
)

@router.post("/analyze")
def analyze_profile(profile: StudentProfile):
    try:
        decision = decide_career(profile.dict())
        return {
            "status": "success",
            "career_decision": decision
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
