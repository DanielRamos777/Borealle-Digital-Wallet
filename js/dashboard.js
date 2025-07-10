// Verifica si hay usuario logueado
const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
if (!usuario) {
  window.location.href = 'index.html';
} else {
  const bienvenida = document.getElementById('bienvenida');
  if (bienvenida) {
    const nombre = usuario.nombre || '';
    const foto = usuario.foto || '';
    let html = `Bienvenido, <strong>${nombre}</strong>`;
    if (foto) {
      html += ` <img src="${foto}" alt="Foto de ${nombre}" class="foto-perfil">`;
    }
    bienvenida.innerHTML = html;
  }

  const cerrar = document.querySelector('.logout');
  if (cerrar) {
    cerrar.addEventListener('click', () => {
      localStorage.removeItem('usuarioActivo');
      window.location.href = 'index.html';
    });
  }
}


