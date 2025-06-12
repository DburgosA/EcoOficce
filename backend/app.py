from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from pymongo import MongoClient
from flask_cors import CORS
import gridfs
from werkzeug.security import generate_password_hash, check_password_hash

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

if __name__ == '__main__':
    app.run(debug=True)
