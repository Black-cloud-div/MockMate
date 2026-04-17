from pydantic import BaseModel
from typing import Optional, List, Any

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    name: str
    password: str

class UserLogin(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    name: str
    careerGoal: Optional[str] = None
    experienceLevel: Optional[str] = None
    emailNotifs: bool
    publicProfile: bool
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    token: str

# Interview Schemas
class InterviewCreate(BaseModel):
    role: str
    difficulty: Optional[str] = "medium"
    resumeContext: Optional[str] = None

class InterviewSubmit(BaseModel):
    interviewId: int
    answerText: str

class QuizSubmit(BaseModel):
    role: str
    difficulty: str
    question: str
    answerText: str

class Dimension(BaseModel):
    metric: str
    value: int

class InterviewResponse(BaseModel):
    id: int
    role: str
    difficulty: str
    question: str
    answerText: Optional[str] = None
    overallScore: Optional[int] = None
    strengths: List[str] = []
    improvements: List[str] = []
    dimensions: List[Dimension] = []
    createdAt: Any

    class Config:
        from_attributes = True

# Voice Schemas
class VoiceProcess(BaseModel):
    role: str
    question: str
    answerText: Optional[str] = None

class VoiceResponse(BaseModel):
    success: bool
    transcript: str
    feedback: str
    scores: dict
class FollowUpRequest(BaseModel):
    role: str
    previousQuestion: str
    previousAnswer: str
