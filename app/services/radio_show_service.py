import pandas as pd
from pathlib import Path
from typing import List, Dict, Optional
from ..models.radio_show import RadioShow

class RadioShowService:
    """Servicio para gestionar los datos de los programas de radio."""

    def __init__(self):
        self.shows_data: Dict[str, pd.DataFrame] = {}
        self._load_data()

    def _load_data(self) -> None:
        """Carga los datos de los CSV en memoria."""
        data_dir = Path("data")
        
        # Mapeo de nombres de archivo a nombres de programa
        files_mapping = {
            "6x3_all.csv": "6x3",
            "Discopolis_all.csv": "Discopolis",
            "Musica_y_significado_all.csv": "Música y Significado"
        }

        for file_name, programa in files_mapping.items():
            file_path = data_dir / file_name
            if file_path.exists():
                df = pd.read_csv(file_path, sep=";")
                df["programa"] = programa
                self.shows_data[programa] = df

    def get_all_shows(self, programa: Optional[str] = None) -> List[RadioShow]:
        """Obtiene todos los episodios, opcionalmente filtrados por programa."""
        if programa:
            if programa not in self.shows_data:
                return []
            df = self.shows_data[programa]
        else:
            df = pd.concat(self.shows_data.values())
        
        return [
            RadioShow(
                programa=row["programa"],
                episodio=row["Episodio n"],
                titulo=row["Titulo"],
                url=row["URL"],
                año=row["Año"],
                mes=row["Mes"]
            )
            for _, row in df.iterrows()
        ]

    def get_shows_by_year(self, año: int) -> List[RadioShow]:
        """Obtiene todos los episodios de un año específico."""
        all_shows = pd.concat(self.shows_data.values())
        filtered_shows = all_shows[all_shows["Año"] == año]
        
        return [
            RadioShow(
                programa=row["programa"],
                episodio=row["Episodio n"],
                titulo=row["Titulo"],
                url=row["URL"],
                año=row["Año"],
                mes=row["Mes"]
            )
            for _, row in filtered_shows.iterrows()
        ]

    def search_by_title(self, query: str) -> List[RadioShow]:
        """Busca episodios por título."""
        all_shows = pd.concat(self.shows_data.values())
        filtered_shows = all_shows[all_shows["Titulo"].str.contains(query, case=False, na=False)]
        
        return [
            RadioShow(
                programa=row["programa"],
                episodio=row["Episodio n"],
                titulo=row["Titulo"],
                url=row["URL"],
                año=row["Año"],
                mes=row["Mes"]
            )
            for _, row in filtered_shows.iterrows()
        ] 