import sympy as sp

def solve_system(a1, a2, b1, b2, c):
    """Função auxiliar para resolver o sistema linear rapidamente."""
    x, y = sp.symbols('x y')
    f = a1*x**2 + a2*y**2 + b1*x + b2*y + c*x*y
    df_dx = sp.diff(f, x)
    df_dy = sp.diff(f, y)
    
    critical_points = sp.solve((df_dx, df_dy), (x, y))
    
    if not critical_points:
        return None
        
    return float(critical_points[x]), float(critical_points[y]), f, df_dx, df_dy

def optimize_production(coef_x2, coef_y2, coef_x, coef_y, coef_xy, max_area):
    x, y = sp.symbols('x y')
    
    # --- 1. CENÁRIO BASE ---
    base_solution = solve_system(coef_x2, coef_y2, coef_x, coef_y, coef_xy)
    if not base_solution:
        return {"erro": "Nenhum ponto crítico encontrado no cenário base."}
        
    x_opt, y_opt, f, df_dx, df_dy = base_solution
    max_profit = float(f.subs({x: x_opt, y: y_opt}))
    
    # Verifica restrições físicas
    dentro_restricao = (x_opt + y_opt) <= max_area and x_opt >= 0 and y_opt >= 0
    
    # Matriz Hessiana
    d2f_dx2 = sp.diff(df_dx, x)
    d2f_dy2 = sp.diff(df_dy, y)
    d2f_dxdy = sp.diff(df_dx, y)
    
    det_hessiana = float((d2f_dx2 * d2f_dy2) - (d2f_dxdy**2))
    h11 = float(d2f_dx2)
    
    tipo_ponto = "indefinido"
    if det_hessiana > 0:
        if h11 < 0:
            tipo_ponto = "máximo"
        elif h11 > 0:
            tipo_ponto = "mínimo"
    elif det_hessiana < 0:
        tipo_ponto = "sela"

    # --- 2. ANÁLISE DE SENSIBILIDADE (Bónus Nota Máxima) ---
    # Simulamos o impacto se os preços base (b1 e b2) variarem 10%
    sensibilidade = []
    
    variacoes = [
        ("Açaí +10%", coef_x * 1.10, coef_y),
        ("Açaí -10%", coef_x * 0.90, coef_y),
        ("Cacau +10%", coef_x, coef_y * 1.10),
        ("Cacau -10%", coef_x, coef_y * 0.90)
    ]
    
    for cenario, novo_b1, novo_b2 in variacoes:
        sol = solve_system(coef_x2, coef_y2, novo_b1, novo_b2, coef_xy)
        if sol:
            nx, ny, nf, _, _ = sol
            n_profit = float(nf.subs({x: nx, y: ny}))
            sensibilidade.append({
                "cenario": cenario,
                "novo_x": round(nx, 2),
                "novo_y": round(ny, 2),
                "novo_lucro": round(n_profit, 2),
                "diferenca_lucro": round(n_profit - max_profit, 2)
            })

    return {
        "x_otimo": round(x_opt, 2),
        "y_otimo": round(y_opt, 2),
        "lucro_maximo": round(max_profit, 2),
        "tipo_ponto": tipo_ponto,
        "det_hessiana": det_hessiana,
        "h11": h11,
        "dentro_restricao": dentro_restricao,
        "equacoes": {
            "df_dx": str(df_dx),
            "df_dy": str(df_dy)
        },
        "sensibilidade": sensibilidade
    }