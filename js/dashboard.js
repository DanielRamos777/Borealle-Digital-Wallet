// Verifica si hay usuario logueado
const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
if (!usuario) {
  window.location.href = 'index.html';
} else {
  const nombreHTML = document.querySelector('.header strong');
  if (nombreHTML) nombreHTML.innerText = usuario.nombre;

  const cerrar = document.querySelector('.logout');
  if (cerrar) {
    cerrar.addEventListener('click', () => {
      localStorage.removeItem('usuarioActivo');
      window.location.href = 'index.html';
    });
  }
}


