import { createConducteurs } from "../fetch/api";
import { validateConducteur } from "./validatorConducteur";

document.addEventListener('DOMContentLoaded', () => {
    const formFields = document.querySelectorAll('.input-field, .btn-add');
    formFields.forEach((field, index) => {
      setTimeout(() => {
        field.classList.add('animate__animated', 'animate__fadeInUp');
      }, 100 * index);
    });
    
    // Floating label effect
    const inputs = document.querySelectorAll('.input-field');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.classList.add('ring-2', 'ring-blue-200');
      });
      
      input.addEventListener('blur', () => {
        input.classList.remove('ring-2', 'ring-blue-200');
      });
    });

    const errorMessage = document.getElementById('errorMessage');
    
    document.getElementById('conducteurForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const nom = document.getElementById('nom').value;
        const prenom = document.getElementById('prenom').value;
        const matricule = document.getElementById('matricule').value;
        const telephone = document.getElementById('telephone').value;
        const typePermis = document.getElementById('typePermis').value;
        
        const inputFields = document.querySelectorAll('.input-field');
        let hasError = false;
        
        // Reset all fields' styles
        inputFields.forEach(field => {
            field.classList.remove('border-red-500', 'animate__animated', 'animate__shakeX');
        });
        
        // Validate each field
        inputFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('border-red-500', 'animate__animated', 'animate__shakeX');
                hasError = true;
            }
        });

        if (hasError) return;

        const conducteur = { nom, prenom, matricule, telephone, typePermis };
        
        const errors = validateConducteur(conducteur);
        if (errors.length > 0) {
            errorMessage.textContent = errors.join(' | ');
            errorMessage.classList.remove('hidden');
            return;
        }

        try {
            const response = await createConducteurs(conducteur);
            const successMessage = document.getElementById('successMessage');
            successMessage.classList.add('active');

            // Reset form fields
            // inputFields.forEach(field => {
            //     field.value = '';
            // });

            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.classList.remove('active');
            }, 3000);
        } catch (error) {
            console.error("Erreur lors de l'ajout du conducteur:", error);
            errorMessage.textContent = "Une erreur est survenue lors de l'ajout du conducteur.";
            errorMessage.classList.remove('hidden');
        }
    });
});
