import sys
import ktrain
import numpy as np

from src.modules.logger import logging
from src.modules.exception import CustomException


from src.parameters import DISTILBERT_MODEL_PATH


class DistilBERT:

    def __init__(self, model_path= DISTILBERT_MODEL_PATH):
        self.model_path = DISTILBERT_MODEL_PATH
        # logging.info("Loading model...")
        # self.predictor = ktrain.load_predictor(model_path)
        # logging.info("Model loaded")

    def predict(self, message):
        try:
            logging.info("Loading model...")
            self.predictor = ktrain.load_predictor(self.model_path)
            logging.info("Model loaded")
            logging.info("Predicting...")
            result = self.predictor.predict(message)
            predicts = self.predictor.predict_proba(message)
            max_confidence = np.max(predicts) * 100
            logging.info('Confidence Score:', round(max_confidence, 6))
            response = [max_confidence, [result, 'ticket_gen']]
            logging.info("Prediction done.")
            return response
        except Exception as e:
            CustomException(f"Prediction failed:{e}", sys)
            return None
        