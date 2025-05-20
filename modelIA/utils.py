# utils.py
import logging
import numpy as np
from PIL import Image

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s"
    )

def load_class_names(path):
    """
    Lee un archivo de texto con un nombre de clase por línea.
    """
    with open(path, 'r') as f:
        return [line.strip() for line in f]

def preprocess_image(stream, target_size=(64, 64)):
    """
    Recibe un stream de imagen (werkzeug.FileStorage.stream),
    convierte a RGB, redimensiona y normaliza.
    """
    img = Image.open(stream).convert("RGB").resize(target_size)
    arr = np.array(img) / 255.0
    return arr


def preprocess_image2(stream, target_size=(224, 224)):
    """
    Recibe un stream de imagen (werkzeug.FileStorage.stream),
    convierte a RGB, redimensiona y normaliza.
    """
    img = Image.open(stream).convert("RGB").resize(target_size)
    arr = np.array(img) / 255.0
    return arr
