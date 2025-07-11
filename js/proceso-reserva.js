let reserva = JSON.parse(sessionStorage.getItem('reserva')) || {};
function guardar(data){
  reserva = Object.assign(reserva,data);
  sessionStorage.setItem('reserva', JSON.stringify(reserva));
}

const form = document.getElementById('formFechaHora');
if(form){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const fecha=document.getElementById('fecha').value;
    const hora=document.getElementById('hora').value;
    const personas=document.getElementById('personas').value;
    if(!fecha || !hora || !personas){
      alert('Complete todos los campos');
      return;
    }
    guardar({fecha,hora,personas});
    // simular siguiente paso
    window.location.href='seleccionar-mesa.html';
  });
}

const lista = document.getElementById('listaMesas');
if(lista){
  const mesas = [];
  for(let i=1;i<=10;i++){
    mesas.push({numero:i, capacidad:Math.floor(Math.random()*6)+2, ubicacion: i%2? 'Interior':'Terraza'});
  }
  const tabla=document.createElement('table');
  tabla.innerHTML='<thead><tr><th>N\u00famero</th><th>Capacidad</th><th>Ubicaci\u00f3n</th><th></th></tr></thead>';
  const tbody=document.createElement('tbody');
  let seleccion=null;
  mesas.forEach(m=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${m.numero}</td><td>${m.capacidad}</td><td>${m.ubicacion}</td><td><button class="btn btn-primary">Reservar</button></td>`;
    const btn=tr.querySelector('button');
    btn.addEventListener('click',()=>{
      seleccion=m;
      [...tbody.querySelectorAll('tr')].forEach(r=>r.classList.remove('active'));
      tr.classList.add('active');
    });
    tbody.appendChild(tr);
  });
  tabla.appendChild(tbody);
  lista.appendChild(tabla);
  document.getElementById('siguienteMesa').addEventListener('click',()=>{
    if(!seleccion){
      alert('Seleccione una mesa');
      return;
    }
    guardar({mesa:seleccion});
    console.log('Reserva actual', reserva);
    // continuar a siguiente paso simulado
    alert('Mesa seleccionada. Ver consola para ver datos.');
  });
}

// cerrar sesión dummy
const cerrar=document.getElementById('cerrarSesion');
if(cerrar){
  cerrar.addEventListener('click',()=>{ alert('Sesión cerrada'); });
}
