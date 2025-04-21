// Validator function for conducteur
export function validateConducteur(conducteur) {
    const errors = [];

    if (!conducteur.nom || conducteur.nom.trim() === '') {
        errors.push("Le nom est requis.");
    }

    if (!conducteur.prenom || conducteur.prenom.trim() === '') {
        errors.push("Le prénom est requis.");
    }

    if (!conducteur.matricule || conducteur.matricule.trim() === '') {
        errors.push("Le matricule est requis.");
    } else if (!/^[a-zA-Z0-9]+$/.test(conducteur.matricule)) {
        errors.push("Le matricule doit être alphanumérique.");
    }

    if (!conducteur.telephone || conducteur.telephone.trim() === '') {
        errors.push("Le téléphone est requis.");
    } else if (!/^\+?\d{10,15}$/.test(conducteur.telephone)) {
        errors.push("Le téléphone doit être au format valide.");
    }

    const validTypesPermis = ['LOURD', 'LEGER']; 
    if (!conducteur.typePermis || !validTypesPermis.includes(conducteur.typePermis)) {
        errors.push("Le type de permis est invalide.");
    }

    return errors;
}
