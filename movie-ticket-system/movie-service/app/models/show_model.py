def show_entity(show) -> dict:

    return {
        "id": str(show["_id"]),
        "movie_id": show["movie_id"],
        "theatre": show["theatre"],
        "time": show["time"],
        "available_seats": show["available_seats"]
    }