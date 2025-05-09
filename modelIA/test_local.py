# modelIA/test_local.py

import os
import numpy as np
from tensorflow.keras.preprocessing import image
from model import load_trained_model
from utils import load_class_names
from config import Config

# Carga el modelo y las clases
model = load_trained_model()
class_names = load_class_names(Config.CLASSES_PATH)

# 2️Construye la ruta absoluta a la imagen de prueba
base_dir = os.path.dirname(__file__)
img_path = os.path.join(base_dir, 'test_images', 'acne.jpg')

if not os.path.exists(img_path):
    raise FileNotFoundError(f"Imagen no encontrada: {img_path}")

# 3️Preprocesa exactamente como en tu API
img = image.load_img(img_path, target_size=(64, 64))
arr = image.img_to_array(img) / 255.0
batch = np.expand_dims(arr, axis=0)

# 4️Predicción
preds = model.predict(batch)
idx = np.argmax(preds, axis=1)[0]
print(f"Predicción: {class_names[idx]} (índice {idx})")
