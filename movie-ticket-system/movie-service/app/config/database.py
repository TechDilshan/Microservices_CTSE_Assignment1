from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))

db = client[os.getenv("DB_NAME")]

movies_collection = db["movies"]
shows_collection = db["shows"]