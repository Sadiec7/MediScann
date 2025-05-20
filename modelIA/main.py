# main.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

from config import Config
from utils import load_class_names, preprocess_image, setup_logging, preprocess_image2
from model import load_trained_model

setup_logging()

app = Flask(__name__)
CORS(app)

# Carga el modelo y las clases al iniciar
model = load_trained_model()
class_names = load_class_names(Config.CLASSES_PATH)

@app.route("/predict", methods=["POST"])
def predict():
    files = request.files.getlist("images")
    #if len(files) != 1:
        #return jsonify({"error": "Se requieren exactamente 3 imágenes"}), 400

    imgs = [preprocess_image(f.stream) for f in files]
    batch = np.stack(imgs, axis=0)
    preds = model.predict(batch)
    labels = [class_names[np.argmax(p)] for p in preds]

    return jsonify({"predictions": labels})

@app.route("/health", methods=["POST"])
def health():
    from model import load_secondary_model

    files = request.files.getlist("images")
    if not files:
        return jsonify({"error": "No se recibió ninguna imagen"}), 400

    try:
        model = load_secondary_model()
        img = preprocess_image2(files[0].stream)
        img_array = np.expand_dims(img, axis=0)

        pred = model.predict(img_array)

        return jsonify({"Predicción": pred.tolist()})  # Retorno exacto como el del script
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=Config.PORT)
