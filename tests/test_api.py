from fastapi.testclient import TestClient
from app.main import app

def test_root_endpoint(client):
    """Test que verifica el endpoint raíz."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "mensaje" in data
    assert "programas_disponibles" in data
    assert isinstance(data["programas_disponibles"], list)
    assert len(data["programas_disponibles"]) > 0

def test_get_all_shows_endpoint(client):
    """Test que verifica el endpoint de obtener todos los shows."""
    response = client.get("/programas/")
    assert response.status_code == 200
    shows = response.json()
    assert isinstance(shows, list)
    assert len(shows) > 0
    
    # Verificar estructura de los datos
    first_show = shows[0]
    required_fields = {"programa", "episodio", "titulo", "url", "año", "mes"}
    assert all(field in first_show for field in required_fields)

def test_get_shows_by_program_endpoint(client):
    """Test que verifica el endpoint de filtrado por programa."""
    programa = "6x3"
    response = client.get(f"/programas/?programa={programa}")
    assert response.status_code == 200
    shows = response.json()
    assert isinstance(shows, list)
    assert len(shows) > 0
    assert all(show["programa"] == programa for show in shows)

def test_get_shows_by_date_endpoint(client):
    """Test que verifica el endpoint de filtrado por fecha."""
    año = 2010
    mes = 10
    response = client.get(f"/programas/fecha/{año}?mes={mes}")
    assert response.status_code == 200
    shows = response.json()
    assert isinstance(shows, list)
    assert all(show["año"] == año and show["mes"] == mes for show in shows)

def test_get_shows_by_date_and_program_endpoint(client):
    """Test que verifica el endpoint de filtrado por fecha y programa."""
    año = 2010
    mes = 10
    programa = "Música y Significado"
    response = client.get(f"/programas/fecha/{año}?mes={mes}&programa={programa}")
    assert response.status_code == 200
    shows = response.json()
    assert isinstance(shows, list)
    if len(shows) > 0:  # Solo verificar si hay resultados
        assert all(
            show["año"] == año and 
            show["mes"] == mes and 
            show["programa"] == programa 
            for show in shows
        )

def test_search_shows_endpoint(client):
    """Test que verifica el endpoint de búsqueda por título."""
    query = "Beethoven"
    response = client.get(f"/programas/buscar/?q={query}")
    assert response.status_code == 200
    shows = response.json()
    assert isinstance(shows, list)
    assert all(query.lower() in show["titulo"].lower() for show in shows)

def test_search_shows_min_length_validation(client):
    """Test que verifica la validación de longitud mínima en la búsqueda."""
    query = "ab"  # Menos de 3 caracteres
    response = client.get(f"/programas/buscar/?q={query}")
    assert response.status_code == 422  # Validation error

def test_invalid_date_returns_empty_list(client):
    """Test que verifica que una fecha inválida devuelve lista vacía."""
    año = 1900
    mes = 1
    response = client.get(f"/programas/fecha/{año}?mes={mes}")
    assert response.status_code == 200
    shows = response.json()
    assert shows == [] 