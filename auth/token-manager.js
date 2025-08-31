let token = localStorage.getItem('jwt')

if (!token) window.location.replace('login.html')

if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1)
}

token = token.trim()

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('jwt')
    window.location.replace('login.html')
})