from fastapi import FastAPI, Query, HTTPException
from typing import List, Optional
from .models.radio_show import RadioShow
from .services.radio_show_service import RadioShowService

app = FastAPI(
    title="API de Programas de Radio",
    description="API para consultar episodios de programas de radio musicales de RTVE",
    version="1.0.0"
)

# Inicializamos el servicio
radio_service = RadioShowService()

@app.get("/", tags=["General"])
async def root():
    """Endpoint de bienvenida."""
    return {
        "mensaje": "¡Bienvenido a la API de Programas de Radio!",
        "programas_disponibles": list(radio_service.shows_data.keys())
    }

@app.get("/programas/", response_model=List[RadioShow], tags=["Programas"])
async def get_shows(programa: Optional[str] = None):
    """
    Obtiene todos los episodios, opcionalmente filtrados por programa.
    
    Args:
        programa: Nombre del programa a filtrar (opcional)
    """
    return radio_service.get_all_shows(programa)

@app.get("/programas/año/{año}", response_model=List[RadioShow], tags=["Programas"])
async def get_shows_by_year(año: int):
    """
    Obtiene todos los episodios de un año específico.
    
    Args:
        año: Año a filtrar
    """
    return radio_service.get_shows_by_year(año)

@app.get("/programas/buscar/", response_model=List[RadioShow], tags=["Búsqueda"])
async def search_shows(
    q: str = Query(..., min_length=3, description="Término de búsqueda")
):
    """
    Busca episodios por título.
    
    Args:
        q: Término de búsqueda (mínimo 3 caracteres)
    """
    return radio_service.search_by_title(q) 