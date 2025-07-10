function getReservaActual() {
    return JSON.parse(localStorage.getItem('reservaActual')) || {};
}

function guardarReservaActual(data) {
    const actual = getReservaActual();
    localStorage.setItem('reservaActual', JSON.stringify(Object.assign(actual, data)));
}

function iniciarListado() {
    const tabla = document.getElementById('tablaReservas');
    if (!tabla) return;
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const tbody = tabla.querySelector('tbody');
    tbody.innerHTML = '';
    reservas.forEach((r, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${r.fecha}</td><td>${r.hora}</td><td>${r.cliente.nombre}</td>`;
        tr.addEventListener('click', () => mostrarDetalle(r));
        tbody.appendChild(tr);
    });
    document.getElementById('nuevaReserva').onclick = () => {
        localStorage.removeItem('reservaActual');
        window.location.href = '../reserva/formulario-fecha-hora.html';
    };
}

function mostrarDetalle(reserva) {
    const div = document.getElementById('detalleReserva');
    if (!div) return;
    div.innerHTML = `<h3>Detalle</h3>
        <p><strong>Fecha:</strong> ${reserva.fecha}</p>
        <p><strong>Hora:</strong> ${reserva.hora}</p>
        <p><strong>Personas:</strong> ${reserva.personas}</p>
        <p><strong>Mesa:</strong> ${reserva.mesa.numero}</p>
        <p><strong>Cliente:</strong> ${reserva.cliente.nombre}</p>`;
}

function initFechaHora() {
    const form = document.getElementById('formFechaHora');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        guardarReservaActual({
            fecha: document.getElementById('fecha').value,
            hora: document.getElementById('hora').value,
            personas: document.getElementById('personas').value
        });
        window.location.href = 'seleccionar-mesa.html';
    });
}

function initMesas() {
    const cont = document.getElementById('listaMesas');
    if (!cont) return;
    const mesas = [
        {numero:1, capacidad:4, ubicacion:'Salon', estado:'Libre'},
        {numero:2, capacidad:2, ubicacion:'Terraza', estado:'Libre'},
        {numero:3, capacidad:6, ubicacion:'Salon', estado:'Libre'}
    ];
    mesas.forEach(m => {
        const div = document.createElement('div');
        div.innerHTML = `Mesa ${m.numero} - Capacidad ${m.capacidad} - ${m.ubicacion}
            <button class="btn btn-primary">Reservar</button>`;
        div.querySelector('button').addEventListener('click', ()=>{
            guardarReservaActual({mesa:m});
            window.location.href = 'datos-cliente.html';
        });
        cont.appendChild(div);
    });
}

function initCliente() {
    const form = document.getElementById('formCliente');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        guardarReservaActual({
            cliente:{
                nombre:document.getElementById('nombre').value,
                dni:document.getElementById('dni').value,
                telefono:document.getElementById('telefono').value,
                correo:document.getElementById('correo').value
            }
        });
        window.location.href = 'seleccionar-platos.html';
    });
}

function initPlatos() {
    const lista = document.getElementById('listaPlatos');
    if (!lista) return;
    const platos = [
        {id:1,nombre:'Ensalada',precio:5},
        {id:2,nombre:'Hamburguesa',precio:8},
        {id:3,nombre:'Pizza',precio:7}
    ];
    const carritoDiv = document.getElementById('carrito');
    const actual = getReservaActual();
    actual.platos = actual.platos || [];

    function renderCarrito(){
        carritoDiv.innerHTML = '<h3>Carrito</h3>';
        let total = 0;
        actual.platos.forEach((p,i)=>{
            const item = document.createElement('div');
            item.textContent = p.nombre + ' - $' + p.precio;
            carritoDiv.appendChild(item);
            total += p.precio;
        });
        const totalDiv = document.createElement('div');
        totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;
        carritoDiv.appendChild(totalDiv);
        const siguiente = document.createElement('button');
        siguiente.textContent = 'Siguiente';
        siguiente.className='btn btn-primary';
        siguiente.onclick = ()=>{
            guardarReservaActual({platos:actual.platos});
            window.location.href = 'datos-finales-cliente.html';
        };
        const borrar = document.createElement('button');
        borrar.textContent='Borrar Todo';
        borrar.className='btn btn-danger';
        borrar.style='margin-left:10px';
        borrar.onclick=()=>{
            actual.platos=[];
            renderCarrito();
        };
        carritoDiv.appendChild(siguiente);
        carritoDiv.appendChild(borrar);
    }

    platos.forEach(p=>{
        const div=document.createElement('div');
        div.innerHTML = `${p.nombre} - $${p.precio} <button class="btn btn-primary">Agregar</button>`;
        div.querySelector('button').addEventListener('click',()=>{
            actual.platos.push(p);
            renderCarrito();
        });
        lista.appendChild(div);
    });
    renderCarrito();
}

function initConfirmacion() {
    const resumen = document.getElementById('resumen');
    if (!resumen) return;
    const reserva = getReservaActual();
    resumen.innerHTML = `<p><strong>Fecha:</strong> ${reserva.fecha}</p>
        <p><strong>Hora:</strong> ${reserva.hora}</p>
        <p><strong>Personas:</strong> ${reserva.personas}</p>
        <p><strong>Mesa:</strong> ${reserva.mesa.numero}</p>
        <p><strong>Cliente:</strong> ${reserva.cliente.nombre}</p>`;
    reserva.platos = reserva.platos || [];
    const lista = document.createElement('ul');
    reserva.platos.forEach(p=>{
        const li=document.createElement('li');
        li.textContent = p.nombre + ' - $' + p.precio;
        lista.appendChild(li);
    });
    resumen.appendChild(lista);
    document.getElementById('guardarReserva').onclick = ()=>{
        const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        reservas.push(reserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));
        localStorage.removeItem('reservaActual');
        window.location.href = '../data/reservas.html';
    };
}

// Inicializaciones
iniciarListado();
initFechaHora();
initMesas();
initCliente();
initPlatos();
initConfirmacion();
