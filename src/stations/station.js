import { fetchData,getStations, getLignes } from '../fetch/api.js';


const url ='http://127.0.0.1:8000';

let currentPage = 1;
const itemsPerPage = 5;
let stationsData = [];
let filteredStations = [];
let linesData = [];

const stationsTableBody = document.getElementById('stationsTableBody');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addBtn = document.getElementById('addBtn');
const addStationModal = document.getElementById('addStationModal');
const stationForm = document.getElementById('stationForm');
const saveStationBtn = document.getElementById('saveStationBtn');
const cancelBtn = document.getElementById('cancelBtn');
const viewLinesModal = document.getElementById('viewLinesModal');
const stationNameTitle = document.getElementById('stationNameTitle');
const linesList = document.getElementById('linesList');
const closeLinesBtn = document.getElementById('closeLinesBtn');
const paginationButtons = [
    document.getElementById('page1'),
    document.getElementById('page2'),
    document.getElementById('page3'),
    document.getElementById('page4')
];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadStationsData();
    await loadLinesData();
    renderStations();
    setupEventListeners();
});

// Fetch stations data from API
async function loadStationsData() {
    try {
        const stations = await getStations();
        console.log(stations);
        
        if (!stations) {
            showNotification('Aucune station trouvée', 'error');
            return;
        }
         stationsData = stations.station;
        filteredStations = [...stationsData];
    } catch (error) {
        console.error('Error fetching stations data:', error);
        showNotification('Erreur lors du chargement des stations', 'error');
    }
}

async function loadLinesData() {
    try {
       const lignes = await getLignes();
        linesData = lignes;
        
    } catch (error) {
        console.error('Error fetching lines data:', error);
        showNotification('Erreur lors du chargement des lignes', 'error');
    }
}

// Render stations table
function renderStations() {
    stationsTableBody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredStations.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const station = filteredStations[i];
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${station.numero}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${station.nom}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${station.adresse}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                <button data-station-id="${station.id}" class="view-lines-btn hover:text-green-900">Voir lignes</button>
            </td>
        `;
        
        stationsTableBody.appendChild(row);
 }
    
    updatePaginationButtons();
    
    document.querySelectorAll('.view-lines-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const stationId = parseInt(btn.getAttribute('data-station-id'));
            openViewLinesModal(stationId);
        });
    });
}

function setupEventListeners() {
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        filteredStations = stationsData.filter(station => 
            station.nom.toLowerCase().includes(searchTerm) ||
            station.numero.toLowerCase().includes(searchTerm) ||
            station.adresse.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        renderStations();
    });
    
    addBtn.addEventListener('click', () => {
        stationForm.reset();
        document.getElementById('modalTitle').textContent = 'Ajouter une station';
        
        addStationModal.classList.remove('hidden');
    });
    
    cancelBtn.addEventListener('click', () => {
        addStationModal.classList.add('hidden');
    });
    
    saveStationBtn.addEventListener('click', async () => {
        const numero = document.getElementById('stationNumber').value;
        const nom = document.getElementById('stationName').value;
        const adresse = document.getElementById('stationAddress').value;
        
        if (!numero || !nom || !adresse) {
            alert('Veuillez remplir tous les champs');
            return;
        }
        
        try {
            await fetchData(`${url}/station/create`, 'POST', { numero, nom, adresse });
        
            filteredStations = [...stationsData];
            currentPage = 1;
            renderStations();
            
            addStationModal.classList.add('hidden');
            showNotification('Station ajoutée avec succès');
        } catch (error) {
            console.error('Error adding station:', error);
            showNotification('Erreur lors de l\'ajout de la station', 'error');
        }
    });
    
    closeLinesBtn.addEventListener('click', () => {
        viewLinesModal.classList.add('hidden');
    });
    
    paginationButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            currentPage = index + 1;
            renderStations();
        });
    });
    
    // Close modals when clicking outside
    addStationModal.addEventListener('click', (e) => {
        if (e.target === addStationModal) {
            addStationModal.classList.add('hidden');
        }
    });
    
    viewLinesModal.addEventListener('click', (e) => {
        if (e.target === viewLinesModal) {
            viewLinesModal.classList.add('hidden');
        }
    });
}

// Update pagination buttons
function updatePaginationButtons() {
    const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
    
    for (let i = 0; i < paginationButtons.length; i++) {
        const pageNum = i + 1;
        const button = paginationButtons[i];
        
        if (pageNum <= totalPages) {
            button.classList.remove('hidden');
            
            if (pageNum === currentPage) {
                button.classList.remove('text-gray-700', 'bg-white');
                button.classList.add('text-white', 'bg-blue-600');
            } else {
                button.classList.remove('text-white', 'bg-blue-600');
                button.classList.add('text-gray-700', 'bg-white');
            }
        } else {
            button.classList.add('hidden');
        }
    }
}

// Open view lines modal
function openViewLinesModal(stationId) {
    const station = stationsData.find(s => s.id === stationId);
    if (!station) return;
    
    stationNameTitle.textContent = station.nom;
    
    const stationLines = linesData.filter(line => line.stations.includes(stationId));
    
    linesList.innerHTML = '';
    
    if (stationLines.length === 0) {
        linesList.innerHTML = '<li class="py-3 text-gray-500">Aucune ligne associée à cette station</li>';
    } else {
        stationLines.forEach(line => {
            const li = document.createElement('li');
            li.className = 'py-3 flex items-center justify-between';
            li.innerHTML = `
                <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900">${line.numero}</h4>
                    <p class="text-sm text-gray-500">${line.nom}</p>
                </div>
            `;
            linesList.appendChild(li);
        });
    }
    
    // Open modal
    viewLinesModal.classList.remove('hidden');
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-5 right-5 px-6 py-3 rounded-md shadow-lg transform transition-all duration-500 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('opacity-0');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}