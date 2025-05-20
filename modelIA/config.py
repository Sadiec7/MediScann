# config.py
import os

class Config:
    PORT = int(os.getenv("PORT", 5000))
    MODEL_PATH = os.getenv("MODEL_FILE", "skindisease_full.h5")
    CLASSES_PATH = os.getenv("CLASS_NAMES_FILE", "class_names.txt")
    SECOND_MODEL_FILE = os.getenv("SECOND_MODEL_FILE", "dentalalpha.h5")