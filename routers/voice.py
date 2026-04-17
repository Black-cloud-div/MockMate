from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from .. import models, schemas, database, auth
from ..utils import ai
import random

router = APIRouter(prefix="/voice", tags=["voice"])

@router.post("/start")
def start_session(current_user: models.User = Depends(auth.get_current_user)):
    return {"sessionId": 123456789, "message": "Session started"}

@router.post("/process", response_model=schemas.VoiceResponse)
async def process_audio(
    data: schemas.VoiceProcess,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    # If audio file is present, would need Whisper to transcribe.
    # Assuming frontend sends 'answerText' for now based on Node implementation.
    
    transcript = data.answerText or "Simulated audio transcript..."
    role = data.role
    question = data.question

    
    # Use AI for feedback
    # Reusing evaluate_answer logic partly, but voice specific
    # For now, mock or simple logic as in Node
    
    if not ai.OPENAI_API_KEY:
        feedback_list = [
             "Great articulation! You covered the key points clearly.",
             "Your answer was structured well.",
             "Excellent response."
        ]
        feedback = random.choice(feedback_list)
        scores = {
            "clarity": random.randint(7, 9),
            "confidence": random.randint(6, 9),
            "overall": random.randint(7, 9)
        }
    else:
        # Proper AI call would go here
        eval_result = await ai.evaluate_answer(question, transcript) # Reuse generic eval for now
        feedback = eval_result.get("feedback", "Good job.")
        scores = {
            "clarity": 8,
            "confidence": 8,
            "overall": eval_result.get("overallScore", 8)
        }

    # Save Log
    log = models.VoiceLog(
        userId=current_user.id,
        role=role,
        question=question,
        audioUrl="simulated_upload",
        transcript=transcript,
        aiFeedback=feedback,
        clarityScore=scores["clarity"],
        confidenceScore=scores["confidence"],
        overallScore=scores["overall"]
    )
    db.add(log)
    db.commit()
    
    return {
        "success": True, 
        "transcript": transcript, 
        "feedback": feedback, 
        "scores": scores
    }

@router.get("/history")
def get_history(
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(database.get_db)
):
    return db.query(models.VoiceLog).filter(models.VoiceLog.userId == current_user.id).order_by(models.VoiceLog.createdAt.desc()).all()
