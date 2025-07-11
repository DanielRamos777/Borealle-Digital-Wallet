from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///borealle.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Cliente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    dni = db.Column(db.String(20), unique=True, nullable=False)
    telefono = db.Column(db.String(20))
    email = db.Column(db.String(120))
    direccion = db.Column(db.String(200))
    activo = db.Column(db.Boolean, default=True)
    reservas = db.relationship('Reserva', backref='cliente', lazy=True)

class Mesa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    numero = db.Column(db.Integer, unique=True, nullable=False)
    capacidad = db.Column(db.Integer, nullable=False)
    ubicacion = db.Column(db.String(20))
    reservas = db.relationship('Reserva', backref='mesa', lazy=True)

class Plato(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    descripcion = db.Column(db.Text)
    precio = db.Column(db.Float, nullable=False)
    categoria = db.Column(db.String(50))
    imagen_url = db.Column(db.String(200))

class Reserva(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.String(10), nullable=False)
    hora = db.Column(db.String(5), nullable=False)
    personas = db.Column(db.Integer, nullable=False)
    cliente_id = db.Column(db.Integer, db.ForeignKey('cliente.id'), nullable=False)
    mesa_id = db.Column(db.Integer, db.ForeignKey('mesa.id'), nullable=False)
    estado = db.Column(db.String(20), default='Confirmada')
    tipo_reserva = db.Column(db.String(20), default='Presencial')
    metodo_pago = db.Column(db.String(50))
    total = db.Column(db.Float, default=0.0)
    pedidos = db.relationship('Pedido', backref='reserva', lazy=True)

class Pedido(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reserva_id = db.Column(db.Integer, db.ForeignKey('reserva.id'), nullable=False)
    plato_id = db.Column(db.Integer, db.ForeignKey('plato.id'), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    precio_unitario = db.Column(db.Float, nullable=False)
    subtotal = db.Column(db.Float, nullable=False)
    plato = db.relationship('Plato')

# ---------------------------- CLIENTES ---------------------------------
@app.route('/clientes', methods=['POST'])
def crear_cliente():
    data = request.json
    try:
        if Cliente.query.filter_by(dni=data.get('dni')).first():
            return jsonify({'error': 'DNI existente'}), 400
        cliente = Cliente(
            nombre=data.get('nombre'),
            dni=data.get('dni'),
            telefono=data.get('telefono'),
            email=data.get('email'),
            direccion=data.get('direccion')
        )
        db.session.add(cliente)
        db.session.commit()
        return jsonify({'id': cliente.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/clientes', methods=['GET'])
def listar_clientes():
    clientes = Cliente.query.filter_by(activo=True).all()
    result = []
    for c in clientes:
        result.append({
            'id': c.id,
            'nombre': c.nombre,
            'dni': c.dni,
            'telefono': c.telefono,
            'email': c.email,
            'direccion': c.direccion
        })
    return jsonify(result)

@app.route('/clientes/<int:id>', methods=['PUT'])
def editar_cliente(id):
    data = request.json
    cliente = Cliente.query.get_or_404(id)
    try:
        cliente.nombre = data.get('nombre', cliente.nombre)
        cliente.telefono = data.get('telefono', cliente.telefono)
        cliente.email = data.get('email', cliente.email)
        cliente.direccion = data.get('direccion', cliente.direccion)
        db.session.commit()
        return jsonify({'msg': 'actualizado'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/clientes/<int:id>', methods=['DELETE'])
def desactivar_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    try:
        cliente.activo = False
        db.session.commit()
        return jsonify({'msg': 'desactivado'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------------------------- MESAS ---------------------------------
@app.route('/mesas', methods=['GET'])
def listar_mesas():
    mesas = Mesa.query.all()
    result = []
    for m in mesas:
        result.append({'id': m.id, 'numero': m.numero, 'capacidad': m.capacidad, 'ubicacion': m.ubicacion})
    return jsonify(result)

@app.route('/mesas/disponibles')
def mesas_disponibles():
    fecha = request.args.get('fecha')
    hora = request.args.get('hora')
    mesas = Mesa.query.all()
    disponibles = []
    for mesa in mesas:
        reserva = Reserva.query.filter_by(mesa_id=mesa.id, fecha=fecha, hora=hora, estado='Confirmada').first()
        if not reserva:
            disponibles.append({'id': mesa.id, 'numero': mesa.numero, 'capacidad': mesa.capacidad, 'ubicacion': mesa.ubicacion})
    return jsonify(disponibles)

# ---------------------------- PLATOS ---------------------------------
@app.route('/platos', methods=['GET'])
def listar_platos():
    platos = Plato.query.all()
    result = []
    for p in platos:
        result.append({'id': p.id, 'nombre': p.nombre, 'descripcion': p.descripcion, 'precio': p.precio, 'categoria': p.categoria, 'imagen_url': p.imagen_url})
    return jsonify(result)

@app.route('/platos', methods=['POST'])
def crear_plato():
    data = request.json
    try:
        plato = Plato(
            nombre=data.get('nombre'),
            descripcion=data.get('descripcion'),
            precio=data.get('precio'),
            categoria=data.get('categoria'),
            imagen_url=data.get('imagen_url')
        )
        db.session.add(plato)
        db.session.commit()
        return jsonify({'id': plato.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/platos/<int:id>', methods=['PUT'])
def editar_plato(id):
    data = request.json
    plato = Plato.query.get_or_404(id)
    try:
        plato.nombre = data.get('nombre', plato.nombre)
        plato.descripcion = data.get('descripcion', plato.descripcion)
        plato.precio = data.get('precio', plato.precio)
        plato.categoria = data.get('categoria', plato.categoria)
        plato.imagen_url = data.get('imagen_url', plato.imagen_url)
        db.session.commit()
        return jsonify({'msg': 'actualizado'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/platos/<int:id>', methods=['DELETE'])
def eliminar_plato(id):
    plato = Plato.query.get_or_404(id)
    try:
        db.session.delete(plato)
        db.session.commit()
        return jsonify({'msg': 'eliminado'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------------------------- RESERVAS ---------------------------------
@app.route('/reservas', methods=['POST'])
def crear_reserva():
    data = request.json
    pedidos_data = data.pop('pedidos', [])
    try:
        mesa_id = data.get('mesa_id')
        fecha = data.get('fecha')
        hora = data.get('hora')
        existente = Reserva.query.filter_by(mesa_id=mesa_id, fecha=fecha, hora=hora, estado='Confirmada').first()
        if existente:
            return jsonify({'error': 'Mesa no disponible'}), 400
        reserva = Reserva(**data)
        db.session.add(reserva)
        total = 0
        for item in pedidos_data:
            plato = Plato.query.get(item['plato_id'])
            if plato:
                subtotal = plato.precio * item['cantidad']
                pedido = Pedido(reserva=reserva, plato=plato, cantidad=item['cantidad'], precio_unitario=plato.precio, subtotal=subtotal)
                db.session.add(pedido)
                total += subtotal
        reserva.total = total
        db.session.commit()
        return jsonify({'id': reserva.id, 'total': reserva.total}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/reservas', methods=['GET'])
def listar_reservas():
    reservas = Reserva.query.all()
    result = []
    for r in reservas:
        result.append({'id': r.id, 'fecha': r.fecha, 'hora': r.hora, 'personas': r.personas, 'estado': r.estado, 'total': r.total})
    return jsonify(result)

@app.route('/reservas/<int:id>', methods=['GET'])
def detalle_reserva(id):
    r = Reserva.query.get_or_404(id)
    pedidos = [{'plato_id': p.plato_id, 'cantidad': p.cantidad, 'subtotal': p.subtotal} for p in r.pedidos]
    return jsonify({'id': r.id, 'fecha': r.fecha, 'hora': r.hora, 'personas': r.personas, 'cliente_id': r.cliente_id, 'mesa_id': r.mesa_id, 'estado': r.estado, 'total': r.total, 'pedidos': pedidos})

@app.route('/reservas/<int:id>', methods=['PUT'])
def editar_reserva(id):
    r = Reserva.query.get_or_404(id)
    data = request.json
    try:
        r.fecha = data.get('fecha', r.fecha)
        r.hora = data.get('hora', r.hora)
        r.personas = data.get('personas', r.personas)
        r.mesa_id = data.get('mesa_id', r.mesa_id)
        r.estado = data.get('estado', r.estado)
        r.tipo_reserva = data.get('tipo_reserva', r.tipo_reserva)
        r.metodo_pago = data.get('metodo_pago', r.metodo_pago)
        db.session.commit()
        return jsonify({'msg': 'actualizado'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/reservas/<int:id>', methods=['DELETE'])
def cancelar_reserva(id):
    r = Reserva.query.get_or_404(id)
    try:
        r.estado = 'Cancelada'
        db.session.commit()
        return jsonify({'msg': 'cancelada'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------------------------- PEDIDOS ---------------------------------
@app.route('/pedidos', methods=['POST'])
def crear_pedido():
    data = request.json
    reserva_id = data.get('reserva_id')
    productos = data.get('productos', [])
    r = Reserva.query.get_or_404(reserva_id)
    total = r.total
    try:
        for prod in productos:
            plato = Plato.query.get(prod['id'])
            if plato:
                subtotal = plato.precio * prod['cantidad']
                pedido = Pedido(reserva=r, plato=plato, cantidad=prod['cantidad'], precio_unitario=plato.precio, subtotal=subtotal)
                db.session.add(pedido)
                total += subtotal
        r.total = total
        db.session.commit()
        return jsonify({'total': r.total})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/pedidos/<int:reserva_id>', methods=['GET'])
def listar_pedidos(reserva_id):
    r = Reserva.query.get_or_404(reserva_id)
    pedidos = [{'plato_id': p.plato_id, 'cantidad': p.cantidad, 'subtotal': p.subtotal} for p in r.pedidos]
    return jsonify(pedidos)

@app.route('/pedidos/<int:reserva_id>', methods=['DELETE'])
def eliminar_pedidos(reserva_id):
    r = Reserva.query.get_or_404(reserva_id)
    try:
        for p in r.pedidos:
            db.session.delete(p)
        r.total = 0
        db.session.commit()
        return jsonify({'msg': 'eliminados'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------------------------- RESUMEN ---------------------------------
@app.route('/resumen/reserva/<int:id>', methods=['GET'])
def resumen_reserva(id):
    r = Reserva.query.get_or_404(id)
    cliente = r.cliente
    mesa = r.mesa
    pedidos = [{'nombre': p.plato.nombre, 'cantidad': p.cantidad, 'subtotal': p.subtotal} for p in r.pedidos]
    return jsonify({
        'reserva': {'id': r.id, 'fecha': r.fecha, 'hora': r.hora, 'personas': r.personas, 'estado': r.estado, 'total': r.total},
        'cliente': {'id': cliente.id, 'nombre': cliente.nombre, 'dni': cliente.dni},
        'mesa': {'numero': mesa.numero, 'ubicacion': mesa.ubicacion},
        'pedidos': pedidos
    })

# ---------------------------- DASHBOARD STATS ---------------------------------
@app.route('/dashboard/stats', methods=['GET'])
def dashboard_stats():
    pendientes = Reserva.query.filter_by(estado='Pendiente').count()
    platos = Plato.query.count()
    mesas = Mesa.query.count()
    return jsonify({'reservas_pendientes': pendientes, 'platos': platos, 'mesas': mesas})

if __name__ == '__main__':
    app.run(debug=True)
