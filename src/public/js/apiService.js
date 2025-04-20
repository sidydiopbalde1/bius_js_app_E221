export async function fetchLignes() {
    try {
        const response = await fetch('/lignes'); // URL du backend Symfony
        if (!response.ok) throw new Error('Erreur lors du chargement des lignes');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}
