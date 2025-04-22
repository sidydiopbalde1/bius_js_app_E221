import { createLignes, getLignes, deleteLignes } from "../fetch/api.js";

let filteredEtat = "Tous"; 

const statusDropdown = document.getElementById('statusDropdown');
const statusOptions = document.getElementById('statusOptions');

statusDropdown.addEventListener('click', () => {
    statusOptions.classList.toggle('hidden');
});

statusOptions.querySelectorAll('div.px-4').forEach(option => {
    option.addEventListener('click', () => {
        const selected = option.textContent.trim();
        filteredEtat = selected;

        statusDropdown.querySelector('span').textContent = `Statut: ${selected}`;

        statusOptions.classList.add('hidden');

        currentPage = 1;
        renderLines();
    });
});




const addLineBtn = document.getElementById('addLineBtn');
const addLineModal = document.getElementById('addLineModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const addLineForm = document.getElementById('addLineForm');

function openModal() {
    addLineModal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeModalHandler() {
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        addLineModal.classList.add('hidden');
    }, 300);
}

addLineBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalHandler);
cancelBtn.addEventListener('click', closeModalHandler);
addLineModal.addEventListener('click', (e) => {
    if (e.target === addLineModal) {
        closeModalHandler();
    }
});

addLineForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('error-kilometre').textContent = '';
    document.getElementById('error-tarif').textContent = '';

    const kilometre = document.getElementById('kilometre').value;
    const tarif = document.getElementById('tarif').value;
    let hasError = false;

    if (!kilometre || isNaN(kilometre) || kilometre <= 0) {
        document.getElementById('error-kilometre').textContent = 'Veuillez entrer un nombre de kilomètres valide.';
        hasError = true;
    }

    if (!tarif || isNaN(tarif) || tarif <= 0) {
        document.getElementById('error-tarif').textContent = 'Veuillez entrer un tarif valide.';
        hasError = true;
    }

    if (hasError) return;

    const newLine = {
        nbrKilometre: kilometre,
        tarif: tarif,
        etat: "Actif",
    };

    try {
        await createLignes(newLine);
        await loadAndRenderLines();
        closeModalHandler();
        addLineForm.reset();
        showNotification('Ligne ajoutée avec succès!');
    } catch (error) {
        console.error("Erreur lors de l'ajout de la ligne:", error);
    }
});

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg transform transition-all duration-500 translate-y-[-100px] opacity-0';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('translate-y-[-100px]', 'opacity-0');
    }, 10);

    setTimeout(() => {
        notification.classList.add('translate-y-[-100px]', 'opacity-0');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

function createLineCard(line, index) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden card fade-in';
    card.style.animationDelay = `${index * 100}ms`;

    card.innerHTML = `
        <div class="p-5">
            <div class="flex justify-between items-center mb-2">
                <h3 class="text-lg font-medium text-gray-900">Numero: ${line.id}</h3>
                <div class="flex space-x-2">
                    <button class="edit-btn text-blue-600 hover:text-blue-800">
                        ✏️
                    </button>
                    <button class="delete-btn text-red-600 hover:text-red-800">
                        🗑️
                    </button>
                </div>
            </div>
            <div class="space-y-1 text-sm text-gray-500">
                <p>Nombre de kilometre: ${line.nbrKilometre}</p>
                <p>Tarif: ${line.tarif} Fcfa</p>
                <p>Statut: ${line.etat}</p>
                <p>Date: ${line.dateCreation?.date ?? 'N/A'}</p>
            </div>
        </div>
    `;

    card.querySelector('.edit-btn').addEventListener('click', () => {
        document.getElementById('kilometre').value = line.nbrKilometre;
        document.getElementById('tarif').value = line.tarif;
        openModal();
    });

    card.querySelector('.delete-btn').addEventListener('click', async () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) {
            await deleteLignes(line.id);
            await loadAndRenderLines();
            showNotification('Ligne supprimée avec succès !');
        }
    });

    return card;
}

// Pagination
let allLines = [];
let currentPage = 1;
const linesPerPage = 5;

function renderLines() {
    const container = document.getElementById('linesContainer');
    container.innerHTML = '';

    const filteredLines = filteredEtat === "Tous"
        ? allLines
        : allLines.filter(line => line.etat === filteredEtat);

    const start = (currentPage - 1) * linesPerPage;
    const end = start + linesPerPage;
    const currentLines = filteredLines.slice(start, end);

    currentLines.forEach((line, index) => {
        const card = createLineCard(line, index);
        container.appendChild(card);
    });

    renderPaginationControls(filteredLines.length);
}


function renderPaginationControls(totalCount) {
    const totalPages = Math.ceil(totalCount / linesPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = `px-3 py-1 mx-1 rounded ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`;
        btn.addEventListener('click', () => {
            currentPage = i;
            renderLines();
        });
        pagination.appendChild(btn);
    }
}


async function loadAndRenderLines() {
    try {
        const result = await getLignes();
        allLines = result.lignes ?? [];
        currentPage = 1;
        renderLines();
    } catch (error) {
        console.error("Erreur lors du chargement des lignes :", error);
    }
}

loadAndRenderLines();

const sidebarItems = document.querySelectorAll('.sidebar-item');
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});
