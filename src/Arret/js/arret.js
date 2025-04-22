import { createArret } from './arret.fetch.js';
import { renderUserConnected } from '../../login/auth.js';
document.addEventListener('DOMContentLoaded', async () => {
    renderUserConnected();
    const arretsJSON = localStorage.getItem('arrets_ligne');
    const ligneIdStorage = localStorage.getItem('ligne_id');
    
    let arrets = arretsJSON ? JSON.parse(arretsJSON) : [];

    // Priorité à ligneId stocké séparément si disponible
    const ligneId = arrets[0]?.ligneId || parseInt(ligneIdStorage);
    console.log(ligneId);
    
    if (!ligneId) {
        showToast("ID de la ligne introuvable", "error");
        return;
    }

    const form = document.getElementById('arret-form');
    const nomInput = document.getElementById('nom');
    const numeroInput = document.getElementById('numero');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nom = nomInput.value.trim();
        const numero = parseInt(numeroInput.value);

        if (!nom || isNaN(numero) || numero <= 0) {
            showToast("Tous les champs sont requis", "error");
            return;
        }

        const result = await createArret({ nom, numero, ligneId });

        if (result) {
            showToast("✅ Arrêt ajouté");
            nomInput.value = '';
            numeroInput.value = '';
            arrets.push(result);
            localStorage.setItem('arrets_ligne', JSON.stringify(arrets));
            chargerArrets();
        }
    });

    function chargerArrets() {
        const tbody = document.getElementById('arrets-body');
        tbody.innerHTML = '';

        if (!arrets || arrets.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-gray-500 py-4">Aucun arrêt trouvé.</td>
                </tr>
            `;
            return;
        }

        arrets.forEach((a, index) => {
            const tr = document.createElement('tr');
            tr.className = 'border-b';
            tr.innerHTML = `
                <td class="px-4 py-2">${a.numero}</td>
                <td class="px-4 py-2">${a.nom}</td>
                <td class="px-4 py-2 text-right">
                    <button class="text-blue-500 hover:underline">✏️</button>
                    <button class="text-red-500 hover:underline ml-2">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    chargerArrets();
    document.addEventListener('DOMContentLoaded', function() {
        // Ajouter les classes d'animation aux lignes de tableau
        const rows = document.querySelectorAll('#arrets-body tr');
        rows.forEach((row, index) => {
            row.classList.add('animate__animated', 'animate__fadeIn');
            row.style.animationDelay = `${index * 0.1}s`;
        });
    });

    // Toggle modal avec animation
    window.toggleModal = function(show) {
        const modal = document.getElementById('arret-modal');
        const modalContent = modal.querySelector('div');
        
        if (show) {
            // Afficher le modal
            modal.classList.remove('hidden');
            modalContent.classList.remove('animate__fadeOutUp');
            modalContent.classList.add('animate__fadeInDown');
        } else {
            // Cacher le modal avec animation
            modalContent.classList.remove('animate__fadeInDown');
            modalContent.classList.add('animate__fadeOutUp');
            
            // Attendre la fin de l'animation avant de cacher complètement
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 500);
        }
    };
});

// Toast générique
function showToast(message, type = "success") {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `fixed top-5 right-5 px-4 py-2 rounded shadow text-white z-50 
        ${type === "success" ? "bg-green-600" : "bg-red-600"}`;

    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
