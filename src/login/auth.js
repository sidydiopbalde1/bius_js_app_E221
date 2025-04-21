document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    const loginButton = document.getElementById('loginButton');
    const loginText = document.getElementById('loginText');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Reset UI
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';
    loginButton.disabled = true;
    loginText.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');

    try {
        const response = await fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = '../bus/create-bus.html';
        } else {
            errorMessage.textContent = data.message || 'Échec de la connexion';
            errorMessage.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Erreur de connexion :", error);
        errorMessage.textContent = "Erreur réseau ou serveur injoignable.";
        errorMessage.classList.remove('hidden');
    } finally {
        loginButton.disabled = false;
        loginText.classList.remove('hidden');
        loadingSpinner.classList.add('hidden');
    }
});
