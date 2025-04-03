import { getBuses, deleteBus, getConducteurs, createBus } from '../fetch/api.js';
import { validateBusForm } from './validatorBus.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const user = localStorage.getItem("user");

    if (!user) {
        // Rediriger vers la page de connexion si aucun utilisateur n'est stocké
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

    // Charger les conducteurs uniquement si le champ conducteur existe
    if (document.getElementById('conducteur')) {
        loadConducteurs();
    }

    // Charger la liste des bus uniquement si la table existe
    if (document.getElementById('busTableBody')) {
        loadBuses();
    }
    const modal = document.getElementById('modal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    openModalBtn.onclick = () => modal.classList.remove('hidden');
    closeModalBtn.onclick = () => modal.classList.add('hidden');
    // Ajouter un event listener sur le formulaire uniquement s'il est présent
    const busForm = document.getElementById('busForm');
    if (busForm) {
        busForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const errorMessage = document.getElementById('errorMessage');
            errorMessage.classList.add('hidden');
            errorMessage.textContent = '';

            // Récupération des valeurs du formulaire
            const formData = {
                immatriculation: document.getElementById('immatriculation').value,
                type: document.getElementById('type').value,
                kilometrage: parseInt(document.getElementById('kilometrage').value),
                nbrePlaces: parseInt(document.getElementById('nbrePlaces').value),
                enCirculation: document.getElementById('enCirculation').value === 'true',
                conducteur: document.getElementById('conducteur').value || null
            };

            // Validation des données
            const errors = validateBusForm(formData);
            if (errors.length > 0) {
                errorMessage.textContent = errors.join(' | ');
                errorMessage.classList.remove('hidden');
                return;
            }

            // Envoi des données via l'API
            const response = await createBus(formData);

            if (response) {
                window.location.href = './bus-list.html'; // Redirection après succès
            } else {
                errorMessage.textContent = 'Erreur lors de la création du bus';
                errorMessage.classList.remove('hidden');
            }
        });
    }

  
    
    
});

// Charger la liste des conducteurs
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

// Charger la liste des bus
async function loadBuses() {
    const buses = await getBuses();
    if (buses && buses.bus) {
        populateBusTable(buses.bus);
    } else {
        console.error("Impossible de charger la liste des bus.");
    }
}

// Fonction pour afficher les bus dans le tableau
function populateBusTable(buses) {
    const tableBody = document.getElementById('busTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = ''; // Nettoyer le tableau avant d'ajouter de nouveaux éléments

    buses.forEach(bus => {
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

    // Ajouter un event listener pour chaque bouton de suppression
    document.querySelectorAll('.delete-bus').forEach(button => {
        button.addEventListener('click', async (event) => {
            const immatriculation = event.currentTarget.getAttribute('data-immatriculation');
            const success = await deleteBus(immatriculation);
            if (success) {
                alert('Bus supprimé avec succès.');
                loadBuses(); // Recharger la liste après suppression
            }
        });
    });
}
