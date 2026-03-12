from fastapi import APIRouter, Depends
from app.schemas.show_schema import Show
from app.services.show_service import *
from app.middleware.auth import verify_token

router = APIRouter()


@router.post("/shows")
def create(show: Show, user=Depends(verify_token)):
    show_id = create_show(show.dict())
    return {"show_id": show_id}


@router.get("/shows")
def shows():
    return get_shows()


@router.get("/shows/{id}")
def show(id: str):
    return get_show(id)


@router.put("/shows/{id}")
def update(id: str, show: Show, user=Depends(verify_token)):
    update_show(id, show.dict())
    return {"message": "Show updated"}


@router.delete("/shows/{id}")
def delete(id: str, user=Depends(verify_token)):
    delete_show(id)
    return {"message": "Show deleted"}