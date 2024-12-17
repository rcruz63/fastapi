// Variables globales
let currentPage = 1;
const itemsPerPage = 10;
let allEpisodes = [];

// Elementos del DOM
const programaSelect = document.getElementById('programaSelect');
const yearSelect = document.getElementById('yearSelect');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const episodesList = document.getElementById('episodesList');
const pagination = document.getElementById('pagination');

// Inicialización
async function init() {
    await loadPrograms();
    await loadYears();
    await loadEpisodes();
    
    // Event listeners
    programaSelect.addEventListener('change', filterEpisodes);
    yearSelect.addEventListener('change', filterEpisodes);
    searchButton.addEventListener('click', filterEpisodes);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterEpisodes();
        }
    });
}

// Cargar programas disponibles
async function loadPrograms() {
    try {
        const response = await fetch('/');
        const data = await response.json();
        const programs = data.programas_disponibles;
        
        programs.forEach(program => {
            const option = document.createElement('option');
            option.value = program;
            option.textContent = program;
            programaSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar programas:', error);
    }
}

// Cargar años disponibles
async function loadYears() {
    try {
        const response = await fetch('/programas/');
        const episodes = await response.json();
        const years = [...new Set(episodes.map(ep => ep.año))].sort((a, b) => b - a);
        
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar años:', error);
    }
}

// Cargar episodios
async function loadEpisodes() {
    try {
        const programa = programaSelect.value;
        const year = yearSelect.value;
        const searchTerm = searchInput.value;
        
        let url = '/programas/';
        if (programa) {
            url += `?programa=${encodeURIComponent(programa)}`;
        }
        if (year) {
            url = `/programas/year/${year}`;
        }
        if (searchTerm && searchTerm.length >= 3) {
            url = `/programas/buscar/?q=${encodeURIComponent(searchTerm)}`;
        }
        
        const response = await fetch(url);
        allEpisodes = await response.json();
        displayEpisodes(1);
    } catch (error) {
        console.error('Error al cargar episodios:', error);
    }
}

// Filtrar episodios
async function filterEpisodes() {
    currentPage = 1;
    await loadEpisodes();
}

// Mostrar episodios
function displayEpisodes(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedEpisodes = allEpisodes.slice(start, end);
    
    episodesList.innerHTML = '';
    
    paginatedEpisodes.forEach(episode => {
        const episodeElement = document.createElement('div');
        episodeElement.className = 'list-group-item episode-card';
        episodeElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <a href="${episode.url}" target="_blank" class="episode-title">
                        ${episode.titulo}
                    </a>
                    <div class="episode-meta">
                        <span class="episode-program">${episode.programa}</span> | 
                        Episodio ${episode.episodio} | 
                        ${episode.mes}/${episode.año}
                    </div>
                </div>
                <a href="${episode.url}" target="_blank" class="btn btn-outline-primary btn-sm">
                    Escuchar
                </a>
            </div>
        `;
        episodesList.appendChild(episodeElement);
    });
    
    updatePagination(page);
}

// Actualizar paginación
function updatePagination(currentPage) {
    const totalPages = Math.ceil(allEpisodes.length / itemsPerPage);
    pagination.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Botón anterior
    const prevButton = createPaginationButton('Anterior', currentPage > 1);
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            displayEpisodes(currentPage - 1);
        }
    });
    pagination.appendChild(prevButton);
    
    // Páginas
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || 
            i === totalPages || 
            (i >= currentPage - 2 && i <= currentPage + 2)
        ) {
            const pageButton = createPaginationButton(i, true, i === currentPage);
            pageButton.addEventListener('click', () => displayEpisodes(i));
            pagination.appendChild(pageButton);
        } else if (
            i === currentPage - 3 || 
            i === currentPage + 3
        ) {
            const ellipsis = document.createElement('li');
            ellipsis.className = 'page-item disabled';
            ellipsis.innerHTML = '<span class="page-link">...</span>';
            pagination.appendChild(ellipsis);
        }
    }
    
    // Botón siguiente
    const nextButton = createPaginationButton('Siguiente', currentPage < totalPages);
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            displayEpisodes(currentPage + 1);
        }
    });
    pagination.appendChild(nextButton);
}

// Crear botón de paginación
function createPaginationButton(text, enabled, active = false) {
    const li = document.createElement('li');
    li.className = `page-item ${enabled ? '' : 'disabled'} ${active ? 'active' : ''}`;
    
    const button = document.createElement(enabled ? 'button' : 'span');
    button.className = 'page-link';
    button.textContent = text;
    
    li.appendChild(button);
    return li;
}

// Iniciar la aplicación
init(); 