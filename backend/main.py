from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from optimizer import optimize_production

app = FastAPI(title="Açaí & Cacau Optimizer API")

# Configuração de CORS para liberar o tráfego entre o front (5173) e o back (8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, você travaria isso para a URL do front-end
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Definindo o contrato de dados de entrada que a API espera receber (e validar)
class OptimizationRequest(BaseModel):
    a1: float
    a2: float
    b1: float
    b2: float
    c: float
    area_max: float

@app.get("/")
def read_root():
    return {"status": "ok", "mensagem": "API de Otimização Operante!"}

# O endpoint que o front-end vai consumir
@app.post("/optimize")
def optimize(data: OptimizationRequest):
    # Repassando os parâmetros do JSON para a função matemática
    resultado = optimize_production(
        coef_x2=data.a1,
        coef_y2=data.a2,
        coef_x=data.b1,
        coef_y=data.b2,
        coef_xy=data.c,
        max_area=data.area_max
    )
    return resultado