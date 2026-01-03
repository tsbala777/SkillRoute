import os
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
You are an AI Career Decision Agent.

Your job:
- Analyze a student's profile
- Choose ONE best-fit career path
- Be realistic based on skills, time, and learning pace
- Do NOT give multiple options
- Do NOT be motivational
- Be precise and practical

Return ONLY valid JSON in this exact format:
{
  "career": "<career name>",
  "reasoning": "<short explanation>",
  "confidence": <number between 0 and 100>
}
"""

def decide_career(profile: dict) -> dict:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps(profile)}
        ],
        temperature=0.2
    )

    content = response.choices[0].message.content

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON")
