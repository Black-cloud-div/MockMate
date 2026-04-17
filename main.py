from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from .routers import auth, interview, voice, admin, mcq
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Mount API Routers
# Axios base URL is http://localhost:5000/api
# So we want /api/auth, /api/interview, etc.
app.include_router(auth.router, prefix="/api")
app.include_router(interview.router, prefix="/api")
app.include_router(voice.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(mcq.router, prefix="/api")

@app.get("/health")
def health_check():
    return {"message": "AI Mock Interview API running (Python/FastAPI)"}

# Serve Static Files if built
# This allows 'localhost:5000' to serve the app like the Node server did
from fastapi.responses import FileResponse

# ... (previous code)

# Static file serving is removed for Split Deployment (Frontend on Vercel, Backend on Render/HF)

@app.get("/")
def read_root():
    return {"message": "MockMate API is live. Frontend is hosted separately."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
