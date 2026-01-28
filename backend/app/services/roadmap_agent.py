import os
import json
from openai import AsyncOpenAI

client = AsyncOpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

SYSTEM_PROMPT = """
You are an AI Learning Roadmap Planner.

Your task:
- Create a realistic, comprehensive learning roadmap for a given career
- Adapt it to the student's profile, goals, and available time
- Keep the roadmap practical and structured
- Provide 4-6 phases of learning with clear progression
- Include specific resources and milestones for each phase
- Add difficulty ratings and time estimates

Return ONLY valid JSON in this exact format:
{
  "career_decision": {
    "career": "<career title>",
    "reasoning": "<detailed explanation>",
    "confidence": <number 0-100>,
    "skill_match_percentage": <number 0-100>,
    "market_readiness": <number 0-100>,
    "industry_demand": "<trending|stable|declining>",
    "key_strengths": ["<strength 1>", "<strength 2>"],
    "skill_gaps": ["<gap 1>", "<gap 2>"],
    "time_to_job_ready": "<estimated months>",
    "alternatives": [
      {"career": "<alt 1>", "match_score": <0-100>, "reason": "<reason>"}
    ]
  },
  "learning_roadmap": {
    "duration_months": <number>,
    "roadmap": [
      {
        "phase": "Phase 1: Foundations",
        "duration": "4-6 weeks",
        "difficulty": "<beginner|intermediate|advanced>",
        "focus_skills": ["skill1", "skill2"],
        "outcomes": ["outcome1", "outcome2"],
        "milestones": [
          {
            "name": "<milestone name>",
            "description": "<what to achieve>",
            "estimated_hours": <number>,
            "resources": [
              {
                "type": "<course|documentation|project|video>",
                "title": "<resource title>",
                "url": "<url or description>",
                "duration": "<time estimate>"
              }
            ]
          }
        ],
        "prerequisites": ["<prerequisite 1>", "<prerequisite 2>"]
      }
    ]
  }
}
"""

async def generate_roadmap(profile: dict) -> dict:
    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps(profile)}
        ],
        temperature=0.3
    )

    content = response.choices[0].message.content

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        raise ValueError("Roadmap agent returned invalid JSON")


ADAPT_SYSTEM_PROMPT = """
You are an AI Learning Roadmap Adapter.

Your task:
- Analyze the student's current roadmap and their progress.
- If they are progressing well, suggest advanced topics or speed up the timeline.
- If they are stuck or slow, suggest remedial resources or break down steps further.
- Keep the structure consistent with the original roadmap but modify future phases.

Input JSON:
{
  "current_roadmap": { ... },
  "progress": { "completed_phases": X, "total_phases": Y, "streak_days": Z }
}

Return ONLY valid JSON for the new "learning_roadmap" part:
{
  "duration_months": <number>,
  "roadmap": [
    {
      "phase": "Phase X: ...",
      "duration": "...",
      "focus_skills": [...],
      "outcomes": [...]
    }
  ]
}
"""

async def adapt_roadmap(current_data: dict) -> dict:
    
    input_data = {
        "current_roadmap": current_data.get("learning_roadmap"),
        "progress": current_data.get("progress")
    }
    
    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": ADAPT_SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps(input_data)}
        ],
        temperature=0.3
    )

    content = response.choices[0].message.content

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return current_data.get("learning_roadmap")
