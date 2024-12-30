// Variables globales
let currentPage = 1;
const itemsPerPage = 10;
let allEpisodes = [];
let originalEpisodes = []; // Para mantener una copia de todos los episodios

// Elementos del DOM
const programaSelect = document.getElementById('programaSelect');
const yearSelect = document.getElementById('yearSelect');
const monthSelect = document.getElementById('monthSelect');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const episodesList = document.getElementById('episodesList');
const pagination = document.getElementById('pagination');

// Inicialización
async function init() {
    await loadPrograms();
    await loadAllEpisodes();
    updateYearSelect();
    updateMonthSelect();
    displayEpisodes(1);
    
    // Event listeners
    programaSelect.addEventListener('change', handleProgramChange);
    yearSelect.addEventListener('change', handleYearChange);
    monthSelect.addEventListener('change', handleMonthChange);
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
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

// Cargar todos los episodios
async function loadAllEpisodes() {
    try {
        const response = await fetch('/programas/');
        originalEpisodes = await response.json();
        allEpisodes = [...originalEpisodes];
    } catch (error) {
        console.error('Error al cargar episodios:', error);
    }
}

// Actualizar select de años basado en el programa seleccionado
function updateYearSelect() {
    const programa = programaSelect.value;
    let episodios = allEpisodes;
    
    if (programa) {
        episodios = allEpisodes.filter(ep => ep.programa === programa);
    }
    
    const years = [...new Set(episodios.map(ep => ep.año))].sort((a, b) => b - a);
    
    // Guardar el año seleccionado actualmente
    const currentYear = yearSelect.value;
    
    // Limpiar y reconstruir el select de años
    yearSelect.innerHTML = '<option value="">Todos los años</option>';
    
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
    
    // Si el año seleccionado previamente existe en el nuevo conjunto de años, mantenerlo
    if (currentYear && years.includes(Number(currentYear))) {
        yearSelect.value = currentYear;
    }
}

// Actualizar select de meses basado en el programa y año seleccionados
function updateMonthSelect() {
    const programa = programaSelect.value;
    const year = yearSelect.value;
    let episodios = allEpisodes;
    
    if (programa) {
        episodios = episodios.filter(ep => ep.programa === programa);
    }
    if (year) {
        episodios = episodios.filter(ep => ep.año === Number(year));
    }
    
    const months = [...new Set(episodios.map(ep => ep.mes))].sort((a, b) => a - b);
    const currentMonth = monthSelect.value;
    
    // Mantener las opciones existentes pero deshabilitarlas todas
    Array.from(monthSelect.options).forEach(option => {
        if (option.value === "") return; // Mantener "Todos los meses" habilitado
        option.disabled = !months.includes(Number(option.value));
    });
    
    // Si el mes seleccionado previamente no está en los meses disponibles, limpiarlo
    if (currentMonth && !months.includes(Number(currentMonth))) {
        monthSelect.value = "";
    }
}

// Manejar cambio de programa
async function handleProgramChange() {
    currentPage = 1;
    updateYearSelect();
    updateMonthSelect();
    await filterEpisodes();
}

// Manejar cambio de año
async function handleYearChange() {
    currentPage = 1;
    updateMonthSelect();
    await filterEpisodes();
}

// Manejar cambio de mes
async function handleMonthChange() {
    currentPage = 1;
    await filterEpisodes();
}

// Manejar búsqueda
async function handleSearch() {
    const searchTerm = searchInput.value;
    if (searchTerm && searchTerm.length >= 3) {
        currentPage = 1;
        try {
            const response = await fetch(`/programas/buscar/?q=${encodeURIComponent(searchTerm)}`);
            allEpisodes = await response.json();
            displayEpisodes(1);
        } catch (error) {
            console.error('Error en la búsqueda:', error);
        }
    }
}

// Filtrar episodios
async function filterEpisodes() {
    const programa = programaSelect.value;
    const year = yearSelect.value;
    const month = monthSelect.value;
    
    try {
        let url = '/programas/fecha';
        const params = new URLSearchParams();
        
        if (year) {
            url += `/${year}`;
            if (programa) params.append('programa', programa);
            if (month) params.append('mes', month);
            
            const fullUrl = `${url}?${params.toString()}`;
            const response = await fetch(fullUrl);
            allEpisodes = await response.json();
        } else {
            // Si no hay año seleccionado, usar el endpoint básico
            url = '/programas/';
            if (programa) params.append('programa', programa);
            
            const fullUrl = `${url}?${params.toString()}`;
            const response = await fetch(fullUrl);
            allEpisodes = await response.json();
        }
        
        displayEpisodes(1);
    } catch (error) {
        console.error('Error al filtrar episodios:', error);
    }
}

// Mostrar episodios
function displayEpisodes(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedEpisodes = allEpisodes.slice(start, end);
    
    episodesList.innerHTML = '';
    
    if (paginatedEpisodes.length === 0) {
        episodesList.innerHTML = `
            <div class="list-group-item text-center text-muted">
                No se encontraron episodios para los filtros seleccionados
            </div>
        `;
        return;
    }
    
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