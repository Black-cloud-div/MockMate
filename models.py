from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import json

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=True)
    provider = Column(String, default="local")
    role = Column(String, default="user")
    careerGoal = Column(String, default="Senior Software Engineer")
    experienceLevel = Column(String, default="0-2 Years (Junior)")
    emailNotifs = Column(Boolean, default=True)
    publicProfile = Column(Boolean, default=False)
    createdAt = Column(TIMESTAMP, server_default=func.now())
    updatedAt = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    interviews = relationship("Interview", back_populates="user")
    voice_logs = relationship("VoiceLog", back_populates="user")

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id"))
    role = Column(String)
    difficulty = Column(String)
    question = Column(Text)
    answerText = Column(Text, nullable=True)
    overallScore = Column(Integer, nullable=True)
    
    # Store JSON as string
    strengths_str = Column("strengths", Text, nullable=True)
    improvements_str = Column("improvements", Text, nullable=True)
    dimensions_str = Column("dimensions", Text, nullable=True)

    createdAt = Column(TIMESTAMP, server_default=func.now())
    updatedAt = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="interviews")

    @property
    def strengths(self):
        return json.loads(self.strengths_str) if self.strengths_str else []

    @strengths.setter
    def strengths(self, value):
        self.strengths_str = json.dumps(value)

    @property
    def improvements(self):
        return json.loads(self.improvements_str) if self.improvements_str else []

    @improvements.setter
    def improvements(self, value):
        self.improvements_str = json.dumps(value)

    @property
    def dimensions(self):
        return json.loads(self.dimensions_str) if self.dimensions_str else []

    @dimensions.setter
    def dimensions(self, value):
        self.dimensions_str = json.dumps(value)

class VoiceLog(Base):
    __tablename__ = "voice_logs"

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id"))
    role = Column(String)
    question = Column(Text)
    audioUrl = Column(String)
    transcript = Column(Text)
    aiFeedback = Column(Text)
    clarityScore = Column(Integer)
    confidenceScore = Column(Integer)
    overallScore = Column(Integer)
    createdAt = Column(TIMESTAMP, server_default=func.now())
    
    user = relationship("User", back_populates="voice_logs")

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    role = Column(String)
    difficulty = Column(String)
    text = Column(Text)
