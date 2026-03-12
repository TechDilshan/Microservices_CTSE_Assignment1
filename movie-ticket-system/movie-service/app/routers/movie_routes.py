from fastapi import APIRouter, Depends
from app.schemas.movie_schema import Movie
from app.services.movie_service import *
from app.middleware.auth import verify_token

router = APIRouter()


@router.post("/movies")
def create(movie: Movie, user=Depends(verify_token)):
    movie_id = create_movie(movie.dict())
    return {"movie_id": movie_id}


@router.get("/movies")
def movies():
    return get_all_movies()


@router.get("/movies/{id}")
def movie(id: str):
    return get_movie(id)


@router.put("/movies/{id}")
def update(id: str, movie: Movie, user=Depends(verify_token)):
    update_movie(id, movie.dict())
    return {"message": "Movie updated"}


@router.delete("/movies/{id}")
def delete(id: str, user=Depends(verify_token)):
    delete_movie(id)
    return {"message": "Movie deleted"}