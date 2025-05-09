# test_local.py
import numpy as np
from tensorflow.keras.preprocessing import image
from model import load_trained_model
from utils import load_class_names
from config import Config

# Instancia modelo y clases
model = load_trained_model()
class_names = load_class_names(Config.CLASSES_PATH)

# Ruta a tu imagen de prueba
img_path = 'acne2.jpg'

# Preprocesado
img = image.load_img(img_path, target_size=(64, 64))
img_array = image.img_to_array(img) / 255.0
batch = np.expand_dims(img_array, axis=0)

# Predicción
preds = model.predict(batch)
idx = np.argmax(preds, axis=1)[0]
print(f"Predicción: {class_names[idx]} (índice {idx})")
