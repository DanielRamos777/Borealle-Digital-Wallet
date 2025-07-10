document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim().toLowerCase();
  const clave = document.getElementById('clave').value.trim();

  if (!nombre || !correo || !clave) {
    document.getElementById('mensaje').innerText = 'Todos los campos son obligatorios';
    return;
  }

  const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];

  const yaExiste = usuariosGuardados.find(u => u.correo === correo);

  if (yaExiste) {
    document.getElementById('mensaje').innerText = '⚠️ Este correo ya está registrado';
  } else {
    usuariosGuardados.push({ nombre, correo, clave });
    localStorage.setItem('usuarios', JSON.stringify(usuariosGuardados));
    document.getElementById('mensaje').innerText = '✅ ¡Cuenta creada correctamente!';
    document.getElementById('registerForm').reset();
  }
});
