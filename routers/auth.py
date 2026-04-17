from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, database
from .. import auth as auth_utils

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    print(f"DEBUG: Attempting to register user: {user.email}")
    try:
        db_user = db.query(models.User).filter(models.User.email == user.email).first()
        if db_user:
            print("DEBUG: Email already registered")
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = auth_utils.get_password_hash(user.password)
        new_user = models.User(
            name=user.name,
            email=user.email,
            password=hashed_password
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        access_token = auth_utils.create_access_token(data={"id": new_user.id})
        print("DEBUG: Registration successful")
        return {"token": access_token}
    except Exception as e:
        print(f"CRITICAL ERROR in /register: {str(e)}")
        # Re-raise HTTPExceptions as is
        if isinstance(e, HTTPException):
            raise e
        # Generic fallback
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    # Check if user exists and has a password (local account)
    if not db_user or not db_user.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    if not auth_utils.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token = auth_utils.create_access_token(data={"id": db_user.id})
    return {"token": access_token}

class GoogleAuthRequest(schemas.BaseModel):
    email: str
    name: str

@router.post("/google")
def google_auth(
    data: GoogleAuthRequest,
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        user = models.User(
            email=data.email,
            name=data.name or data.email.split("@")[0],
            provider="google",
            password=None 
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    access_token = auth_utils.create_access_token(data={"id": user.id})
    return {"token": access_token}

@router.get("/profile", response_model=schemas.UserResponse)
def get_profile(current_user: models.User = Depends(auth_utils.get_current_user)):
    return current_user

@router.put("/profile", response_model=schemas.UserResponse)
def update_profile(
    updates: dict,
    current_user: models.User = Depends(auth_utils.get_current_user),
    db: Session = Depends(database.get_db)
):
    # This is a bit loose, ideally use Pydantic schema for updates
    for key, value in updates.items():
        if hasattr(current_user, key) and key not in ["id", "password", "email"]:
            setattr(current_user, key, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user
