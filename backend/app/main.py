from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import PROJECT_NAME, ENV
from app.routes.career import router as career_router
from app.routes.students import router as students_router
from app.routes.progress import router as progress_router

app = FastAPI(
    title=PROJECT_NAME,
    description="SkillRoute – AI-powered career path & learning roadmap agent",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://skillroute.vercel.app",  # Your production Vercel app
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    allow_origin_regex=r"https://.*\.vercel\.app"  # Allow all Vercel preview deployments
)

app.include_router(career_router)
app.include_router(students_router)
app.include_router(progress_router)

@app.get("/")
def root():
    return {
        "app": PROJECT_NAME,
        "env": ENV,
        "status": "running"
    }

