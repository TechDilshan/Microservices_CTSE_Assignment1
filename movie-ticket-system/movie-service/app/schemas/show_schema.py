from pydantic import BaseModel

class Show(BaseModel):
    movie_id: str
    theatre: str
    time: str
    available_seats: int