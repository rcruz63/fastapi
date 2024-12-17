from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    """Prueba el endpoint raíz"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["mensaje"] == "¡Bienvenido a la API de Programas de Radio!"
    assert "programas_disponibles" in data
    assert isinstance(data["programas_disponibles"], list)