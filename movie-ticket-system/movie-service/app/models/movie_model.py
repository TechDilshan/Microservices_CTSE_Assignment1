def movie_entity(movie) -> dict:

    return {
        "id": str(movie["_id"]),
        "title": movie["title"],
        "genre": movie["genre"],
        "duration": movie["duration"],
        "language": movie["language"],
        "release_date": movie["release_date"]
    }