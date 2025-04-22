import { fetchData, getStations, getLignes } from '../fetch/api.js';
import { renderUserConnected } from '../login/auth.js';
import { paginate, renderPaginationControls } from '../public/js/utils/pagination.js';

const url = 'http://127.0.0.1:8000';

renderUserConnected();

let currentPage = 1;
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

document.addEventListener('DOMContentLoaded', async () => {
    await loadStationsData();
    await loadLinesData();
    renderStations();
    setupEventListeners();
});

// Charger les stations
async function loadStationsData() {
    try {
        const response = await getStations();
        if (!response || !Array.isArray(response.station)) {
            showNotification('Aucune station trouvée', 'error');
            return;
        }
        stationsData = response.station;
        filteredStations = [...stationsData];
    } catch (error) {
        console.error('Erreur lors du chargement des stations :', error);
        showNotification('Erreur lors du chargement des stations', 'error');
    }
}

// Charger les lignes
async function loadLinesData() {
    try {
        const response = await getLignes();
        linesData = response || [];
    } catch (error) {
        console.error('Erreur lors du chargement des lignes :', error);
        showNotification('Erreur lors du chargement des lignes', 'error');
    }
}

// Affichage des stations
function renderStations(page = 1) {
    stationsTableBody.innerHTML = '';
    currentPage = page;

    const { data, totalPages } = paginate(filteredStations, page, 2); 
    const paginationContainer = document.getElementById("paginationContainer");

    data.forEach(station => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${station.numero}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${station.nom}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${station.adresse}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                <button data-station-id="${station.id}" class="view-lines-btn hover:text-green-900">Voir lignes</button>
            </td>
        `;
        stationsTableBody.appendChild(row);
    });

    renderPaginationControls(paginationContainer, page, totalPages, (newPage) => renderStations(newPage));

    document.querySelectorAll('.view-lines-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const stationId = parseInt(btn.getAttribute('data-station-id'));
            openViewLinesModal(stationId);
        });
    });
}

// Gestion des événements
function setupEventListeners() {
    // Recherche
    searchBtn.addEventListener('click', () => {
        const keyword = searchInput.value.trim().toLowerCase();
        filteredStations = stationsData.filter(station =>
            station.nom.toLowerCase().includes(keyword)
        );
        renderStations(1);
    });

    // Ajout d'une station
    addBtn.addEventListener('click', () => {
        stationForm.reset();
        document.getElementById('modalTitle').textContent = 'Ajouter une station';
        addStationModal.classList.remove('hidden');
    });

    cancelBtn.addEventListener('click', () => {
        addStationModal.classList.add('hidden');
    });

    saveStationBtn.addEventListener('click', async () => {
        const numero = document.getElementById('stationNumber').value.trim();
        const nom = document.getElementById('stationName').value.trim();
        const adresse = document.getElementById('stationAddress').value.trim();

        if (!numero || !nom || !adresse) {
            showNotification('Veuillez remplir tous les champs', 'error');
            return;
        }

        try {
            const newStation = await fetchData(`${url}/station/create`, 'POST', { numero, nom, adresse });
            stationsData.push(newStation);
            filteredStations = [...stationsData];
            renderStations(1);
            addStationModal.classList.add('hidden');
            showNotification('Station ajoutée avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la station :', error);
            showNotification('Erreur lors de l\'ajout de la station', 'error');
        }
    });

    closeLinesBtn.addEventListener('click', () => {
        viewLinesModal.classList.add('hidden');
    });

    [addStationModal, viewLinesModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
}

// Affichage des lignes d'une station
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

    viewLinesModal.classList.remove('hidden');
}

// Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-5 right-5 px-6 py-3 rounded-md shadow-lg transition-all duration-500 ${
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
