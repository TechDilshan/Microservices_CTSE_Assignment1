from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "moviedb")

HALL_ID = "66f000000000000000000010"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
movies = db["movies"]

SAMPLE_MOVIES = [
    {
        "hallId": ObjectId(HALL_ID),
        "name": "Avengers: Endgame",
        "startDate": datetime(2024, 2, 1),
        "endDate": datetime(2024, 2, 28),
        "duration": 180,
        "language": "English",
        "genre": "Action",
        "movieImageUrl": "https://via.placeholder.com/600x800?text=Avengers",
        "showTime": ["10:00", "14:00", "18:00"],
        "price": {"ODC_Full": 500, "ODC_Half": 300, "Balcony": 800, "Box": 1000},
    },
    {
        "hallId": ObjectId(HALL_ID),
        "name": "Inception",
        "startDate": datetime(2024, 2, 5),
        "endDate": datetime(2024, 2, 20),
        "duration": 148,
        "language": "English",
        "genre": "Sci-Fi",
        "movieImageUrl": "https://via.placeholder.com/600x800?text=Inception",
        "showTime": ["11:00", "15:00", "19:00"],
        "price": {"ODC_Full": 450, "ODC_Half": 280, "Balcony": 750, "Box": 950},
    },
    {
        "hallId": ObjectId(HALL_ID),
        "name": "Spider-Man: No Way Home",
        "startDate": datetime(2024, 3, 1),
        "endDate": datetime(2024, 3, 31),
        "duration": 150,
        "language": "English",
        "genre": "Action",
        "movieImageUrl": "https://via.placeholder.com/600x800?text=Spider-Man",
        "showTime": ["09:30", "13:30", "17:30", "21:30"],
        "price": {"ODC_Full": 480, "ODC_Half": 290, "Balcony": 780, "Box": 980},
    },
    {
        "hallId": ObjectId(HALL_ID),
        "name": "Frozen II",
        "startDate": datetime(2024, 4, 1),
        "endDate": datetime(2024, 4, 30),
        "duration": 103,
        "language": "English",
        "genre": "Animation",
        "movieImageUrl": "https://via.placeholder.com/600x800?text=Frozen+II",
        "showTime": ["10:00", "12:30", "15:00"],
        "price": {"ODC_Full": 400, "ODC_Half": 250, "Balcony": 700, "Box": 900},
    },
    {
        "hallId": ObjectId(HALL_ID),
        "name": "KGF: Chapter 2",
        "startDate": datetime(2024, 5, 1),
        "endDate": datetime(2024, 5, 31),
        "duration": 168,
        "language": "Kannada",
        "genre": "Action",
        "movieImageUrl": "https://via.placeholder.com/600x800?text=KGF+2",
        "showTime": ["11:00", "16:00", "21:00"],
        "price": {"ODC_Full": 550, "ODC_Half": 320, "Balcony": 820, "Box": 1050},
    },
]


def run():
    try:
        for m in SAMPLE_MOVIES:
            existing = movies.find_one({"name": m["name"], "hallId": m["hallId"]})
            if existing:
                print(f"Movie already exists: {m['name']}")
                continue
            result = movies.insert_one(m)
            print(f"Inserted movie {m['name']} with id={result.inserted_id}")
    finally:
        client.close()


if __name__ == "__main__":
    run()
