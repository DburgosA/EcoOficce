from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from pymongo import MongoClient
from flask_cors import CORS
import gridfs
from werkzeug.security import generate_password_hash, check_password_hash
from bson.son import SON

app = Flask(__name__)

# Configuración de Flask-JWT-Extended
app.config['JWT_SECRET_KEY'] = 'supersecretjwtkey'  # Cambia esto en producción
jwt = JWTManager(app)

# Habilita CORS
CORS(app, supports_credentials=True)

# Conexión a MongoDB Atlas (Cluster)
client = MongoClient('mongodb+srv://dburgos2016:Fc9ymrxWfQi36wH4@ecooficcebd.qdzijiq.mongodb.net/?retryWrites=true&w=majority')
db = client['APP']
users_collection = db['usuarios']
cuentas_admin = db['cuentas_admin']
fs = gridfs.GridFS(db)
# Colección para consumos energéticos
consumos_collection = db['consumos']

@app.route('/')
def home():
    return "Flask app is running"

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    nombre_usuario = data.get('nombre_usuario')
    password = data.get('contraseña')
    correo = data.get('correo')
    rol = data.get('rol', 'usuario')  # por defecto 'usuario'

    if not nombre_usuario or not password or not correo or not rol:
        return jsonify({"error": "Todos los campos son requeridos"}), 400

    if users_collection.find_one({"nombre_usuario": nombre_usuario}):
        return jsonify({"error": "El nombre de usuario ya existe"}), 409

    hashed_password = generate_password_hash(password)
    user = {
        "nombre_usuario": nombre_usuario,
        "password": hashed_password,
        "correo": correo,
        "rol": rol
    }
    users_collection.insert_one(user)
    return jsonify({"message": "Usuario registrado exitosamente"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    nombre_usuario = data.get('nombre_usuario')
    password = data.get('contraseña')

    if not nombre_usuario or not password:
        return jsonify({"error": "Nombre de usuario y contraseña son requeridos"}), 400

    user_data = users_collection.find_one({"nombre_usuario": nombre_usuario})
    if user_data and check_password_hash(user_data["password"], password):
        access_token = create_access_token(identity={
            "nombre_usuario": user_data["nombre_usuario"],
            "rol": user_data["rol"]
        })
        return jsonify({
            "message": "Inicio de sesión exitoso",
            "access_token": access_token,
            "rol": user_data["rol"]
        }), 200
    else:
        return jsonify({"error": "Nombre de usuario o contraseña incorrectos"}), 401

@app.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({"message": "Has cerrado sesión con éxito."}), 200

@app.route('/api/consumo', methods=['POST'])
def recibir_consumo():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No se recibieron datos"}), 400
    if isinstance(data, list):
        consumos_collection.insert_many(data)
        return jsonify({"message": f"{len(data)} datos recibidos correctamente"}), 201
    else:
        consumos_collection.insert_one(data)
        return jsonify({"message": "Dato recibido correctamente"}), 201

@app.route('/api/consumos', methods=['GET'])
def obtener_consumos():
    datos = list(consumos_collection.find().sort('_id', -1).limit(30))
    for d in datos:
        d['_id'] = str(d['_id'])  # Convierte ObjectId a string para JSON
    return jsonify(datos), 200

@app.route('/api/consumo-diario', methods=['GET'])
def consumo_diario():
    pipeline = [
        {"$addFields": {"fecha": {"$substr": ["$timestamp", 0, 10]}}},
        {"$sort": SON([("device_id", 1), ("fecha", 1), ("timestamp", 1)])},
        {"$group": {
            "_id": {"device_id": "$device_id", "fecha": "$fecha"},
            "primero": {"$first": "$energy"},
            "ultimo": {"$last": "$energy"}
        }},
        {"$project": {
            "fecha": "$_id.fecha",
            "consumo": {"$subtract": ["$ultimo", "$primero"]}
        }},
        {"$group": {
            "_id": "$fecha",
            "consumo_total": {"$sum": "$consumo"}
        }},
        {"$sort": SON([("_id", 1)])}
    ]
    resultados = list(consumos_collection.aggregate(pipeline))
    data = [{"fecha": r["_id"], "consumo_total": round(r["consumo_total"], 2)} for r in resultados]
    return jsonify(data), 200

@app.route('/api/consumo-mensual', methods=['GET'])
def consumo_mensual():
    pipeline = [
        {"$addFields": {"mes": {"$substr": ["$timestamp", 0, 7]}}},  # yyyy-mm
        {"$sort": SON([("device_id", 1), ("mes", 1), ("timestamp", 1)])},
        {"$group": {
            "_id": {"device_id": "$device_id", "mes": "$mes"},
            "primero": {"$first": "$energy"},
            "ultimo": {"$last": "$energy"}
        }},
        {"$project": {
            "mes": "$_id.mes",
            "consumo": {"$subtract": ["$ultimo", "$primero"]}
        }},
        {"$group": {
            "_id": "$mes",
            "consumo_total": {"$sum": "$consumo"}
        }},
        {"$sort": SON([("_id", 1)])}
    ]
    resultados = list(consumos_collection.aggregate(pipeline))
    data = [{"mes": r["_id"], "consumo_total": round(r["consumo_total"], 2)} for r in resultados]
    return jsonify(data), 200

@app.route('/api/consumo-semanal', methods=['GET'])
def consumo_semanal():
    pipeline = [
        {"$addFields": {
            "semana": {"$dateToString": {"format": "%G-%V", "date": {"$dateFromString": {"dateString": "$timestamp"}}}}
        }},
        {"$sort": SON([("device_id", 1), ("semana", 1), ("timestamp", 1)])},
        {"$group": {
            "_id": {"device_id": "$device_id", "semana": "$semana"},
            "primero": {"$first": "$energy"},
            "ultimo": {"$last": "$energy"}
        }},
        {"$project": {
            "semana": "$_id.semana",
            "consumo": {"$subtract": ["$ultimo", "$primero"]}
        }},
        {"$group": {
            "_id": "$semana",
            "consumo_total": {"$sum": "$consumo"}
        }},
        {"$sort": SON([("_id", 1)])}
    ]
    resultados = list(consumos_collection.aggregate(pipeline))
    data = [{"semana": r["_id"], "consumo_total": round(r["consumo_total"], 2)} for r in resultados]
    return jsonify(data), 200

@app.route('/api/consumo-horario', methods=['GET'])
def consumo_horario():
    fecha = request.args.get('fecha')
    if not fecha:
        return jsonify({'error': 'Debe proporcionar el parámetro fecha (YYYY-MM-DD)'}), 400
    pipeline = [
        {"$match": {"timestamp": {"$regex": f"^{fecha}"}}},
        {"$addFields": {"hora": {"$substr": ["$timestamp", 11, 2]}}},
        {"$sort": SON([("device_id", 1), ("hora", 1), ("timestamp", 1)])},
        {"$group": {
            "_id": {"device_id": "$device_id", "hora": "$hora"},
            "primero": {"$first": "$energy"},
            "ultimo": {"$last": "$energy"}
        }},
        {"$project": {
            "hora": "$_id.hora",
            "consumo": {"$subtract": ["$ultimo", "$primero"]}
        }},
        {"$group": {
            "_id": "$hora",
            "consumo_total": {"$sum": "$consumo"}
        }},
        {"$addFields": {"hora_int": {"$toInt": "$_id"}}},
        {"$sort": SON([("hora_int", 1)])}
    ]
    resultados = list(consumos_collection.aggregate(pipeline))
    # Asegurar que todas las horas estén presentes (0-23)
    horas = {str(h).zfill(2): 0.0 for h in range(24)}
    for r in resultados:
        horas[r['_id']] = round(r['consumo_total'], 3)
    data = [{"hora": h, "consumo_total": horas[h]} for h in sorted(horas.keys())]
    return jsonify(data), 200

if __name__ == '__main__':
    app.run(debug=True)
