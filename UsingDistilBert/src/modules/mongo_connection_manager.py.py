from src.parameters import *
from pymongo import MongoClient

class MongoConnection:
    def __init__(self, user_uri, admin_uri):
        self.client_user = MongoClient(user_uri)
        self.client_admin = MongoClient(admin_uri)
        self.db_user = self.client_user.megatronUser
        self.db_admin = self.client_admin.megatronDB

    def get_databases(self):
        return self.db_user, self.db_admin

# Usage

mongo_conn = MongoConnection(MONGODB_USER_URL, MONGODB_ADMIN_URL)
user_db, admin_db = mongo_conn.get_databases()
