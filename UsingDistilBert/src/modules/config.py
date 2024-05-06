import sys
import configparser
from src.modules.logger import logging
from src.modules.exception import CustomException 

class ConfigLoader:
    def __init__(self, filename='config.ini'):
        self.filename = filename
    
    def read_configuration(self):
        try:
            config = configparser.ConfigParser()
            config.read(self.filename)
            configuration = config['DEFAULT']
            return configuration
        except FileNotFoundError:
            print(f"Configuration file '{self.filename}' not found.")
            return None
        except Exception as e:
            CustomException(f"Error reading configuration: {e}",sys)
            return None

# Loader_instance = ConfigLoader()      
# configuration = Loader_instance.read_configuration()