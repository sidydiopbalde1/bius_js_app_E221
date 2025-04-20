const BASE_URL = 'http://127.0.0.1:8000';
const ENDPOINT = `${BASE_URL}/arrets`;

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

export async function getArretsByLigne(ligneId) {
    return await fetchData(`${ENDPOINT}/ligne/${ligneId}`);
}

export async function createArret(arretData) {
    return await fetchData(ENDPOINT, 'POST', arretData);
}
