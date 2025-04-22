fetch('http://127.0.0.1:8000/api/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'monpassword'
    })
})
.then(response => response.json())
.then(data => {
    console.log("Token reçu :", data.token);
    localStorage.setItem("token", data.token); 
})
.catch(error => console.error("Erreur :", error));
