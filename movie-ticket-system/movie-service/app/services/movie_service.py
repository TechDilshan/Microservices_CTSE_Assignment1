from app.config.database import movies_collection
from bson import ObjectId
from datetime import datetime, date


def _serialize_movie(movie):
    if not movie:
        return None
    doc = dict(movie)
    doc["_id"] = str(doc["_id"])
    if "hallId" in doc and doc["hallId"]:
        doc["hallId"] = str(doc["hallId"])
    for k in ["startDate", "endDate"]:
        if k in doc and doc[k]:
            doc[k] = doc[k].isoformat() if hasattr(doc[k], "isoformat") else str(doc[k])
    return doc


def create_movie(movie: dict) -> str:
    data = {**movie}
    if "price" in data and data["price"]:
        data["price"] = dict(data["price"])
    else:
        data["price"] = {"ODC_Full": 0, "ODC_Half": 0, "Balcony": 0, "Box": 0}
    if isinstance(data.get("hallId"), str):
        data["hallId"] = ObjectId(data["hallId"])
    for f in ["startDate", "endDate"]:
        if f in data:
            v = data[f]
            if isinstance(v, str):
                data[f] = datetime.fromisoformat(v.replace("Z", "+00:00"))
            elif isinstance(v, date) and not isinstance(v, datetime):
                data[f] = datetime.combine(v, datetime.min.time())
    result = movies_collection.insert_one(data)
    return str(result.inserted_id)


def get_all_movies(hall_id: str = None):
    filter_query = {}
    if hall_id:
        filter_query["hallId"] = ObjectId(hall_id)
    movies = []
    # latest created first by ObjectId timestamp
    for movie in movies_collection.find(filter_query).sort("_id", -1):
        movies.append(_serialize_movie(movie))
    return movies


def get_movie(movie_id: str):
    movie = movies_collection.find_one({"_id": ObjectId(movie_id)})
    return _serialize_movie(movie)


def update_movie(movie_id: str, data: dict):
    clean = {k: v for k, v in data.items() if v is not None}
    if "hallId" in clean and isinstance(clean["hallId"], str):
        clean["hallId"] = ObjectId(clean["hallId"])
    for f in ["startDate", "endDate"]:
        if f in clean:
            v = clean[f]
            if isinstance(v, str):
                clean[f] = datetime.fromisoformat(v.replace("Z", "+00:00"))
            elif isinstance(v, date) and not isinstance(v, datetime):
                clean[f] = datetime.combine(v, datetime.min.time())
    if "price" in clean and clean["price"]:
        clean["price"] = dict(clean["price"])
    movies_collection.update_one({"_id": ObjectId(movie_id)}, {"$set": clean})


def delete_movie(movie_id: str):
    movies_collection.delete_one({"_id": ObjectId(movie_id)})
