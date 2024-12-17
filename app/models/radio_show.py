from pydantic import BaseModel
from typing import Optional

class RadioShow(BaseModel):
    """Modelo que representa un episodio de un programa de radio."""
    
    programa: str
    episodio: str
    titulo: str
    url: str
    año: int
    mes: int

    class Config:
        """Configuración del modelo."""
        from_attributes = True 