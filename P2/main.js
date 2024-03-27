function logout() {
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Elimina la cookie de usuario
    document.querySelector('h3').textContent = ''; // Actualiza el mensaje de conexión
}