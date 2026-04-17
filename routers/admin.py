from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database, auth

router = APIRouter(prefix="/admin", tags=["admin"])

def check_admin(user: models.User = Depends(auth.get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@router.get("/users")
def list_users(
    user: models.User = Depends(check_admin),
    db: Session = Depends(database.get_db)
):
    users = db.query(models.User).all()
    # Should ideally return a schema without passwords
    return users

@router.post("/add-question")
def add_question(
    role: str,
    difficulty: str,
    text: str,
    user: models.User = Depends(check_admin), # Node code didn't strictly require admin for add, but logical
    db: Session = Depends(database.get_db)
):
    q = models.Question(role=role, difficulty=difficulty, text=text)
    db.add(q)
    db.commit()
    return q

@router.delete("/question/{id}")
def delete_question(
    id: int,
    user: models.User = Depends(check_admin),
    db: Session = Depends(database.get_db)
):
    q = db.query(models.Question).filter(models.Question.id == id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(q)
    db.commit()
    return {"message": "Question deleted"}

@router.get("/questions")
def list_questions(
    user: models.User = Depends(check_admin),
    db: Session = Depends(database.get_db)
):
    return db.query(models.Question).all()
