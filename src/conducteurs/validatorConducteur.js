// Validator function for conducteur
export function validateConducteur(conducteur) {
    const errors = [];

    // Validate 'nom'
    if (!conducteur.nom || conducteur.nom.trim() === '') {
        errors.push("Le nom est requis.");
    }

    // Validate 'prenom'
    if (!conducteur.prenom || conducteur.prenom.trim() === '') {
        errors.push("Le prénom est requis.");
    }

    // Validate 'matricule' (Assuming it's a specific format, e.g., alphanumeric)
    if (!conducteur.matricule || conducteur.matricule.trim() === '') {
        errors.push("Le matricule est requis.");
    } else if (!/^[a-zA-Z0-9]+$/.test(conducteur.matricule)) {
        errors.push("Le matricule doit être alphanumérique.");
    }

    // Validate 'telephone' (Assuming phone format like '+1234567890' or '0123456789')
    if (!conducteur.telephone || conducteur.telephone.trim() === '') {
        errors.push("Le téléphone est requis.");
    } else if (!/^\+?\d{10,15}$/.test(conducteur.telephone)) {
        errors.push("Le téléphone doit être au format valide.");
    }

    // Validate 'typePermis' (Assuming it's a known set of types)
    const validTypesPermis = ['B', 'A', 'C', 'D']; // Modify as needed
    if (!conducteur.typePermis || !validTypesPermis.includes(conducteur.typePermis)) {
        errors.push("Le type de permis est invalide.");
    }

    return errors;
}
