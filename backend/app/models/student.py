from pydantic import BaseModel, Field
from typing import List, Dict, Literal, Optional


class StudentProfile(BaseModel):
    name: str = Field(..., example="John Doe")
    education: str = Field(..., example="bachelors")
    skills: str = Field(..., example="Python, React, Data Analysis")
    interests: str = Field(..., example="Software Development, Data Science")
    goals: str = Field(..., example="Become a Senior Developer")
    experience: Optional[str] = Field(None, example="2 years as Junior Developer")


class CareerAnalysisProfile(BaseModel):
    interests: List[str] = Field(
        ..., example=["backend", "problem-solving"]
    )

    skills: Dict[str, Literal["beginner", "intermediate", "advanced"]] = Field(
        ..., example={"python": "beginner", "logic": "intermediate"}
    )

    time_per_week: int = Field(
        ..., ge=1, le=60, example=10
    )

    learning_pace: Literal["slow", "medium", "fast"] = Field(
        ..., example="medium"
    )

    goal: str = Field(
        ..., example="software engineering"
    )
