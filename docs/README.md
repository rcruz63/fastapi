# Mi Servicio Web

## Descripción
Servicio web básico construido con FastAPI.

## Instalación

1. Instalar uv (si no está instalado):

```bash
pip install uv
```

2. Crear y activar el entorno virtual:

```bash
uv venv
source .venv/bin/activate
```

3. Instalar las dependencias:

```bash
uv pip install -r requirements.txt
```

4. Ejecutar el servidor:

```bash
uvicorn app.main:app --reload
```

El servidor estará disponible en `http://localhost:8000`

## Documentación API
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Desarrollo

### Instalación de dependencias de desarrollo:

```bash
uv pip install -r requirements.txt
```

### Ejecutar pruebas:

```bash
uv pytest
```

### Ventajas de usar uv
- Instalación de paquetes más rápida
- Mejor manejo de dependencias
- Mejor soporte para entornos virtuales
- Compatibilidad con wheels precompilados
- Menor uso de memoria
