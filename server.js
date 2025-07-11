const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const dataDir = path.join(__dirname, 'data');

function readData(file) {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
  }
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(content || '[]');
  } catch (e) {
    return [];
  }
}

function writeData(file, data) {
  const filePath = path.join(dataDir, file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function generateId(prefix, numDigits, existing) {
  let id;
  do {
    const rand = Math.floor(Math.random() * Math.pow(10, numDigits));
    id = `${prefix}${rand.toString().padStart(numDigits, '0')}`;
  } while (existing.some(item => item.id === id));
  return id;
}

// -------- RESERVAS --------
app.get('/api/reservas', (req, res) => {
  const reservas = readData('reservas.json');
  res.json(reservas);
});

app.post('/api/reservas', (req, res) => {
  const reservas = readData('reservas.json');
  const mesas = readData('mesas.json');
  const clientes = readData('clientes.json');
  const data = req.body;
  const mesa = mesas.find(m => m.id === data.mesa);
  if (!mesa) return res.status(400).json({ error: 'Mesa no encontrada' });
  if (data.personas > mesa.capacidad) {
    return res.status(400).json({ error: 'Capacidad excedida' });
  }
  const cliente = clientes.find(c => c.id === data.cliente);
  if (!cliente) return res.status(400).json({ error: 'Cliente no encontrado' });
  const id = generateId('RZ-', 4, reservas);
  const reserva = {
    id,
    fecha: data.fecha,
    hora: data.hora,
    personas: data.personas,
    mesa: data.mesa,
    estado: data.estado || 'Confirmada',
    cliente: data.cliente,
    empleado: data.empleado || null
  };
  reservas.push(reserva);
  writeData('reservas.json', reservas);
  res.status(201).json(reserva);
});

app.put('/api/reservas/:id', (req, res) => {
  const reservas = readData('reservas.json');
  const reserva = reservas.find(r => r.id === req.params.id);
  if (!reserva) return res.status(404).json({ error: 'No existe' });
  Object.assign(reserva, req.body);
  writeData('reservas.json', reservas);
  res.json(reserva);
});

app.delete('/api/reservas/:id', (req, res) => {
  let reservas = readData('reservas.json');
  const idx = reservas.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No existe' });
  reservas.splice(idx, 1);
  writeData('reservas.json', reservas);
  res.json({ msg: 'eliminada' });
});

// -------- PEDIDOS --------
app.get('/api/pedidos', (req, res) => {
  const pedidos = readData('pedidos.json');
  res.json(pedidos);
});

app.post('/api/pedidos', (req, res) => {
  const pedidos = readData('pedidos.json');
  const reservas = readData('reservas.json');
  const data = req.body;
  const reserva = reservas.find(r => r.id === data.reserva);
  if (!reserva) return res.status(400).json({ error: 'Reserva no existe' });
  const id = generateId('PED-', 3, pedidos);
  const total = data.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const pedido = { id, reserva: data.reserva, items: data.items, total };
  pedidos.push(pedido);
  writeData('pedidos.json', pedidos);
  res.status(201).json(pedido);
});

// -------- PLATOS --------
app.get('/api/platos', (req, res) => {
  const platos = readData('platos.json');
  res.json(platos);
});

app.post('/api/platos', (req, res) => {
  const platos = readData('platos.json');
  const data = req.body;
  const id = generateId('PL-', 3, platos);
  const plato = { id, ...data };
  platos.push(plato);
  writeData('platos.json', platos);
  res.status(201).json(plato);
});

app.put('/api/platos/:id', (req, res) => {
  const platos = readData('platos.json');
  const plato = platos.find(p => p.id === req.params.id);
  if (!plato) return res.status(404).json({ error: 'No existe' });
  Object.assign(plato, req.body);
  writeData('platos.json', platos);
  res.json(plato);
});

app.delete('/api/platos/:id', (req, res) => {
  const platos = readData('platos.json');
  const idx = platos.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No existe' });
  platos.splice(idx, 1);
  writeData('platos.json', platos);
  res.json({ msg: 'eliminado' });
});

// -------- CLIENTES --------
app.get('/api/clientes', (req, res) => {
  const clientes = readData('clientes.json');
  res.json(clientes);
});

app.post('/api/clientes', (req, res) => {
  const clientes = readData('clientes.json');
  const data = req.body;
  const id = generateId('CL-', 3, clientes);
  const cliente = { id, ...data };
  clientes.push(cliente);
  writeData('clientes.json', clientes);
  res.status(201).json(cliente);
});

app.put('/api/clientes/:id', (req, res) => {
  const clientes = readData('clientes.json');
  const cliente = clientes.find(c => c.id === req.params.id);
  if (!cliente) return res.status(404).json({ error: 'No existe' });
  Object.assign(cliente, req.body);
  writeData('clientes.json', clientes);
  res.json(cliente);
});

app.delete('/api/clientes/:id', (req, res) => {
  let clientes = readData('clientes.json');
  const idx = clientes.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No existe' });
  clientes.splice(idx, 1);
  writeData('clientes.json', clientes);
  res.json({ msg: 'eliminado' });
});

// -------- MESAS --------
app.get('/api/mesas', (req, res) => {
  const mesas = readData('mesas.json');
  res.json(mesas);
});

app.post('/api/mesas', (req, res) => {
  const mesas = readData('mesas.json');
  const data = req.body;
  const id = generateId('MS-', 3, mesas);
  const mesa = { id, ...data };
  mesas.push(mesa);
  writeData('mesas.json', mesas);
  res.status(201).json(mesa);
});

app.put('/api/mesas/:id', (req, res) => {
  const mesas = readData('mesas.json');
  const mesa = mesas.find(m => m.id === req.params.id);
  if (!mesa) return res.status(404).json({ error: 'No existe' });
  Object.assign(mesa, req.body);
  writeData('mesas.json', mesas);
  res.json(mesa);
});

app.delete('/api/mesas/:id', (req, res) => {
  const mesas = readData('mesas.json');
  const idx = mesas.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No existe' });
  mesas.splice(idx, 1);
  writeData('mesas.json', mesas);
  res.json({ msg: 'eliminado' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

