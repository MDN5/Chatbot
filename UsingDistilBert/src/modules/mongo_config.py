from pymongo import MongoClient
from pymongo.database import Database

from src.modules.exception import CustomException
from src.modules.logger import logging

from src.parameters import MONGODB_USER_URL as MONGODB_URL

class MongoConnection:
    """
    A class to manage MongoDB connections.

    Attributes:
        client (MongoClient): The MongoClient instance for user database.
        db (Database): The database object for user data.
        client_admin (MongoClient): The MongoClient instance for admin database.
        db_admin (Database): The database object for admin data.
    """

    def __init__(self) -> None:

        try:
            self.client = MongoClient(MONGODB_URL)
            self.db = self.client.User

            self.client_admin = MongoClient(MONGODB_URL)
            self.db_admin = self.client_admin.DB
        except Exception as e:
            logging.error(f"Error connecting to MongoDB: {e}")
            raise

    def db_connection(self) -> tuple[Database, Database]:
        """
        Establishes connections to user and admin databases.

        Returns:
            tuple: A tuple containing database objects for user and admin data.
        """
        try:
            return self.db, self.db_admin
        except Exception as e:
            logging.error(f"Error getting database connection: {e}")
            raise

# try:
#     mongo_conn = MongoConnection()
#     db, db_admin = mongo_conn.db_connection()
#     print("Connected to MongoDB successfully!")
# except Exception as e:
#     print(f"An error occurred: {e}")
