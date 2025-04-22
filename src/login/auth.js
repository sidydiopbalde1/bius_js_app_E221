const form = document.getElementById('loginForm');
if(form){
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
    
        const emailInput = document.getElementById('emailInput');
        const passwordInput = document.getElementById('passwordInput');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const errorMessage = document.getElementById('errorMessage');
        const loginButton = document.getElementById('loginButton');
        const loginText = document.getElementById('loginText');
        const loadingSpinner = document.getElementById('loadingSpinner');
    
        let valid = true;
    
        // Reset
        emailError.classList.add('hidden');
        passwordError.classList.add('hidden');
        errorMessage.classList.add('hidden');
        emailInput.classList.remove('border-red-500');
        passwordInput.classList.remove('border-red-500');
    
        if (!emailInput.value.trim()) {
            emailError.classList.remove('hidden');
            emailInput.classList.add('border-red-500');
            valid = false;
        }
    
        if (!passwordInput.value.trim()) {
            passwordError.classList.remove('hidden');
            passwordInput.classList.add('border-red-500');
            valid = false;
        }
    
        if (!valid) return;
    
        loginButton.disabled = true;
        loginText.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
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
                window.location.href = '../bus/bus-list.html';
            } else {
                errorMessage.textContent = data.message || 'Échec de la connexion';
                errorMessage.classList.remove('hidden');
            }
        } catch (error) {
            errorMessage.textContent = 'Erreur réseau ou serveur';
            errorMessage.classList.remove('hidden');
        } finally {
            loginButton.disabled = false;
            loginText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
        }
    });
    
    // Gestion œil/œil barré
    document.getElementById('togglePassword').addEventListener('click', function () {
        const passwordInput = document.getElementById('passwordInput');
        const eyeIcon = document.getElementById('eyeIcon');
        const eyeSlashIcon = document.getElementById('eyeSlashIcon');
    
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeSlashIcon.classList.remove('hidden');
            eyeIcon.classList.add('hidden');
        } else {
            passwordInput.type = 'password';
            eyeSlashIcon.classList.add('hidden');
            eyeIcon.classList.remove('hidden');
        }
    });
}

export function renderUserConnected() {
    const user = JSON.parse(localStorage.getItem("user"));

    const conducteurElement = document.getElementById('nom_conducteur');
    const roleElement = document.getElementById('role_conducteur');

    // Vérifiez si les éléments existent
    if (!conducteurElement || !roleElement) {
        console.error("Les éléments nécessaires ne sont pas présents dans le DOM.");
        return;
    }

    if (user && user.email && user.roles) {
        conducteurElement.innerText = user.email;
        conducteurElement.classList.add('text-green-500');    
        roleElement.innerText = user.roles.length > 0 ? user.roles[0] : "Aucun rôle disponible.";
        roleElement.classList.add('text-red-500');
    } else {
        conducteurElement.innerText = "Nom inconnu";
        roleElement.innerText = "Aucun rôle disponible.";
    }
}
