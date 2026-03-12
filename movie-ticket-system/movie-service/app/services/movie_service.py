from app.config.database import movies_collection
from bson import ObjectId

def create_movie(movie):

    result = movies_collection.insert_one(movie)

    return str(result.inserted_id)


def get_all_movies():

    movies = []

    for movie in movies_collection.find():
        movie["_id"] = str(movie["_id"])
        movies.append(movie)

    return movies


def get_movie(movie_id):

    movie = movies_collection.find_one({"_id": ObjectId(movie_id)})

    if movie:
        movie["_id"] = str(movie["_id"])

    return movie


def update_movie(movie_id, data):

    movies_collection.update_one(
        {"_id": ObjectId(movie_id)},
        {"$set": data}
    )


def delete_movie(movie_id):

    movies_collection.delete_one({"_id": ObjectId(movie_id)})