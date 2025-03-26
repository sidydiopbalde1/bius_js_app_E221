// Fonction pour récupérer les bus depuis l'API Symfony
async function fetchBuses() {
    try {
        const response = await fetch('http://127.0.0.1:8000/bus/list');
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des bus');
        }

        const data = await response.json();
        console.log("Données reçues:", data);


        return data.bus;
    } catch (error) {
        console.error('Erreur:', error);
        alert('Impossible de charger la liste des bus');
        return [];
    }
}


// Fonction pour peupler le tableau avec les données récupérées
async function loadBuses() {
    const buses = await fetchBuses();
    console.log(buses);
    
    populateBusTable(buses);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(buses.length / itemsPerPage);
    updatePagination(totalPages, buses);

}

// Fonction de mise à jour de la pagination
function updatePagination(totalPages, buses) {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');

    let currentPage = 1; // Initialisation de la page

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            currentPageSpan.textContent = currentPage;
            loadPageData(buses, currentPage, 10);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            currentPageSpan.textContent = currentPage;
            loadPageData(buses, currentPage, 10);
        }
    });
}


// Fonction pour charger les données d'une page spécifique
function loadPageData(buses, page, itemsPerPage) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = buses.slice(startIndex, endIndex);
    populateBusTable(pageData);
}

function populateBusTable(buses) {
    const tableBody = document.getElementById('busTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    buses.forEach(bus => {
        const row = document.createElement('tr');
        row.classList.add('hover:bg-gray-50', 'transition-colors');
        row.innerHTML = `
            <td class="px-4 py-3">${bus.immatriculation}</td>
            <td class="px-4 py-3">${bus.type}</td>
            <td class="px-4 py-3">${bus.kilométrage}</td>
            <td class="px-4 py-3">${bus.nbrePlaces}</td>
            <td class="px-4 py-3">
                <button class="text-red-500 hover:text-red-700 delete-bus">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}
// Appel initial pour charger les bus
document.addEventListener('DOMContentLoaded', loadBuses);

// Gestionnaire pour ajouter un nouveau bus
document.getElementById('addBusBtn').addEventListener('click', () => {
    window.location.href = './create-bus.html';
});

// Gestionnaire pour supprimer un bus
async function deleteBus(immatriculation) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/bus/${immatriculation}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                // Ajoutez ici les en-têtes d'authentification si nécessaire
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du bus');
        }

        // Recharger la liste des bus après suppression
        await loadBuses();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Impossible de supprimer le bus');
    }
}

// Écouteur d'événements pour la suppression
document.getElementById('busTableBody').addEventListener('click', async (e) => {
    const deleteBtn = e.target.closest('.delete-bus');
    if (deleteBtn) {
        const row = deleteBtn.closest('tr');
        const immatriculation = row.querySelector('td:first-child').textContent;
        
        if (confirm(`Voulez-vous vraiment supprimer le bus ${immatriculation} ?`)) {
            await deleteBus(immatriculation);
        }
    }
});