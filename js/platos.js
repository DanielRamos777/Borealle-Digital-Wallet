function getPlatos(){
    return JSON.parse(localStorage.getItem('platos')) || [];
}

function guardarPlatos(platos){
    localStorage.setItem('platos', JSON.stringify(platos));
}

function renderPlatos(){
    const tabla = document.getElementById('tablaPlatos');
    if(!tabla) return;
    const tbody = tabla.querySelector('tbody');
    const platos = getPlatos();
    tbody.innerHTML = '';
    platos.forEach((p, i)=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${i+1}</td><td>${p.titulo}</td><td>${p.descripcion}</td><td><img src="${p.imagen}" alt="${p.titulo}" width="60"></td>`;
        tbody.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', ()=>{
    renderPlatos();
    const form = document.getElementById('formPlato');
    if(form){
        form.addEventListener('submit', e=>{
            e.preventDefault();
            const titulo = document.getElementById('titulo').value.trim();
            const descripcion = document.getElementById('descripcion').value.trim();
            const imagen = document.getElementById('imagen').value.trim();
            if(!titulo || !descripcion || !imagen){
                alert('Complete todos los campos');
                return;
            }
            const platos = getPlatos();
            platos.push({titulo, descripcion, imagen});
            guardarPlatos(platos);
            form.reset();
            renderPlatos();
        });
    }
});
