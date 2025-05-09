# model.py
from tensorflow.keras.models import load_model
from config import Config

def load_trained_model():
    """
    Carga el modelo completo (arquitectura + pesos) desde el .h5 generado en Colab.
    """
    return load_model(Config.MODEL_PATH)
