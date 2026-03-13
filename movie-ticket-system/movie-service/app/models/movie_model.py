def movie_entity(movie) -> dict:
    doc = dict(movie)
    doc["_id"] = str(doc["_id"])
    if "hallId" in doc:
        doc["hallId"] = str(doc["hallId"]) if hasattr(doc["hallId"], "__str__") else doc["hallId"]
    return doc
