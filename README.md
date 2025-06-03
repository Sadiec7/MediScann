# MediScann

Una aplicación móvil multiplataforma desarrollada con React Native y Expo para el escaneo y análisis de documentos médicos.
🏗️ Arquitectura

MediScann implementa una arquitectura moderna de React Native construida sobre el framework Expo, siguiendo un patrón de código único y despliegue multiplataforma que permite el deployment en iOS, Android y web desde una base de código unificada.
Características Arquitectónicas

    Diseño basado en componentes usando componentes funcionales de React Native App.js:4-11
    Despliegue dirigido por configuración a través del sistema declarativo de Expo
    Abstracción de plataforma que aísla las preocupaciones específicas de cada plataforma
    Nueva arquitectura de React Native habilitada para mejor rendimiento

🚀 Tecnologías

    React Native con nueva arquitectura habilitada
    Expo SDK ~52.0.40 para capacidades de plataforma más recientes
    Componentes funcionales con patrón de hooks moderno
    StyleSheet optimizado para mejor rendimiento

📱 Plataformas Soportadas

    iOS (con soporte para tablets)
    Android (con iconos adaptativos)
    Web (con favicon configurado)

🔧 Estructura del Proyecto

mediScann/  
├── App.js          # Componente raíz de la aplicación  
├── index.js        # Punto de entrada JavaScript  
├── app.json        # Configuración de Expo y plataformas  
└── ...  

Punto de Entrada

La aplicación sigue un patrón tradicional de punto de entrada de React Native con registro específico de Expo: index.js:1-8
🎨 Configuración

El proyecto utiliza una arquitectura dirigida por configuración donde un solo archivo de configuración define comportamientos específicos de plataforma, assets y configuraciones de despliegue a través de app.json.
🛠️ Desarrollo

El proyecto está actualmente en fase de desarrollo inicial, con una estructura de componentes plana adecuada para su etapa actual de desarrollo.
📝 Estado Actual

La aplicación muestra actualmente un mensaje de bienvenida y está lista para el desarrollo de funcionalidades de escaneo médico.
Notes

El proyecto está en sus etapas iniciales de desarrollo, como se evidencia por el mensaje placeholder en el componente principal. La arquitectura está preparada para escalar con funcionalidades más complejas de escaneo y análisis de documentos médicos. La configuración multiplataforma está completamente establecida y lista para despliegue en las tres plataformas objetivo.
