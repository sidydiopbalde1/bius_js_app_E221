import { createConducteurs, getConducteurs, deleteConducteurs,  } from "../fetch/api.js";
import { validateConducteur } from "./validatorConducteur.js";

document.addEventListener('DOMContentLoaded', async () => {
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

async function chargerConducteurs() {
    try {
        const conducteurs = await getConducteurs();
        console.log("Liste des conducteurs :", conducteurs);
        
        const driverTableBody = document.getElementById("driverTableBody");

        driverTableBody.innerHTML = ""; 

        conducteurs.conducteurs.forEach(conducteur => {
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
                
              
            `;

            driverTableBody.appendChild(row);
        });

    // Ajouter un event listener pour chaque bouton de suppression
        const deleteButtons = document.querySelectorAll(".delete-conducteur");
        deleteButtons.forEach(button => {
            button.addEventListener("click", async function () {
                const matricule = this.getAttribute("data-matricule");
                const confirmDelete = confirm(`Voulez-vous vraiment supprimer le conducteur ${matricule} ?`);
                if (confirmDelete) {
                    try {
                        await deleteConducteurs(matricule);
                        await chargerConducteurs(); // Recharger la liste après suppression
                    } catch (error) {
                        console.error("Erreur lors de la suppression du conducteur:", error);
                    }
                }
            });
        });
    } catch (error) {
        console.error("Erreur lors du chargement des conducteurs:", error);
    }
}
