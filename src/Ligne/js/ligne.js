import { createLigne, getLignes, updateLigne, deleteLigne } from './ligne.fetch.js';
import { renderUserConnected } from '../../login/auth.js';
document.addEventListener('DOMContentLoaded', async () => {

    renderUserConnected();
    await chargerLignes();

    const form = document.getElementById('ligne-form');
    const kmInput = document.getElementById('km');
    const tarifInput = document.getElementById('tarif');
    const etatSelect = document.getElementById('etat');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();
            let valid = true;

            if (!kmInput.value || !Number.isInteger(Number(kmInput.value)) || parseInt(kmInput.value) <= 0) {
                showError(kmInput, 'Le nombre de kilomètres doit être un entier positif');
                valid = false;
            }

            if (!tarifInput.value || isNaN(tarifInput.value) || parseFloat(tarifInput.value) <= 0) {
                showError(tarifInput, 'Le tarif doit être un nombre positif');
                valid = false;
            }

            if (!etatSelect.value) {
                showError(etatSelect, 'Veuillez sélectionner un état');
                valid = false;
            }

            if (!valid) return;

            const ligneData = {
                nbrKilometre: parseInt(kmInput.value),
                tarif: parseFloat(tarifInput.value),
                etat: etatSelect.value
            };

            const editingId = form.dataset.editingId;
            let result;

            if (editingId) {
                result = await updateLigne(editingId, ligneData);
                delete form.dataset.editingId;
                showToast("✏️ Ligne modifiée avec succès");
            } else {
                result = await createLigne(ligneData);
                showToast("✅ Ligne ajoutée avec succès");
            }

            if (result) {
                form.reset();
                clearErrors();
                toggleModal(false);
                await chargerLignes();
            }
        });
    }

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            form.reset();
            delete form.dataset.editingId;
            clearErrors();
            toggleModal(false);
        });
    });
});

function showError(input, message) {
    input.classList.add('border-red-500');
    const errorMsg = document.createElement('p');
    errorMsg.className = 'text-sm text-red-500 mt-1 error-message';
    errorMsg.textContent = message;
    input.parentElement.appendChild(errorMsg);
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(e => e.remove());
    document.querySelectorAll('#ligne-form input, #ligne-form select').forEach(el => {
        el.classList.remove('border-red-500');
    });
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `fixed top-5 right-5 px-4 py-2 rounded shadow text-white z-50
        ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

async function chargerLignes() {
    const lignes = await getLignes();
    console.log(lignes);
    
    const grid = document.getElementById('lignes-grid');
    if (!grid || !Array.isArray(lignes)) return;

    grid.innerHTML = '';

    lignes.forEach(ligne => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded-lg shadow-md';

        const arretsHTML = ligne.arrets.length > 0
            ? `
            <div class="mt-2">
                <h4 class="font-semibold">🛑 Arrêts :</h4>
                <ul class="list-disc ml-5 text-sm text-gray-700">
                    ${ligne.arrets.map(arret => `<li>${arret.nom} (#${arret.numero})</li>`).join('')}
                </ul>
            </div>`
            : `<p class="text-sm text-gray-500 mt-2">Aucun arrêt défini</p>`;

        card.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h3 class="text-lg font-semibold">Ligne #${ligne.id}</h3>
                <div class="space-x-2">
                    <button data-id="${ligne.id}" class="modifier-btn text-blue-600 hover:underline">✏️</button>
                    <button data-id="${ligne.id}" class="supprimer-btn text-red-600 hover:underline">🗑️</button>
                </div>
            </div>
            <div class="space-y-1 text-gray-600">
                <p><strong>Kilomètres :</strong> ${ligne.nbrKilometre}</p>
                <p><strong>Tarif :</strong> ${ligne.tarif} Fcfa</p>
                <p><strong>État :</strong> ${ligne.etat}</p>
                <p><strong>Nombre d'arrêts :</strong> ${ligne.arrets.length}</p>
            <button 
                data-arrets='${JSON.stringify(ligne.arrets)}' 
                data-ligne-id='${ligne.id}' 
                class="voir-arrets text-sm text-blue-600 hover:underline inline-flex items-center gap-1 mt-2"
                >
                <span class="material-icons text-sm">stop_circle</span> Voir les arrêts
            </button>


            </div>
        `;

        grid.appendChild(card);
    });

    document.querySelectorAll('.supprimer-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            if (confirm('❗ Supprimer cette ligne ?')) {
                const result = await deleteLigne(id);
                if (result) {
                    showToast("🗑️ Ligne supprimée");
                    await chargerLignes();
                }
            }
        });
    });

    document.querySelectorAll('.modifier-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const ligne = lignes.find(l => l.id == id);
            if (!ligne) return;

            document.getElementById('km').value = ligne.nbrKilometre;
            document.getElementById('tarif').value = ligne.tarif;
            document.getElementById('etat').value = ligne.etat;
            document.getElementById('ligne-form').dataset.editingId = id;

            toggleModal(true);
        });
    });

    document.querySelectorAll('.voir-arrets').forEach(button => {
        button.addEventListener('click', () => {
            const arrets = JSON.parse(button.dataset.arrets);
            const ligneId = parseInt(button.dataset.ligneId); 
            
            const arretsAvecId = arrets.map(a => ({
                ...a,
                ligneId: a.ligneId || ligneId
            }));
    
            localStorage.setItem('arrets_ligne', JSON.stringify(arretsAvecId));
    
            window.location.href = '/src/Arret/view/arret.html';
        });
    });
    
    
}
