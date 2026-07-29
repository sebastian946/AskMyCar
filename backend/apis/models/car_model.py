from pydantic import BaseModel, Field

class Car(BaseModel):
    brand: str = Field(min_length=1, max_length=100)
    model: str = Field(min_length=1, max_length=100)
    year: str = Field(min_length=1, max_length=100)

class ChatRequest(BaseModel):
    car: Car
    question: str = Field(min_length=1, max_length=1000)

class ManualResponse(BaseModel):
    message: str

class ChatResponse(BaseModel):
    answer: str