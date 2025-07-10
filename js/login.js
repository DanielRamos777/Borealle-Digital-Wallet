document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const correo = document.getElementById('correo').value.trim().toLowerCase();
  const clave = document.getElementById('clave').value.trim();

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  const encontrado = usuarios.find(u => u.correo === correo && u.clave === clave);

  if (encontrado) {
    localStorage.setItem('usuarioActivo', JSON.stringify(encontrado));
    window.location.href = 'dashboard.html';
  } else {
    document.getElementById('error').textContent = 'Credenciales incorrectas';
  }
});
