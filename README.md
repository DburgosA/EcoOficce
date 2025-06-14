# EcoOficce

EcoOficce es una herramienta web para analizar y optimizar el consumo de energía en oficinas. Permite visualizar dashboards en tiempo real, gestionar dispositivos IoT, analizar históricos de consumo, configurar alertas y exportar datos, todo desde una interfaz amigable para administradores.

## Características principales

- Dashboard en tiempo real con gráficos del consumo por área/dispositivo.
- Historial de consumo por día, semana, mes y comparativas.
- Alertas configurables por consumo anómalo o fuera de horario.
- Integración IoT con sensores conectados a microcontroladores ESP32 (simulados).
- Gestión de dispositivos/sensores (alta, baja y configuración).
- Exportación de datos en formatos CSV/PDF.
- Análisis automático con sugerencias para ahorro energético.
- Autenticación de usuarios administradores.

## Requisitos previos

- Python 3.8 o superior
- Node.js y npm
- MongoDB Atlas (o local)
- (Opcional) Arduino IDE o PlatformIO para IoT

## Instrucciones para iniciar el proyecto localmente

### 1. Clona el repositorio y entra a la carpeta del proyecto

```bash
git clone https://github.com/tuusuario/EcoOficce.git
cd EcoOficce
```

### 2. Iniciar backend con Flask

```bash
cd backend
venv\Scripts\activate  # En Windows
# source venv/bin/activate  # En Linux/Mac
python app.py
```
> El backend se ejecutará en `http://localhost:5000`.  
> Asegúrate de tener configurada tu conexión a MongoDB en `app.py`.

### 3. Iniciar frontend con React

```bash
cd ../frontend
npm install
npm start
```
> El frontend se ejecutará en `http://localhost:3000`.

### 4. IoT con ESP32 (opcional)

 - Instala [Arduino IDE](https://www.arduino.cc/en/software) o [PlatformIO](https://# platformio.org/).
 - Instala el soporte para ESP32 en el IDE.
 - Crea tu código en la carpeta `iot`:
 ```bash
 cd ..
 mkdir iot
 ```
 - Ejemplo de archivo principal: `iot/main.ino`


## Notas

- Si el backend no está corriendo, las funciones de inicio de sesión y registro no funcionarán.
- probar la app en modo local accediendo a `http://localhost:3000` en tu navegador.
- Para desarrollo, puedes usar el enlace directo al menú desde la pantalla de login si el backend no está disponible.