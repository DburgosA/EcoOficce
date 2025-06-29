import requests
import random
import time
from datetime import datetime, timedelta

BACKEND_URL = "http://localhost:5000/api/consumo"  # Cambia esto según tu endpoint real
VOLTAGE = 120.0
FREQUENCY = 60

# Configuración de dispositivos
DISPOSITIVOS = [
    # 10 zonas de oficina (PC + monitor)
    *[
        {
            "device_id": f"oficina_{i+1}",
            "tipo": "zona_oficina",
            "reposo": (20, 40),  # W
            "funcionamiento": (120, 250),  # W
        } for i in range(10)
    ],
    # 4 impresoras multifuncionales grandes
    *[
        {
            "device_id": f"multifuncional_{i+1}",
            "tipo": "multifuncional_",
            "reposo": (150, 160),
            "funcionamiento": (1700, 1850),
        } for i in range(4)
    ],
    # 8 impresoras pequeñas
    *[
        {
            "device_id": f"impresora_{i+1}",
            "tipo": "impresora_",
            "reposo": (5, 7),
            "funcionamiento": (35, 45),
        } for i in range(8)
    ],
    # 3 routers
    *[
        {
            "device_id": f"router_{i+1}",
            "tipo": "router",
            "reposo": (7, 7),
            "funcionamiento": (7, 7),
        } for i in range(3)
    ],
    # 1 servidor
    {
        "device_id": "servidor",
        "tipo": "servidor",
        "reposo": (100, 120),
        "funcionamiento": (250, 270),
    },
    # 2 purificadores de aire
    *[
        {
            "device_id": f"purificador_{i+1}",
            "tipo": "purificador_aire",
            "reposo": (20, 25),
            "funcionamiento": (90, 110),
        } for i in range(2)
    ],
    # 2 calefactores
    *[
        {
            "device_id": f"calefactor_{i+1}",
            "tipo": "calefactor",
            "reposo": (0, 0),
            "funcionamiento": (1400, 1550),
        } for i in range(2)
    ],
    # 2 dispensadores de agua
    *[
        {
            "device_id": f"dispensador_agua_{i+1}",
            "tipo": "dispensador_agua",
            "reposo": (80, 90),
            "funcionamiento": (380, 420),
        } for i in range(2)
    ],
]

# Estado acumulado de energía por dispositivo
ENERGY_ACC = {d["device_id"]: random.uniform(0.5, 2.5) for d in DISPOSITIVOS}
for idx, d in enumerate(DISPOSITIVOS):
    d["unique_id"] = f"{idx+1:03d}"

# Variables de simulación de tiempo
SIM_START = datetime(2025, 6, 2, 0, 0, 0)  # Lunes, 2 de junio 2025
sim_time = SIM_START
SIM_STEP = timedelta(hours=1)  # Cada ciclo es 1 hora simulada

# Estado de PCs para simular "trabajadores flojos"
PCS_ON = {d["device_id"]: False for d in DISPOSITIVOS if d["tipo"] == "zona_oficina"}

# Helper para saber si es horario laboral
def es_horario_laboral(dt):
    return dt.weekday() < 5 and 8 <= dt.hour < 18

def es_manana_fria(dt):
    return 7 <= dt.hour < 11 and dt.month in [3, 4, 5, 6]  # Otoño

def simular_dispositivo(d, dt):
    tipo = d["tipo"]
    # PCs de oficina
    if tipo == "zona_oficina":
        if es_horario_laboral(dt):
            # Si es lunes a las 8h, todos apagan (reinicio de semana)
            if dt.weekday() == 0 and dt.hour == 8:
                PCS_ON[d["device_id"]] = False
            # Si estaba encendido fuera de horario, se apaga al llegar alguien
            if PCS_ON[d["device_id"]] and dt.hour == 8:
                PCS_ON[d["device_id"]] = False
            # En horario laboral, cada hora hay probabilidad de encenderse si está apagado
            if not PCS_ON[d["device_id"]]:
                PCS_ON[d["device_id"]] = random.random() < 0.8
        else:
            # Si es viernes después de las 18h, decide si queda encendido todo el finde
            if dt.weekday() == 4 and dt.hour == 18:
                PCS_ON[d["device_id"]] = random.random() < 0.3
            # Si es después de las 18h y antes de las 8h, mantiene el estado anterior
            if dt.hour >= 18 or dt.hour < 8:
                pass  # Mantiene el estado anterior
            else:
                PCS_ON[d["device_id"]] = False
        en_funcionamiento = PCS_ON[d["device_id"]]
    # Impresoras
    elif tipo.startswith("impresora") or tipo.startswith("multifuncional"):
        en_funcionamiento = es_horario_laboral(dt) and random.random() < (0.1 if "grande" in tipo or "multifuncional" in tipo else 0.05)
    # Routers y servidor
    elif tipo in ["router", "servidor"]:
        en_funcionamiento = True
    # Purificadores y dispensadores
    elif tipo in ["purificador_aire", "dispensador_agua"]:
        en_funcionamiento = es_horario_laboral(dt) and random.random() < 0.5
    # Calefactores (otoño: mañanas frías)
    elif tipo == "calefactor":
        en_funcionamiento = es_manana_fria(dt) and random.random() < 0.8
    else:
        en_funcionamiento = False
    if en_funcionamiento:
        power = round(random.uniform(*d["funcionamiento"]), 1)
        status = "active"
    else:
        power = round(random.uniform(*d["reposo"]), 1)
        status = "idle" if power > 0 else "off"
    ENERGY_ACC[d["device_id"]] += power / 1000  # kWh por hora
    energy = round(ENERGY_ACC[d["device_id"]], 3)
    current = round(power / VOLTAGE, 2)
    power_factor = round(random.uniform(0.9, 1.0), 2)
    return {
        "device_id": d["device_id"],
        "unique_id": d["unique_id"],
        "tipo": d["tipo"],
        "timestamp": dt.isoformat() + "Z",
        "power": power,
        "energy": energy,
        "voltage": VOLTAGE,
        "current": current,
        "power_factor": power_factor,
        "frequency": FREQUENCY,
        "status": status
    }

if __name__ == "__main__":
    dias_a_simular = 31  # Simula 31 días
    ciclos = dias_a_simular * 24
    for _ in range(ciclos):
        payloads = [simular_dispositivo(d, sim_time) for d in DISPOSITIVOS]
        try:
            response = requests.post(BACKEND_URL, json=payloads)
            print(f"{sim_time.isoformat()} | Enviados {len(payloads)} dispositivos | Respuesta: {response.status_code}")
        except Exception as e:
            print(f"Error al enviar datos del ciclo {sim_time.isoformat()}: {e}")
        sim_time += SIM_STEP
        # Sin sleep para máxima velocidad