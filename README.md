# API de Programas de Radio RTVE

API REST desarrollada con FastAPI para consultar episodios de programas de radio musicales de RTVE.

## 🚀 Características

- Consulta de episodios de programas de radio
- Filtrado por fecha (año y mes)
- Búsqueda por título
- Interfaz web para visualización de datos
- Documentación automática con Swagger UI

## 🛠️ Tecnologías

- Python 3.x
- FastAPI
- Pandas
- Pydantic
- Pytest para testing

## 📋 Requisitos Previos

- Python 3.7 o superior
- pip (gestor de paquetes de Python)

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
```

2. Crear y activar entorno virtual:
```bash
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

## 🚀 Uso

1. Iniciar el servidor:
```bash
uvicorn app.main:app --reload
```

2. Acceder a:
- API: http://localhost:8000
- Documentación: http://localhost:8000/docs
- Interfaz web: http://localhost:8000/index.html

## 📌 Endpoints

- `GET /`: Información general y programas disponibles
- `GET /programas/`: Lista todos los episodios (opcional: filtrar por programa)
- `GET /programas/fecha/{anio}`: Filtra episodios por año y mes (opcional)
- `GET /programas/buscar/`: Búsqueda de episodios por título

## 📁 Estructura del Proyecto

```
.
├── app/
│   ├── main.py           # Punto de entrada de la aplicación
│   ├── models/          # Modelos de datos
│   ├── services/        # Lógica de negocio
│   ├── schemas/         # Esquemas Pydantic
│   ├── database/        # Configuración de base de datos
│   └── static/          # Archivos estáticos para la interfaz web
├── tests/               # Tests unitarios y de integración
├── docs/               # Documentación adicional
├── data/               # Datos de la aplicación
└── requirements.txt    # Dependencias del proyecto
```

## ⚙️ Configuración

La aplicación utiliza archivos de configuración para gestionar:
- Conexiones a bases de datos
- Parámetros de la API
- Rutas de archivos estáticos

## 🧪 Tests

Ejecutar los tests con:
```bash
pytest
```

## 📄 Licencia

Este proyecto está bajo la Licencia especificada en el archivo `LICENSE`.
