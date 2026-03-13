from fastapi import FastAPI
from app.routers import movie_routes

app = FastAPI(
    title="Movie Service",
    description="Movie management microservice - Halls with movies, showtimes, prices",
    version="2.0"
)

app.include_router(movie_routes.router, prefix="/api")
