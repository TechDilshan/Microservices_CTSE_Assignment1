from pydantic import BaseModel
from typing import List, Optional
from datetime import date


class PriceSchema(BaseModel):
    ODC_Full: float = 0
    ODC_Half: float = 0
    Balcony: float = 0
    Box: float = 0


class MovieCreate(BaseModel):
    hallId: str
    name: str
    startDate: date
    endDate: date
    duration: int
    language: str
    genre: str
    movieImageUrl: Optional[str] = ""
    showTime: List[str] = []
    price: Optional[PriceSchema] = None


class MovieUpdate(BaseModel):
    name: Optional[str] = None
    startDate: Optional[date] = None
    endDate: Optional[date] = None
    duration: Optional[int] = None
    language: Optional[str] = None
    genre: Optional[str] = None
    movieImageUrl: Optional[str] = None
    showTime: Optional[List[str]] = None
    price: Optional[PriceSchema] = None
