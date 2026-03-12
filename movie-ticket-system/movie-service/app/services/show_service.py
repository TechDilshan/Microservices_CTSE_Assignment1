from app.config.database import shows_collection
from bson import ObjectId


def create_show(show):

    result = shows_collection.insert_one(show)

    return str(result.inserted_id)


def get_shows():

    shows = []

    for show in shows_collection.find():
        show["_id"] = str(show["_id"])
        shows.append(show)

    return shows


def get_show(show_id):

    show = shows_collection.find_one({"_id": ObjectId(show_id)})

    if show:
        show["_id"] = str(show["_id"])

    return show


def update_show(show_id, data):

    shows_collection.update_one(
        {"_id": ObjectId(show_id)},
        {"$set": data}
    )


def delete_show(show_id):

    shows_collection.delete_one({"_id": ObjectId(show_id)})