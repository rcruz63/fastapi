import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.radio_show_service import RadioShowService

@pytest.fixture
def client():
    """Fixture que proporciona un cliente de prueba para la API."""
    return TestClient(app)

@pytest.fixture
def radio_service():
    """Fixture que proporciona una instancia del servicio de radio."""
    return RadioShowService() 