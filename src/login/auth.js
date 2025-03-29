document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    const loginButton = document.getElementById('loginButton');
    const loginText = document.getElementById('loginText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Reset previous states
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';
    loginButton.disabled = true;
    loginText.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');

    try {
        // Detailed error logging
        console.log('Attempting to connect to:', 'http://127.0.0.1:8000/api/login');
        console.log('Credentials:', {
            email: emailInput.value,
            password: passwordInput.value.replace(/./g, '*') // Mask password
        });

        const response = await fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            mode: 'cors', // Add this line
            cache: 'no-cache', // Add this line
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value
            })
        });

        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = '../bus/create-bus.html'; 
        } else {
            errorMessage.textContent = data.message || 'Échec de la connexion';
            errorMessage.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Erreur de connexion détaillée :", error);
        
        // More specific error handling
        if (error instanceof TypeError) {
            if (error.message === 'Failed to fetch') {
                errorMessage.textContent = 'Impossible de se connecter au serveur. Vérifiez :' + [
                    '- Le serveur est-il démarré ?',
                    '- L\'URL est-elle correcte ?',
                    '- Y a-t-il des erreurs de CORS ?'
                ].join('\n');
            } else {
                errorMessage.textContent = 'Erreur de réseau : ' + error.message;
            }
        } else {
            errorMessage.textContent = 'Erreur de connexion inattendue';
        }
        
        errorMessage.classList.remove('hidden');
    } finally {
        loginButton.disabled = false;
        loginText.classList.remove('hidden');
        loadingSpinner.classList.add('hidden');
    }
});