import { getBuses, getStations, getLignes } from '../fetch/api.js';
import { renderUserConnected } from '../login/auth.js';
// ❌ Pas besoin de cette ligne : import Chart from 'chart.js/auto';

const nombrePanne = document.getElementById('nombre_panne');
const nombreLigne = document.getElementById('nombre_ligne');
const nombreBus = document.getElementById('nombre_bus');
const nombreTrajet = document.getElementById('nombre_trajet');

console.log(nombrePanne, nombreLigne, nombreBus, nombreTrajet);

async function chargerDashboard() {
    const lignes = await getLignes();
    const stations = await getStations();
    const buses = await getBuses();

    console.log(lignes, stations, buses);

    nombreBus.innerText = buses.bus.length || 0;
    nombreLigne.innerText = lignes.length || 0;

    const pannes = buses.bus.filter(bus => bus.enCirculation === false);
    nombrePanne.innerText = pannes.length || 0;
}

function afficherTrajetChart() {
    const ctx = document.getElementById('monChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin'],
            datasets: [{
                label: 'Nombre de trajets',
                data: [30, 45, 28, 60, 50, 70],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderRadius: 10,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Trajets mensuels'
                }
            }
        }
    });
}

function afficherDeviceTrafficChart() {
    const ctx = document.getElementById('deviceTrafficChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Linux', 'Mac', 'iOS', 'Windows', 'Android', 'Other'],
            datasets: [{
                label: 'Appareils',
                data: [120, 220, 180, 240, 300, 100],
                backgroundColor: [
                    '#3b82f6', '#6366f1', '#f97316', '#10b981', '#000000', '#9ca3af'
                ],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function afficherLocationTrafficChart() {
    const ctx = document.getElementById('locationTrafficChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['US', 'Canada', 'Mexico', 'China', 'Japan', 'Australia'],
            datasets: [{
                label: 'Visiteurs',
                data: [100, 150, 130, 70, 180, 90],
                backgroundColor: '#16a34a',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    renderUserConnected();
    await chargerDashboard();
    afficherTrajetChart();
    afficherDeviceTrafficChart();
    afficherLocationTrafficChart();
});
