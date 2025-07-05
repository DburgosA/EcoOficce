import requests
import random
from datetime import datetime, timedelta

BACKEND_URL = "http://localhost:5000/api/consumo"
VOLTAGE = 120.0
FREQUENCY = 60

DISPOSITIVOS = [
    *[{"device_id": f"oficina_{i+1}", "tipo": "zona_oficina", "reposo": (20, 40), "funcionamiento": (120, 250)} for i in range(10)],
    *[{"device_id": f"multifuncional_{i+1}", "tipo": "multifuncional_", "reposo": (150, 160), "funcionamiento": (1700, 1850)} for i in range(4)],
    *[{"device_id": f"impresora_{i+1}", "tipo": "impresora_", "reposo": (5, 7), "funcionamiento": (35, 45)} for i in range(8)],
    *[{"device_id": f"router_{i+1}", "tipo": "router", "reposo": (7, 7), "funcionamiento": (7, 7)} for i in range(3)],
    {"device_id": "servidor", "tipo": "servidor", "reposo": (100, 120), "funcionamiento": (250, 270)},
    *[{"device_id": f"purificador_{i+1}", "tipo": "purificador_aire", "reposo": (20, 25), "funcionamiento": (90, 110)} for i in range(2)],
    *[{"device_id": f"calefactor_{i+1}", "tipo": "calefactor", "reposo": (0, 0), "funcionamiento": (1400, 1550)} for i in range(2)],
    *[{"device_id": f"dispensador_agua_{i+1}", "tipo": "dispensador_agua", "reposo": (80, 90), "funcionamiento": (380, 420)} for i in range(2)],
]

ENERGY_ACC = {d["device_id"]: random.uniform(0.5, 2.5) for d in DISPOSITIVOS}
for idx, d in enumerate(DISPOSITIVOS):
    d["unique_id"] = f"{idx+1:03d}"

SIM_START = datetime(2025, 6, 2, 0, 0, 0)
sim_time = SIM_START
SIM_STEP = timedelta(hours=1)
PCS_ON = {d["device_id"]: False for d in DISPOSITIVOS if d["tipo"] == "zona_oficina"}

def es_horario_laboral(dt):
    return dt.weekday() < 5 and 8 <= dt.hour < 18

def es_manana_fria(dt):
    return 7 <= dt.hour < 11 and dt.month in [3, 4, 5, 6]

def simular_dispositivo(d, dt):
    tipo = d["tipo"]
    if tipo == "zona_oficina":
        if es_horario_laboral(dt):
            if dt.weekday() == 0 and dt.hour == 8:
                PCS_ON[d["device_id"]] = False
            if PCS_ON[d["device_id"]] and dt.hour == 8:
                PCS_ON[d["device_id"]] = False
            PCS_ON[d["device_id"]] = PCS_ON[d["device_id"]] or random.random() < 0.8
        else:
            if dt.weekday() == 4 and dt.hour == 18:
                PCS_ON[d["device_id"]] = random.random() < 0.3
            if not (dt.hour >= 18 or dt.hour < 8):
                PCS_ON[d["device_id"]] = False
        en_funcionamiento = PCS_ON[d["device_id"]]
    elif tipo.startswith("impresora") or tipo.startswith("multifuncional"):
        en_funcionamiento = es_horario_laboral(dt) and random.random() < (0.1 if "grande" in tipo or "multifuncional" in tipo else 0.05)
    elif tipo in ["router", "servidor"]:
        en_funcionamiento = True
    elif tipo in ["purificador_aire", "dispensador_agua"]:
        en_funcionamiento = es_horario_laboral(dt) and random.random() < 0.5
    elif tipo == "calefactor":
        en_funcionamiento = es_manana_fria(dt) and random.random() < 0.8
    else:
        en_funcionamiento = False
    power = round(random.uniform(*d["funcionamiento"]), 1) if en_funcionamiento else round(random.uniform(*d["reposo"]), 1)
    status = "active" if en_funcionamiento else ("idle" if power > 0 else "off")
    ENERGY_ACC[d["device_id"]] += power / 1000
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
    dias_a_simular = 31
    ciclos = dias_a_simular * 24
    for _ in range(ciclos):
        payloads = [simular_dispositivo(d, sim_time) for d in DISPOSITIVOS]
        try:
            response = requests.post(BACKEND_URL, json=payloads)
            print(f"{sim_time.isoformat()} | Enviados {len(payloads)} dispositivos | Respuesta: {response.status_code}")
        except Exception as e:
            print(f"Error al enviar datos del ciclo {sim_time.isoformat()}: {e}")
        sim_time += SIM_STEP