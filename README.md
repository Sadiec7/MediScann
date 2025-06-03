# MediScann

MediScann es un proyecto de desarrollo que combina una **aplicación móvil multiplataforma** con **inteligencia artificial** para la detección de enfermedades de la piel mediante fotografías y visión por computador. El sistema se compone de tres capas principales:

1. **Client (Mobile App)**
2. **Frontend (Web App)**
3. **ModelIA (Backend de IA)**

A continuación encontrarás la descripción general, estructura, tecnologías empleadas y pasos para instalar, configurar y ejecutar cada módulo del proyecto.

---

## Índice

- [Descripción general](#descripción-general)
- [Características principales](#características-principales)
- [Tecnologías](#tecnologías)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Configuración del entorno](#configuración-del-entorno)
  - [Variables de entorno](#variables-de-entorno)
- [Instrucciones de instalación y ejecución](#instrucciones-de-instalación-y-ejecución)
  - [1. Clonar el repositorio](#1-clonar-el-repositorio)
  - [2. Configurar servicios con Docker Compose](#2-configurar-servicios-con-docker-compose)
  - [3. Iniciar el backend de IA (`modelIA`)](#3-iniciar-el-backend-de-ia-modelia)
  - [4. Iniciar la aplicación web (`frontend`)](#4-iniciar-la-aplicación-web-frontend)
  - [5. Iniciar la aplicación móvil (`client`)](#5-iniciar-la-aplicación-móvil-client)
- [Conceptos de uso](#conceptos-de-uso)
  - [Cómo tomar o seleccionar una foto](#cómo-tomar-o-seleccionar-una-foto)
  - [Cómo visualizar resultados en la web](#cómo-visualizar-resultados-en-la-web)
- [Modelado y entrenamiento de IA](#modelado-y-entrenamiento-de-ia)
- [Licencia](#licencia)

---

## Descripción general

MediScann permite a un usuario final:

- **Capturar o seleccionar una fotografía** de una zona de piel que presente alguna anomalía.
- **Analizar dicha imagen** mediante un modelo de IA (basado en MobileNetV2 entrenado en un dataset especializado) para clasificar posibles enfermedades cutáneas.
- **Ver los resultados** (probabilidades de cada clase) tanto en la propia aplicación móvil como en un panel web de administración/historial.

El flujo de trabajo es el siguiente:

1. El usuario abre la **app móvil** (React Native / Expo).
2. Toma o selecciona una foto de la piel.
3. La imagen se envía al **Backend de IA** (`modelIA`) mediante una petición REST.
4. El backend procesa la imagen, ejecuta el modelo de clasificación y devuelve un JSON con los resultados (etiqueta de enfermedad + probabilidad).
5. La app móvil muestra al usuario la predicción y almacena el historial local.
6. El **Frontend web** (React) permite a administradores o médicos consultar el historial de análisis, revisar estadísticas agregadas y descargar reportes.

---

## Características principales

- **Desktop / Web / Mobile** (multiplataforma)
- **Reconocimiento de imágenes** de lesiones cutáneas usando un modelo CNN (MobileNetV2)
- **Interfaz de usuario sencilla** para profesionales de la salud y pacientes
- **Historial de análisis** y métricas en frontend web
- **Despliegue con Docker Compose** para orquestar servicios de API, Web y modelo de IA
- **Arquitectura modular**: cada módulo (client, frontend, modelIA) es independiente y escalable

---

## Tecnologías

- **Mobile App (Client)**:
  - React Native (Nueva arquitectura habilitada)
  - Expo SDK v52
  - Hooks funcionales (`useState`, `useEffect`, `useNavigation`, etc.)
  - `react-native-image-picker` para tomar/seleccionar fotos
  - Axios / Fetch para llamadas HTTP a la API

- **Web App (Frontend)**:
  - React (CRA o Vite con React)
  - React Router para rutas internas
  - Axios para consumir la API REST del backend
  - Tailwind CSS o CSS Modules para estilos

- **Backend de IA (modelIA)**:
  - Python 3.9+
  - TensorFlow 2.x (MobileNetV2) o PyTorch (según implementación)
  - Flask o FastAPI como framework de API REST
  - Jupyter Notebooks para prototipado y entrenamiento
  - OpenCV / PIL / NumPy para preprocesamiento de imágenes
  - Gunicorn / Uvicorn para servidor de producción

- **Orquestación / DevOps**:
  - Docker + Docker Compose (`docker-compose.yml`)
  - Volúmenes para persistencia de datos (modelos, logs)
  - Variables de entorno para configuración

---

## Estructura de carpetas

```
MediScann/
├── client/             # Código fuente de la aplicación móvil (React Native)
│   ├── App.js
│   ├── index.js
│   ├── components/
│   ├── screens/
│   ├── assets/
│   ├── package.json
│   └── app.json
│
├── frontend/           # Aplicación web (React) para administración y consultas
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.js  # o configuration para Create React App
│
├── modelIA/            # Lógica de IA: entrenamiento y servidor REST
│   ├── notebooks/      # Jupyter Notebooks para exploración y training
│   ├── src/
│   │   ├── app.py      # Punto de entrada del servidor Flask/FastAPI
│   │   ├── model.py    # Funciones para cargar y ejecutar el modelo
│   │   ├── preprocess.py  # Funciones de preprocesamiento de imagen
│   │   └── requirements.txt
│   ├── saved_models/   # Modelos entrenados (weights .h5, .pt, etc.)
│   └── Dockerfile      # Dockerfile específico para el servicio de IA
│
├── .env.sample         # Ejemplo de variables de entorno (renombrar a .env)
├── .gitignore
├── README.md           # Este archivo
└── docker-compose.yml  # Orquestación de servicios
```

---

## Configuración del entorno

Antes de arrancar cualquiera de los módulos, copia el archivo de ejemplo de variables de entorno:

```
cp .env.sample .env
```

Edita `.env` y define al menos:

- `MODELIA_PORT` – Puerto en el que corre el backend de IA (por defecto 5000).
- `FRONTEND_PORT` – Puerto del frontend web (por defecto 3000).
- `CLIENT_API_URL` – URL a la que apunta la app móvil para consumir el backend (por ejemplo, `http://localhost:5000`).
- `DATABASE_URL` – (Opcional) Cadena de conexión si se integra base de datos para historiales.
- Cualquier otra variable que aparezca en tu `.env.sample`.

---

## Instrucciones de instalación y ejecución

### 1. Clonar el repositorio

```
git clone https://github.com/Sadiec7/MediScann.git
cd MediScann
```

### 2. Configurar servicios con Docker Compose (opcional)

Este proyecto incluye un archivo `docker-compose.yml` que levanta simultáneamente:

- El servicio del backend de IA (`modelIA`).
- El servicio del frontend web (`frontend`).
- (Opcional) Una base de datos si se configura en `docker-compose.yml`.

Para levantar todo con Docker Compose:

```
docker-compose up --build
```

- Con esto se generarán los contenedores necesarios (según tu `docker-compose.yml`).
- Por defecto, la app móvil (client) se ejecuta localmente y se conecta al backend en `http://localhost:5000`.
- Si deseas levantar la app móvil dentro de un contenedor, agrega un servicio adicional en `docker-compose.yml` para `client`.

> **Nota**: Si no quieres usar Docker, puedes ejecutar cada módulo de forma independiente siguiendo los pasos a continuación.

---

### 3. Iniciar el backend de IA (`modelIA`)

1. Abre una terminal nueva.
2. Ve a la carpeta `modelIA/`:

   ```
   cd modelIA
   ```

3. (Opcional) Crea y activa un entorno virtual en Python:

   ```
   python3 -m venv .venv
   source .venv/bin/activate   # Linux/macOS
   .venv\Scripts ctivate      # Windows (PowerShell)
   ```

4. Instala las dependencias:

   ```
   pip install -r requirements.txt
   ```

5. Inicia el servidor de IA (Flask o FastAPI). Por ejemplo, si usas Flask en `app.py`:

   ```
   export FLASK_APP=src/app.py
   export FLASK_ENV=development   # (opcional, para recarga automática)
   flask run --host=0.0.0.0 --port=${MODELIA_PORT:-5000}
   ```

   O, si usas Uvicorn con FastAPI:

   ```
   export UVICORN_APP=src.app:app
   uvicorn src.app:app --host 0.0.0.0 --port ${MODELIA_PORT:-5000} --reload
   ```

6. Verifica que el servicio esté en marcha accediendo a:

   ```
   http://localhost:5000/health    # (o la ruta que hayas definido para health check)
   ```

---

### 4. Iniciar la aplicación web (`frontend`)

1. Abre otra terminal.
2. Entra a la carpeta `frontend/`:

   ```
   cd frontend
   ```

3. Instala dependencias de Node.js:

   ```
   npm install
   ```

4. Define en `.env` la variable `VITE_API_URL` (o similar) que apunte al backend de IA, por ejemplo:

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

5. Ejecuta el servidor de desarrollo:

   ```
   npm run dev
   ```

6. Abre tu navegador en:

   ```
   http://localhost:3000
   ```

   (o el puerto que indique la consola).

---

### 5. Iniciar la aplicación móvil (`client`)

> **Requisito**: Tener instalado **Node.js**, **Expo CLI** y un emulador iOS/Android o Expo Go en dispositivo físico.

1. Abre otra terminal.
2. Ve a la carpeta `client/`:

   ```
   cd client
   ```

3. Instala las dependencias de React Native:

   ```
   npm install
   ```

4. Abre (o edita) el archivo `app.json` para revisar la configuración de Expo (nombre de la app, íconos, permisos, etc.).
5. Define en `.env` la variable `CLIENT_API_URL` apuntando al backend de IA. Por ejemplo:

   ```
   CLIENT_API_URL=http://localhost:5000/api
   ```

6. Inicia Expo:

   ```
   npx expo start
   ```

7. Abre la app en tu emulador o escanea el código QR con **Expo Go** para probar en tu dispositivo.

---

## Conceptos de uso

### Cómo tomar o seleccionar una foto

1. En la pantalla principal de la app móvil, presiona “Tomar foto” o “Seleccionar de galería”.
2. Ajusta el recuadro (si aplica) sobre la zona de la piel a analizar.
3. Confirma para enviar la imagen al backend de IA.
4. Mantén conexión a internet local (cableada o Wi-Fi) para que la petición llegue al servidor (o al contenedor Docker).

### Cómo visualizar resultados en la web

1. En el navegador, accede a `http://localhost:3000`.
2. Inicia sesión o crea una cuenta (si tu implementación lo requiere).
3. En el dashboard verás la lista de análisis recientes (fecha, imagen miniatura, etiqueta predicha y probabilidad).
4. Puedes descargar reportes en formato CSV o PDF (según la implementación).

---

## Modelado y entrenamiento de IA

Dentro de la carpeta `modelIA/notebooks/` hay uno o varios notebooks `.ipynb` que muestran:

- **Carga y preprocesamiento** de imágenes (redimensionado, normalización).
- **Definición del modelo** CNN basado en MobileNetV2.
- **Entrenamiento** con el dataset de enfermedades de la piel (dividido en `train/`, `val/`, `test/`).
- **Evaluación del modelo** (matriz de confusión, métricas de precisión/recall/F1).
- **Exportación del modelo** final (`.h5` o `.pt`) en `modelIA/saved_models/`.

Para entrenar desde cero:

1. Coloca tu dataset organizado en carpetas por clase dentro de `modelIA/datasets/`.
2. En el notebook principal, ajusta rutas y parámetros (número de épocas, tasa de aprendizaje, batch size).
3. Ejecuta celdas para entrenar y guardar el modelo.
4. Copia el archivo guardado (`modelIA/saved_models/tu_modelo.h5`) a la carpeta `modelIA/serving/` (si existiera una para servir modelo).

Luego, si tu API en `modelIA/src/app.py` automáticamente carga el último modelo desde `saved_models/`, el servicio estará listo para responder nuevas peticiones.

---

## Licencia

Este proyecto está bajo licencia **MIT**. Consulta el archivo `LICENSE` (si existe) para más detalles.

---

¡Gracias por usar MediScann! Esperemos que esta herramienta contribuya a una detección más rápida y accesible de enfermedades de la piel.
