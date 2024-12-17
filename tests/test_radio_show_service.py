import pytest
from app.services.radio_show_service import RadioShowService

def test_load_data(radio_service):
    """Test que verifica que los datos se cargan correctamente."""
    assert radio_service.shows_data is not None
    assert len(radio_service.shows_data) > 0
    
    # Verificar que los programas esperados están presentes
    expected_programs = {"6x3", "Discopolis", "Música y Significado"}
    assert set(radio_service.shows_data.keys()) == expected_programs

def test_get_all_shows(radio_service):
    """Test que verifica la obtención de todos los shows."""
    shows = radio_service.get_all_shows()
    assert shows is not None
    assert len(shows) > 0
    
    # Verificar que cada show tiene los campos requeridos
    for show in shows:
        assert show.programa is not None
        assert show.episodio is not None
        assert show.titulo is not None
        assert show.url is not None
        assert show.año is not None
        assert show.mes is not None

def test_get_shows_by_program(radio_service):
    """Test que verifica la filtración por programa."""
    programa = "6x3"
    shows = radio_service.get_all_shows(programa=programa)
    assert shows is not None
    assert len(shows) > 0
    assert all(show.programa == programa for show in shows)

def test_get_shows_by_year(radio_service):
    """Test que verifica la filtración por año."""
    año = 2010
    shows = radio_service.get_shows_by_year(año)
    assert shows is not None
    assert all(show.año == año for show in shows)

def test_search_by_title(radio_service):
    """Test que verifica la búsqueda por título."""
    query = "Beethoven"
    shows = radio_service.search_by_title(query)
    assert shows is not None
    assert all(query.lower() in show.titulo.lower() for show in shows)

def test_invalid_program_returns_empty_list(radio_service):
    """Test que verifica que un programa inválido devuelve lista vacía."""
    shows = radio_service.get_all_shows(programa="Programa Inexistente")
    assert shows == []

def test_invalid_year_returns_empty_list(radio_service):
    """Test que verifica que un año inválido devuelve lista vacía."""
    shows = radio_service.get_shows_by_year(1900)
    assert shows == [] 