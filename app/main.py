from fastapi import FastAPI
from typing import Dict

# Crear la instancia de FastAPI
app = FastAPI(
    title="Mi Servicio Web",
    description="API de ejemplo usando FastAPI",
    version="0.1.0"
)

@app.get("/")
async def root() -> Dict[str, str]:
    """
    Endpoint raíz que retorna un mensaje de bienvenida
    
    Returns:
        Dict[str, str]: Diccionario con mensaje de bienvenida
    """
    return {"mensaje": "¡Bienvenido a mi servicio web!"}

@app.get("/health")
async def health_check() -> Dict[str, str]:
    """
    Endpoint para verificar el estado del servicio
    
    Returns:
        Dict[str, str]: Estado del servicio
    """
    return {"estado": "activo"} 