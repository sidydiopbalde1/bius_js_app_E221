const BASE_URL = 'http://127.0.0.1:8000';
const ENDPOINT = `${BASE_URL}/lignes`;

async function fetchData(url, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        };
        if (body) options.body = JSON.stringify(body);
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur API →', error);
        return null;
    }
}

export async function getLignes() {
    return await fetchData(ENDPOINT);
}

export async function createLigne(ligneData) {
    return await fetchData(ENDPOINT, 'POST', ligneData);
}

export async function updateLigne(id, ligneData) {
    return await fetchData(`${ENDPOINT}/${id}`, 'PUT', ligneData);
}

export async function deleteLigne(id) {
    return await fetchData(`${ENDPOINT}/${id}`, 'DELETE');
}
