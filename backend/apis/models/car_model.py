from typing import Literal

from pydantic import BaseModel, Field

class Car(BaseModel):
    brand: str = Field(min_length=1, max_length=100)
    model: str = Field(min_length=1, max_length=100)
    year: str = Field(pattern=r"^\d{4}$", description="Year only, e.g. \"2019\" (no month)")

class ChatRequest(BaseModel):
    car: Car
    question: str = Field(min_length=1, max_length=1000)

class ManualResponse(BaseModel):
    status: Literal["found", "scraped"]
    car: Car
    message: str

class ChatResponse(BaseModel):
    car: Car
    question: str
    answer: str
    sources: list[str] = []