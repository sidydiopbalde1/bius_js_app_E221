
const url ='http://127.0.0.1:8000';

 export  async function fetchData(url, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
        alert('Une erreur est survenue lors de la communication avec le serveur.');
        return null;
    }
}

// Récupérer tous les bus
export async function getBuses() {
    return await fetchData(`${url}/bus/list`);
}

// Supprimer un bus par immatriculation
export async function deleteBus(immatriculation) {
    const confirmDelete = confirm(`Voulez-vous vraiment supprimer le bus ${immatriculation} ?`);
    if (!confirmDelete) return;

    const response = await fetchData(`${url}/bus/delete/${immatriculation}`, 'DELETE');
    return response;
}


//------------------Create Bus ----------------
export async function getConducteurs() {
    return await fetchData(`${url}/conducteurs/list`);
}

// Ajouter un nouveau bus
export async function createBus(busData) {
    return await fetchData(`${url}/bus/create`, 'POST', busData);
}

export async function createConducteurs(conducteursData) {
    console.log(conducteursData);
    
    return await fetchData(`${url}/conducteurs/create`, 'POST', conducteursData);
}

export function deleteConducteurs(matricule) {

    return fetchData(`${url}/conducteurs/delete/${matricule}`, 'DELETE');
}

//------------------Create Lignes ----------------
export async function getLignes() {
    return await fetchData(`${url}/lignes/list`);
}

// Ajouter une nouvelle ligne
export async function createLignes(lignesData) {
    return await fetchData(`${url}/ligne/create`, 'POST', lignesData);
}
// Supprimer une ligne par numéro
export async function deleteLignes(numero) {
    const confirmDelete = confirm(`Voulez-vous vraiment supprimer la ligne ${numero} ?`);
    if (!confirmDelete) return;

    const response = await fetchData(`${url}/lignes/delete/${numero}`, 'DELETE');
    return response;
}
//------------------Create Conducteurs ----------------