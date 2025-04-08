export function validateBusForm(formData) {
    const errors = [];

    // Vérifier l'immatriculation (doit être une chaîne non vide)
    if (!formData.immatriculation || formData.immatriculation.trim() === '') {
        errors.push("L'immatriculation est requise.");
    }

    // Vérifier le type (doit être parmi les types définis)
    const busTypes = ["Tata", "Car Rapide", "DDK"];
    if (!busTypes.includes(formData.type)) {
        errors.push("Le type de bus est invalide.");
    }

    // Vérifier le kilométrage (doit être un nombre positif)
    if (isNaN(formData.kilometrage) || formData.kilometrage < 0) {
        errors.push("Le kilométrage doit être un nombre positif.");
    }

    // Vérifier le nombre de places (doit être un entier positif)
    if (isNaN(formData.nbrePlaces) || formData.nbrePlaces <= 0 || !Number.isInteger(formData.nbrePlaces)) {
        errors.push("Le nombre de places doit être un entier positif.");
    }

    // Vérifier si le conducteur est défini (optionnel mais doit être un ID valide s'il est présent)
    if (formData.conducteur && isNaN(formData.conducteur)) {
        errors.push("Le conducteur sélectionné est invalide.");
    }

    return errors;
}
