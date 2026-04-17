from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from .. import models, schemas, database, auth
from ..utils import ai
import pypdf
import io

router = APIRouter(prefix="/interview", tags=["interview"])

@router.post("/generate-question")
async def generate_question(
    data: schemas.InterviewCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    if data.resumeContext and len(data.resumeContext) > 50:
        question_text = await ai.generate_resume_based_question(data.role, data.difficulty, data.resumeContext)
    else:
        question_text = await ai.generate_question(data.role, data.difficulty)
        
    interview = models.Interview(
        userId=current_user.id,
        role=data.role,
        difficulty=data.difficulty,
        question=question_text
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    
    return {"interviewId": interview.id, "question": question_text}

@router.post("/submit")
async def submit_interview(
    data: schemas.InterviewSubmit,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    interview = db.query(models.Interview).filter(
        models.Interview.id == data.interviewId,
        models.Interview.userId == current_user.id
    ).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
        
    eval_result = await ai.evaluate_answer(interview.question, data.answerText, interview.difficulty)
    
    interview.answerText = data.answerText
    interview.overallScore = eval_result.get("overallScore")
    interview.strengths = eval_result.get("strengths", [])
    interview.improvements = eval_result.get("improvements", [])
    interview.dimensions = eval_result.get("dimensions", [])
    
    db.commit()
    return {"resultId": interview.id}

@router.get("/history", response_model=list[schemas.InterviewResponse])
def get_history(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    history = db.query(models.Interview).filter(
        models.Interview.userId == current_user.id
    ).order_by(models.Interview.createdAt.desc()).all()
    return history

@router.get("/result/{id}", response_model=schemas.InterviewResponse)
def get_result(
    id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    interview = db.query(models.Interview).filter(
        models.Interview.id == id,
        models.Interview.userId == current_user.id
    ).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Result not found")
        
    return interview

@router.post("/extract-resume")
async def extract_resume(
    resume: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user)
):
    if not resume:
        raise HTTPException(status_code=400, detail="No file uploaded")
        
    try:
        print(f"DEBUG: Extracting resume for user {current_user.email}, file: {resume.filename}")
        content = await resume.read()
        pdf_reader = pypdf.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
            
        text = " ".join(text.split()).strip()
        if len(text) > 2000:
            text = text[:2000] + "..."
            
        return {"text": text, "pages": len(pdf_reader.pages)}
    except Exception as e:
        import traceback
        print(f"RESUME EXTRACTION ERROR: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to extract resume text: {str(e)}")

@router.post("/generate-quiz")
async def generate_quiz(
    data: schemas.InterviewCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    if not data.resumeContext:
        questions_text = await ai.generate_quiz_questions(data.role, data.difficulty, "No resume provided")
    else:
        questions_text = await ai.generate_quiz_questions(data.role, data.difficulty, data.resumeContext)
    
    # Return just the text. Frontend will handle submission one by one.
    return {"questions": questions_text}

@router.post("/submit-quiz")
async def submit_quiz_answer(
    data: schemas.QuizSubmit,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    # 1. Create the interview record now
    interview = models.Interview(
        userId=current_user.id,
        role=data.role,
        difficulty=data.difficulty,
        question=data.question,
        answerText=data.answerText
    )
    
    # 2. Evaluate
    eval_result = await ai.evaluate_answer(data.question, data.answerText, data.difficulty)
    
    interview.overallScore = eval_result.get("overallScore")
    interview.strengths = eval_result.get("strengths", [])
    interview.improvements = eval_result.get("improvements", [])
    interview.dimensions = eval_result.get("dimensions", [])
    
    db.add(interview)
    db.commit()
    db.refresh(interview)
    
    return {"resultId": interview.id}
@router.post("/generate-followup")
async def generate_followup(
    data: schemas.FollowUpRequest,
    current_user: models.User = Depends(auth.get_current_user)
):
    question_text = await ai.generate_followup_question(
        data.role, 
        data.previousQuestion, 
        data.previousAnswer
    )
    return {"question": question_text}
@router.delete("/{id}")
async def delete_interview(
    id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    interview = db.query(models.Interview).filter(
        models.Interview.id == id,
        models.Interview.userId == current_user.id
    ).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found or unauthorized")
        
    db.delete(interview)
    db.commit()
    return {"message": "Interview deleted successfully"}
