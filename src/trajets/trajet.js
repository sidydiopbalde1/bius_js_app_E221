// Sample data for trajets
const trajetsData = [
    { type: 'Aller', ligne: '42', depart: 'Station Ouakam', arrivee: 'Station Parcelle', conducteur: 'Modou Fall', distance: '12 km', temps: '25 min' },
    { type: 'Aller', ligne: '42', depart: 'Station Ouakam', arrivee: 'Station Parcelle', conducteur: 'Modou Fall', distance: '12 km', temps: '25 min' },
    { type: 'Aller', ligne: '42', depart: 'Station Ouakam', arrivee: 'Station Parcelle', conducteur: 'Modou Fall', distance: '12 km', temps: '25 min' },
    { type: 'Aller', ligne: '42', depart: 'Station Ouakam', arrivee: 'Station Parcelle', conducteur: 'Modou Fall', distance: '12 km', temps: '25 min' },
    { type: 'Aller', ligne: '42', depart: 'Station Ouakam', arrivee: 'Station Parcelle', conducteur: 'Modou Fall', distance: '12 km', temps: '25 min' }
];

// Type dropdown toggle
const typeDropdown = document.getElementById('typeDropdown');
const typeOptions = document.getElementById('typeOptions');

typeDropdown.addEventListener('click', () => {
    typeOptions.classList.toggle('hidden');
});

document.addEventListener('click', (event) => {
    if (!typeDropdown.contains(event.target)) {
        typeOptions.classList.add('hidden');
    }
});

const typeItems = typeOptions.querySelectorAll('div');
typeItems.forEach(item => {
    item.addEventListener('click', () => {
        typeDropdown.querySelector('span').textContent = `Type: ${item.textContent}`;
        typeOptions.classList.add('hidden');
    });
});

// Planifier Modal handling
const planifierBtn = document.getElementById('planifierBtn');
const planifierModal = document.getElementById('planifierModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const planifierForm = document.getElementById('planifierForm');

function openPlanifierModal() {
    planifierModal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closePlanifierModal() {
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        planifierModal.classList.add('hidden');
    }, 300);
}

planifierBtn.addEventListener('click', openPlanifierModal);
closeModal.addEventListener('click', closePlanifierModal);
cancelBtn.addEventListener('click', closePlanifierModal);
planifierModal.addEventListener('click', (e) => {
    if (e.target === planifierModal) {
        closePlanifierModal();
    }
});

// Details Modal handling
const detailsModal = document.getElementById('detailsModal');
const detailsModalContent = document.getElementById('detailsModalContent');
const closeDetailsModal = document.getElementById('closeDetailsModal');
const closeDetailsBtn = document.getElementById('closeDetailsBtn');

function openDetailsModal(trajet) {
    // Fill details
    document.getElementById('detailType').textContent = trajet.type;
    document.getElementById('detailLigne').textContent = trajet.ligne;
    document.getElementById('detailDepart').textContent = trajet.depart;
    document.getElementById('detailArrivee').textContent = trajet.arrivee;
    document.getElementById('detailConducteur').textContent = trajet.conducteur;
    document.getElementById('detailDistance').textContent = trajet.distance;
    document.getElementById('detailTemps').textContent = trajet.temps;
    
    detailsModal.classList.remove('hidden');
    setTimeout(() => {
        detailsModalContent.classList.remove('scale-95', 'opacity-0');
        detailsModalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeDetailsModalHandler() {
    detailsModalContent.classList.remove('scale-100', 'opacity-100');
    detailsModalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        detailsModal.classList.add('hidden');
    }, 300);
}

closeDetailsModal.addEventListener('click', closeDetailsModalHandler);
closeDetailsBtn.addEventListener('click', closeDetailsModalHandler);
detailsModal.addEventListener('click', (e) => {
    if (e.target === detailsModal) {
        closeDetailsModalHandler();
    }
});

// Form submission
planifierForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newTrajet = {
        type: document.getElementById('type').value,
        ligne: document.getElementById('ligne').value,
        depart: document.getElementById('stationDepart').value,
        arrivee: document.getElementById('stationArrivee').value,
        conducteur: document.getElementById('conducteur').value,
        distance: '12 km', // Default value
        temps: '25 min' // Default value
    };
    
    // Add new trajet to the beginning of the array
    trajetsData.unshift(newTrajet);
    
    // Refresh the display
    renderTrajets();
    
    // Close the modal
    closePlanifierModal();
    
    // Reset form
    planifierForm.reset();
    
    // Show success notification
    showNotification('Trajet planifié avec succès!');
});

// Notification function
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

// Create trajet row element
function createTrajetRow(trajet, index) {
    const row = document.createElement('tr');
    row.className = 'table-row fade-in';
    row.style.animationDelay = `${index * 100}ms`;
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${trajet.type}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${trajet.ligne}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${trajet.depart}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${trajet.arrivee}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${trajet.conducteur}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm">
            <button class="view-details-btn text-blue-600 hover:text-blue-900">Voir details</button>
        </td>
    `;
    
    const viewDetailsBtn = row.querySelector('.view-details-btn');
    viewDetailsBtn.addEventListener('click', () => {
        openDetailsModal(trajet);
    });
    
    return row;
}

// Render trajets to container
function renderTrajets() {
    const container = document.getElementById('trajetsContainer');
    container.innerHTML = '';
    
    trajetsData.forEach((trajet, index) => {
        const row = createTrajetRow(trajet, index);
        container.appendChild(row);
    });
}

// Initial render
renderTrajets();

// Add hover effect to sidebar items
const sidebarItems = document.querySelectorAll('.sidebar-item');
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all sidebar items
        sidebarItems.forEach(sidebarItem => {
            sidebarItem.classList.remove('active');
        });

        // Add active class to the clicked item
        item.classList.add('active');
    });

    // Optional: Add hover effect
    item.addEventListener('mouseover', () => {
        item.classList.add('hovered');
    });

    item.addEventListener('mouseout', () => {
        item.classList.remove('hovered');
    });
});