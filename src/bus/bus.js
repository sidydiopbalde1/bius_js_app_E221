document.addEventListener("DOMContentLoaded", function () {
    const apiBaseUrl = "http://localhost:8000/api/bus"; // Symfony API endpoint

    // Fonction pour récupérer et afficher les bus
    function loadBuses() {
        fetch(apiBaseUrl)
            .then(response => response.json())
            .then(data => {
                let busList = document.getElementById("bus-list");
                busList.innerHTML = "";
                data.forEach(bus => {
                    let li = document.createElement("li");
                    li.textContent = `${bus.nom} - ${bus.matricule}`;
                    busList.appendChild(li);
                });
            })
            .catch(error => console.error("Erreur :", error));
    }

    // Ajouter un bus via formulaire
    document.getElementById("bus-form").addEventListener("submit", function (event) {
        event.preventDefault();

        let nom = document.getElementById("nom").value;
        let matricule = document.getElementById("matricule").value;

        fetch(apiBaseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nom, matricule })
        })
        .then(response => response.json())
        .then(() => {
            loadBuses(); // Recharger la liste des bus
            document.getElementById("bus-form").reset();
        })
        .catch(error => console.error("Erreur :", error));
    });

    // Charger les bus au chargement de la page
    loadBuses();
});
