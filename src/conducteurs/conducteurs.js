import { createConducteurs, getConducteurs, deleteConducteurs,  } from "../public/js/fetch/api.js";
import { validateConducteur } from "./validatorConducteur.js";
import { renderUserConnected } from '../login/auth.js';
import { paginate, renderPaginationControls } from "../public/js/utils/pagination.js";
document.addEventListener('DOMContentLoaded', async () => {

    renderUserConnected();
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "../login/login.html";
    }

    const modalOverlay = document.getElementById("modalOverlay");
    const addDriverBtn = document.getElementById("addDriverBtn");
    const closeModal = document.getElementById("closeModal");
    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");
    const driverTableBody = document.getElementById("driverTableBody");

    addDriverBtn.addEventListener("click", () => modalOverlay.classList.remove("hidden"));
    closeModal.addEventListener("click", () => modalOverlay.classList.add("hidden"));

    document.getElementById("driverForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const driver = {
            matricule: document.getElementById("matricule").value.trim(),
            nom: document.getElementById("nom").value.trim(),
            prenom: document.getElementById("prenom").value.trim(),
            telephone: document.getElementById("telephone").value.trim(),
            typePermis: document.getElementById("permis").value,
        };

        console.log("Conducteur à enregistrer :", driver);

        const errors = validateConducteur(driver);
   

        try {
            await createConducteurs(driver);
            
            await chargerConducteurs();

            e.target.reset();
            modalOverlay.classList.add("hidden"); 
           
        } catch (error) {
            console.error("Erreur lors de l'ajout du conducteur:", error);
            errorMessage.textContent = "Une erreur est survenue lors de l'ajout du conducteur.";
            errorMessage.classList.remove("hidden");
        }
    });

    await chargerConducteurs();
});
document.addEventListener('DOMContentLoaded', function() {
    const rows = document.querySelectorAll('#driverTableBody tr');
    rows.forEach((row, index) => {
      row.classList.add('animate__animated', 'animate__fadeIn');
      row.style.animationDelay = `${index * 0.1}s`;
    });

    // Gestion du modal avec animation
    const modal = document.getElementById('modalOverlay');
    const modalContent = modal.querySelector('div');
    const addDriverBtn = document.getElementById('addDriverBtn');
    const closeModalBtn = document.getElementById('closeModal');

    addDriverBtn.addEventListener('click', () => {
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

  async function chargerConducteurs(page = 1) {
    try {
        const response = await getConducteurs();
        const conducteurs = response.conducteurs;
        console.log(conducteurs);
        
        const driverTableBody = document.getElementById("driverTableBody");
        const { data, totalPages } = paginate(conducteurs, page, 2);
        const paginationContainer = document.getElementById("paginationContainer");

        console.log(paginationContainer);
        
        driverTableBody.innerHTML = "";

        data.forEach(conducteur => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${conducteur.matricule}</td>
                <td class="px-6 py-4 whitespace-nowrap">${conducteur.nom}</td>
                <td class="px-6 py-4 whitespace-nowrap">${conducteur.prenom}</td>
                <td class="px-6 py-4 whitespace-nowrap">${conducteur.telephone}</td>
                <td class="px-6 py-4 whitespace-nowrap">${conducteur.typePermis}</td>
                <td class="px-6 py-4 whitespace-nowrap">${conducteur.disponible}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button class="text-red-500 hover:text-red-700 delete-conducteur" data-matricule="${conducteur.matricule}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </button>
            </td>

            `;
            driverTableBody.appendChild(row);
        });

        // Ajouter les événements de suppression
        document.querySelectorAll(".delete-conducteur").forEach(button => {
            button.addEventListener("click", async function () {
                const matricule = this.getAttribute("data-matricule");
                if (confirm(`Voulez-vous vraiment supprimer le conducteur ${matricule} ?`)) {
                    try {
                        await deleteConducteurs(matricule);
                        chargerConducteurs(page); 
                    } catch (error) {
                        console.error("Erreur lors de la suppression du conducteur:", error);
                    }
                }
            });
        });

        // Afficher la pagination
        renderPaginationControls(paginationContainer, page, totalPages, (newPage) => chargerConducteurs(newPage));

    } catch (error) {
        console.error("Erreur lors du chargement des conducteurs:", error);
    }
}


