from pydantic import BaseModel

class Movie(BaseModel):
    title: str
    genre: str
    duration: int
    language: str
    release_date: str