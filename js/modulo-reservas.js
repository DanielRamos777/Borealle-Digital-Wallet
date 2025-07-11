const tabla = document.getElementById('tablaReservas');
const detalle = document.getElementById('detalleReserva');
if(tabla){
  const reservas = [
    {id:1, personas:4, fecha:'2024-08-01', hora:'19:00', total:50,
     estado:'Confirmada', metodo:'Tarjeta', tipo:'Online', mesa:'5', cliente:'Juan Pérez', empleado:'Carlos',
     pedido:[{producto:'Pizza', precio:10, cantidad:2},{producto:'Ensalada', precio:5, cantidad:1}]},
    {id:2, personas:2, fecha:'2024-08-02', hora:'20:00', total:30,
     estado:'Pendiente', metodo:'Efectivo', tipo:'Local', mesa:'2', cliente:'Ana Gómez', empleado:'Lucía',
     pedido:[{producto:'Pasta', precio:12, cantidad:2}]},
    {id:3, personas:3, fecha:'2024-08-03', hora:'18:30', total:40,
     estado:'Confirmada', metodo:'Tarjeta', tipo:'Online', mesa:'7', cliente:'Pedro Ruiz', empleado:'Mario',
     pedido:[{producto:'Hamburguesa', precio:8, cantidad:3},{producto:'Refresco', precio:4, cantidad:2}]},
    {id:4, personas:5, fecha:'2024-08-04', hora:'21:00', total:65,
     estado:'Pendiente', metodo:'Efectivo', tipo:'Local', mesa:'10', cliente:'Laura Díaz', empleado:'Carla',
     pedido:[{producto:'Pizza', precio:10, cantidad:5}]},
    {id:5, personas:2, fecha:'2024-08-05', hora:'19:30', total:28,
     estado:'Confirmada', metodo:'Tarjeta', tipo:'Online', mesa:'1', cliente:'Miguel León', empleado:'Carlos',
     pedido:[{producto:'Ensalada', precio:7, cantidad:2},{producto:'Agua', precio:2, cantidad:2}]},
    {id:6, personas:6, fecha:'2024-08-06', hora:'20:30', total:90,
     estado:'Pendiente', metodo:'Efectivo', tipo:'Local', mesa:'8', cliente:'Sofía Mora', empleado:'Lucía',
     pedido:[{producto:'Pasta', precio:15, cantidad:6}]}
  ];
  const tbody = tabla.querySelector('tbody');
  reservas.forEach(r=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${r.id}</td><td>${r.personas}</td><td>${r.fecha}</td><td>${r.hora}</td><td>$${r.total}</td>`;
    tr.addEventListener('click',()=>mostrarDetalle(r));
    tbody.appendChild(tr);
  });
  document.getElementById('nuevaReserva').addEventListener('click',()=>{
    sessionStorage.removeItem('reserva');
    window.location.href='../reserva/formulario-fecha-hora.html';
  });
  function mostrarDetalle(r){
    detalle.innerHTML=`<h3>Detalles de Reserva</h3>
    <p><strong>ID de reserva:</strong> ${r.id}</p>
    <p><strong>Fecha y hora:</strong> ${r.fecha} ${r.hora}</p>
    <p><strong>Cantidad de personas:</strong> ${r.personas}</p>
    <p><strong>Estado:</strong> ${r.estado}</p>
    <p><strong>Método de pago:</strong> ${r.metodo}</p>
    <p><strong>Tipo de reserva:</strong> ${r.tipo}</p>
    <p><strong>Mesa:</strong> ${r.mesa}</p>
    <p><strong>Cliente:</strong> ${r.cliente}</p>
    <p><strong>Empleado:</strong> ${r.empleado}</p>`;
    const tablaPedido=document.createElement('table');
    tablaPedido.innerHTML=`<thead><tr><th>Producto</th><th>Precio Unitario</th><th>Cantidad</th><th>Monto</th></tr></thead>`;
    const cuerpo=document.createElement('tbody');
    r.pedido.forEach(p=>{
      const row=document.createElement('tr');
      const monto=p.precio*p.cantidad;
      row.innerHTML=`<td>${p.producto}</td><td>$${p.precio}</td><td>${p.cantidad}</td><td>$${monto}</td>`;
      cuerpo.appendChild(row);
    });
    tablaPedido.appendChild(cuerpo);
    detalle.appendChild(tablaPedido);
    const acciones=document.createElement('div');
    acciones.id='acciones';
    acciones.innerHTML=`<button class="btn btn-primary">✏️ Editar</button><button class="btn btn-primary">❌ Cancelar</button>`;
    detalle.appendChild(acciones);
  }
}

// activar enlace actual
const links=document.querySelectorAll('nav ul li a');
links.forEach(link=>{ if(link.href===window.location.href){ link.classList.add('active'); }});

// cerrar sesión dummy
const cerrar=document.getElementById('cerrarSesion');
if(cerrar){
  cerrar.addEventListener('click',()=>{ alert('Sesión cerrada'); });
}
