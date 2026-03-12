from fastapi import FastAPI
from app.routers import movie_routes, show_routes

app = FastAPI(
    title="Movie Service",
    description="Movie and Show management microservice",
    version="1.0"
)

app = FastAPI()

app.include_router(movie_routes.router, prefix="/api")
app.include_router(show_routes.router, prefix="/api")