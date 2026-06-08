import sympy as sp

def optimize_production(coef_x2, coef_y2, coef_x, coef_y, coef_xy, max_area):
    # Definindo as variáveis simbólicas
    x, y = sp.symbols('x y')
    
    # Construindo a função objetivo f(x, y)
    f = coef_x2*x**2 + coef_y2*y**2 + coef_x*x + coef_y*y + coef_xy*x*y
    
    # 1. Derivadas Parciais
    df_dx = sp.diff(f, x)
    df_dy = sp.diff(f, y)
    
    # 2. Gradiente = 0 (Resolvendo o sistema de equações)
    # sp.solve retorna uma lista de dicionários com os valores de x e y
    critical_points = sp.solve((df_dx, df_dy), (x, y))
    
    if not critical_points:
        return {"erro": "Nenhum ponto crítico encontrado."}
    
    # Extraindo os valores numéricos do ponto crítico
    x_opt = float(critical_points[x])
    y_opt = float(critical_points[y])
    
    # Verificando a restrição de domínio (área total)
    dentro_restricao = (x_opt + y_opt) <= max_area and x_opt >= 0 and y_opt >= 0
    
    # 3. Calculando o valor ótimo f(x*, y*)
    max_profit = float(f.subs({x: x_opt, y: y_opt}))
    
    # 4. Matriz Hessiana e Classificação
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
        }
    }