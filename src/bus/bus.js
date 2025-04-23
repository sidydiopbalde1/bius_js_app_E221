import { getBuses, deleteBus, getConducteurs, createBus } from '../public/js/fetch/api.js';
import { validateBusForm } from './validatorBus.js';
import { renderUserConnected } from '../login/auth.js';
import { paginate, renderPaginationControls } from "../public/js/utils/pagination.js";

document.addEventListener('DOMContentLoaded', () => {
    
    renderUserConnected();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "../login/login.html";
    }

    const busTypes = ["Tata", "Car Rapide", "DDK"]; 
    const select = document.getElementById("type");

    if (select) {
        busTypes.forEach(type => {
            const option = document.createElement("option");
            option.value = type;
            option.textContent = type;
            select.appendChild(option);
        });
    } else {
        console.warn("L'élément #type n'existe pas sur cette page.");
    }

    if (document.getElementById('conducteur')) {
        loadConducteurs();
    }

    if (document.getElementById('busTableBody')) {
        loadBuses();
    }
    const modal = document.getElementById('modal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    openModalBtn.onclick = () => modal.classList.remove('hidden');
    closeModalBtn.onclick = () => modal.classList.add('hidden');
    const busForm = document.getElementById('busForm');
    if (busForm) {
        busForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const errorMessage = document.getElementById('errorMessage');
            errorMessage.classList.add('hidden');
            errorMessage.textContent = '';

            const formData = {
                immatriculation: document.getElementById('immatriculation').value,
                type: document.getElementById('type').value,
                kilometrage: parseInt(document.getElementById('kilometrage').value),
                nbrePlaces: parseInt(document.getElementById('nbrePlaces').value),
                enCirculation: document.getElementById('enCirculation').value === 'true',
                conducteur: document.getElementById('conducteur').value || null
            };
            console.log(formData);
            const errors = validateBusForm(formData);
            if (errors.length > 0) {
                errorMessage.textContent = errors.join(' | ');
                errorMessage.classList.remove('hidden');
                return;
            }

            const response = await createBus(formData);

            if (response) {
                window.location.href = './bus-list.html'; 
            } else {
                errorMessage.textContent = 'Erreur lors de la création du bus';
                errorMessage.classList.remove('hidden');
            }
        });
    }
      
});
document.addEventListener('DOMContentLoaded', function() {
    const rows = document.querySelectorAll('#busTableBody tr');
    rows.forEach((row, index) => {
        row.classList.add('animate__animated', 'animate__fadeIn');
        row.style.animationDelay = `${index * 0.1}s`;
    });

    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('div');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    openModalBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        modalContent.classList.remove('animate__fadeOutUp');
        modalContent.classList.add('animate__fadeInDown');
    });

    closeModalBtn.addEventListener('click', () => {
        modalContent.classList.remove('animate__fadeInDown');
        modalContent.classList.add('animate__fadeOutUp');
        
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 500);
    });
});
async function loadConducteurs() {
    const conducteurs = await getConducteurs();
    if (conducteurs && conducteurs.conducteurs) {
        const conducteurSelect = document.getElementById('conducteur');
        if (!conducteurSelect) return;
        // Filtrer les conducteurs disponibles (statut == "disponible" ou true)
        const conducteursDisponibles = conducteurs.conducteurs.filter(c => c.disponible == true);
        conducteursDisponibles.forEach(conducteur => {
            const option = document.createElement('option');
            option.value = conducteur.id;
            option.textContent = `${conducteur.nom} ${conducteur.prenom}`;
            conducteurSelect.appendChild(option);
        });
    } else {
        console.error('Impossible de charger les conducteurs');
    }
}

async function loadBuses() {
    const buses = await getBuses();
    if (buses && buses.bus) {
        populateBusTable(buses.bus);
    } else {
        console.error("Impossible de charger la liste des bus.");
    }
}

function populateBusTable(buses, page = 1) {

    console.log(buses);
    
    const { data, totalPages } = paginate(buses, page, 2);
    const tableBody = document.getElementById('busTableBody');
    if (!tableBody) return;

    const paginationContainer = document.getElementById("paginationContainer");
    tableBody.innerHTML = ''; 

    data.forEach(bus => {
        const row = document.createElement('tr');
        row.classList.add('hover:bg-gray-50', 'transition-colors');
        row.innerHTML = `
            <td class="px-4 py-3">${bus.immatriculation}</td>
            <td class="px-4 py-3">${bus.type}</td>
            <td class="px-4 py-3">${bus.kilométrage}</td>
            <td class="px-4 py-3">${bus.nbrePlaces}</td>
            <td class="px-4 py-3">
                <button class="text-red-500 hover:text-red-700 delete-bus" data-immatriculation="${bus.immatriculation}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.querySelectorAll('.delete-bus').forEach(button => {
        button.addEventListener('click', async (event) => {
            const immatriculation = event.currentTarget.getAttribute('data-immatriculation');
            const success = await deleteBus(immatriculation);
            if (success) {
                alert('Bus supprimé avec succès.');
                loadBuses();
            }
        });
    });

    renderPaginationControls(paginationContainer, page, totalPages, (newPage) => populateBusTable(buses, newPage));


}
