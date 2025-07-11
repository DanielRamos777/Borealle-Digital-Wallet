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

  async function cargarEstadisticas() {
    try {
      const resp = await fetch('http://localhost:5000/dashboard/stats');
      if (!resp.ok) return;
      const datos = await resp.json();
      const cards = document.querySelectorAll('.card');
      if (cards[0]) cards[0].querySelector('.count').textContent = datos.reservas_pendientes;
      if (cards[1]) cards[1].querySelector('.count').textContent = datos.platos;
      if (cards[2]) cards[2].querySelector('.count').textContent = datos.mesas;
    } catch (e) {
      console.error('Error cargando estadísticas', e);
    }
  }

  cargarEstadisticas();
}


