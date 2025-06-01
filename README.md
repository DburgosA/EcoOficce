# EcoOficce
Herramienta para analizar y optimizar el consumo de energía en oficinas

## Instrucciones para iniciar el proyecto

### 1. Crear estructura de carpetas
```bash
mkdir backend frontend
```

### 2. Iniciar backend con Flask
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # En Windows
# source venv/bin/activate  # En Linux/Mac
pip install flask
echo > app.py
```

### 3. Iniciar frontend con React
```bash
cd ../frontend
npx create-react-app .
```

### 4. IoT con ESP32
- Instala [Arduino IDE](https://www.arduino.cc/en/software) o [PlatformIO](https://platformio.org/).
- Instala el soporte para ESP32 en el IDE.
- Crea tu código en la carpeta `iot` (puedes crearla si lo deseas):
```bash
cd ..
mkdir iot
```
- Ejemplo de archivo principal: `iot/main.ino`

### 5. Estructura recomendada
```
EcoOficce/
│
├── backend/    # Código Flask
├── frontend/   # Código React
└── iot/        # Código para ESP32
```
