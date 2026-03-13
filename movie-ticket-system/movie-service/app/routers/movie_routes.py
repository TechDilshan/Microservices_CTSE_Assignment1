from fastapi import APIRouter, Depends, Query
from app.schemas.movie_schema import MovieCreate, MovieUpdate
from app.services.movie_service import create_movie, get_all_movies, get_movie, update_movie, delete_movie
from app.middleware.auth import require_hall_owner_or_admin

router = APIRouter()


@router.post("/movies")
def create(movie: MovieCreate, user=Depends(require_hall_owner_or_admin)):
    movie_id = create_movie(movie.model_dump())
    return {"movie_id": movie_id}


@router.get("/movies")
def movies(hallId: str = Query(None, alias="hallId")):
    return get_all_movies(hall_id=hallId)


@router.get("/movies/{id}")
def movie(id: str):
    return get_movie(id)


@router.put("/movies/{id}")
def update(id: str, movie: MovieUpdate, user=Depends(require_hall_owner_or_admin)):
    data = {k: v for k, v in movie.model_dump().items() if v is not None}
    if data:
        update_movie(id, data)
    return {"message": "Movie updated"}


@router.delete("/movies/{id}")
def delete(id: str, user=Depends(require_hall_owner_or_admin)):
    delete_movie(id)
    return {"message": "Movie deleted"}
