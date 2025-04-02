import json
from pymongo import MongoClient


MONGO_URI = "mongodb+srv://teenamorin2212:teenamorin@kimnirom.lxsnr.mongodb.net/"


DATABASE_NAME = "kimii_horror"
COLLECTION_NAME = "movies"

def upload_json_to_mongodb(json_file_path):
    """Uploads the content of a JSON file to MongoDB Atlas."""
    try:

        client = MongoClient(MONGO_URI)
        db = client[DATABASE_NAME]
        collection = db[COLLECTION_NAME]


        with open(json_file_path, 'r') as file:
            data = json.load(file)

        # Insert data into MongoDB
        if isinstance(data, list):
            result = collection.insert_many(data)  
        else:
            result = collection.insert_one(data) 

        print(f"Data uploaded successfully. Document IDs: {result.inserted_ids if isinstance(result, list) else result.inserted_id}")

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:

        client.close()

if __name__ == "__main__":

    json_file_path = "movies.json"

    upload_json_to_mongodb(json_file_path)
