import tensorflow as tf
import os
import matplotlib.pyplot as plt

# Ruta del dataset
path = r"D:\Windows\Documentos\MediScann\modelIA\kaggle"

# Configuraciones
img_height, img_width = 224, 224
batch_size = 4

# Cargar datasets
train_ds = tf.keras.preprocessing.image_dataset_from_directory(
    os.path.join(path, "train"), image_size=(img_height, img_width),
    batch_size=batch_size, label_mode='int'
)
val_ds = tf.keras.preprocessing.image_dataset_from_directory(
    os.path.join(path, "val"), image_size=(img_height, img_width),
    batch_size=batch_size, label_mode='int'
)
test_ds = tf.keras.preprocessing.image_dataset_from_directory(
    os.path.join(path, "test"), image_size=(img_height, img_width),
    batch_size=1, label_mode='int'
)

# Nombres de clases
class_names = train_ds.class_names
print("Clases detectadas:", class_names)

# Mejorar rendimiento de lectura
AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.shuffle(1000).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

# Modelo base (MobileNetV2 congelado)
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(img_height, img_width, 3),
    include_top=False, weights='imagenet'
)
base_model.trainable = False

# Modelo completo
model = tf.keras.Sequential([
    base_model,
    tf.keras.layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(len(class_names), activation='softmax')
])

# Compilación
model.compile(
    optimizer='adam',
    loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False),
    metrics=['accuracy']
)

# Entrenamiento
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=1
)

# Evaluar en Test
test_loss, test_accuracy = model.evaluate(test_ds)
print(f"\nPrecisión en Test Set: {test_accuracy:.2f}")

# Guardar modelo y clases
model.save("skin_disease_model.h5")
with open("class_names.txt", "w") as f:
    for class_name in class_names:
        f.write(class_name + "\n")

# Graficar precisión y pérdida
fig, axs = plt.subplots(1, 2, figsize=(12, 5))

# Precisión
axs[0].plot(history.history['accuracy'], label='Entrenamiento')
axs[0].plot(history.history['val_accuracy'], label='Validación')
axs[0].set_title('Precisión por Época')
axs[0].set_xlabel('Época')
axs[0].set_ylabel('Precisión')
axs[0].legend()
axs[0].grid(True)

# Pérdida
axs[1].plot(history.history['loss'], label='Entrenamiento')
axs[1].plot(history.history['val_loss'], label='Validación')
axs[1].set_title('Pérdida por Época')
axs[1].set_xlabel('Época')
axs[1].set_ylabel('Pérdida')
axs[1].legend()
axs[1].grid(True)

plt.tight_layout()

# Mostrar en pantalla
plt.show()

# Guardar gráfica como imagen
fig.savefig("training_metrics.png")
print("Gráfica de entrenamiento guardada como training_metrics.png")
