import { useState, useMemo, useEffect, useRef } from 'react'
import Plotly from 'plotly.js-dist-min'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    a1: -2,
    a2: -3,
    b1: 100,
    b2: 120,
    c: -2,
    area_max: 100
  })

  const [resultado, setResultado] = useState(null)
  const [erro, setErro] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const plotRef = useRef(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro(null)
    setLoading(true)
    
    try {
      const response = await fetch('http://localhost:8000/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Falha na comunicação com a API')

      const data = await response.json()
      setResultado(data)
    } catch (err) {
      setErro('Erro ao calcular. Verifique se o back-end está ativo na porta 8000.')
    } finally {
      setLoading(false)
    }
  }

  // GERADOR DA MATRIZ 3D
  const surfaceData = useMemo(() => {
    if (!resultado) return null;
    
    const { a1, a2, b1, b2, c, area_max } = formData;
    const xValues = [];
    const yValues = [];
    const zValues = [];

    const step = Math.max(1, area_max / 20); 

    for (let i = 0; i <= area_max; i += step) {
      xValues.push(i);
      yValues.push(i);
    }

    for (let y of yValues) {
      const zRow = [];
      for (let x of xValues) {
        const z = (a1 * Math.pow(x, 2)) + (a2 * Math.pow(y, 2)) + (b1 * x) + (b2 * y) + (c * x * y);
        zRow.push(z);
      }
      zValues.push(zRow);
    }

    return { x: xValues, y: yValues, z: zValues };
  }, [resultado, formData]);

  // RENDERIZAÇÃO DO PLOTLY
  useEffect(() => {
    if (surfaceData && plotRef.current) {
      const data = [{
        z: surfaceData.z,
        x: surfaceData.x,
        y: surfaceData.y,
        type: 'surface',
        colorscale: 'Portland',
        colorbar: { title: 'Lucro (R$)', tickfont: { color: 'white' }, titlefont: { color: 'white' } }
      }];

      const layout = {
        autosize: true,
        height: 400,
        margin: { l: 0, r: 0, b: 0, t: 30 },
        paper_bgcolor: 'rgba(0,0,0,0)', 
        plot_bgcolor: 'rgba(0,0,0,0)',
        scene: {
          xaxis: { title: 'Açaí (ha)', titlefont: { color: 'white' }, tickfont: { color: '#94a3b8' }, gridcolor: '#334155' },
          yaxis: { title: 'Cacau (ha)', titlefont: { color: 'white' }, tickfont: { color: '#94a3b8' }, gridcolor: '#334155' },
          zaxis: { title: 'Lucro', titlefont: { color: 'white' }, tickfont: { color: '#94a3b8' }, gridcolor: '#334155' },
          camera: { eye: { x: 1.5, y: 1.5, z: 0.8 } }
        }
      };

      const config = { displayModeBar: false, responsive: true };

      Plotly.newPlot(plotRef.current, data, layout, config);
    }
  }, [surfaceData]);

  // Variáveis Dinâmicas
  const isLoss = resultado && resultado.lucro_maximo < 0;
  const profitColor = isLoss ? '#ff4757' : 'var(--cacau-green)';
  const profitBg = isLoss ? 'rgba(255, 71, 87, 0.1)' : 'rgba(32, 191, 107, 0.1)';
  const profitBorder = isLoss ? 'rgba(255, 71, 87, 0.2)' : 'rgba(32, 191, 107, 0.2)';
  const profitLabel = isLoss ? 'Prejuízo Projetado' : 'Lucro Máximo Projetado';

  return (
    <div className="app-container">
      <header className="header">
        <h1>Otimizador de Plantio</h1>
        <p>Inteligência de alocação para safras de Açaí & Cacau</p>
      </header>

      <main className="grid-container">
        {/* COLUNA ESQUERDA - FORMULÁRIO */}
        <section className="glass-card">
          <h3>⚙️ Parâmetros da Safra</h3>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Área Total Disponível (ha)</label>
              <input type="number" name="area_max" value={formData.area_max} onChange={handleChange} required />
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label>Preço Base: Açaí (b1)</label>
                <input type="number" name="b1" value={formData.b1} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Preço Base: Cacau (b2)</label>
                <input type="number" name="b2" value={formData.b2} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>Retorno Decrescente: Açaí (a1) <span style={{fontSize: '0.7rem', color: '#ff4757'}}>(Use negativos)</span></label>
                <input type="number" name="a1" value={formData.a1} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Retorno Decrescente: Cacau (a2) <span style={{fontSize: '0.7rem', color: '#ff4757'}}>(Use negativos)</span></label>
                <input type="number" name="a2" value={formData.a2} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label>Fator de Competição entre culturas (c)</label>
              <input type="number" name="c" value={formData.c} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Calculando Matriz...' : 'Otimizar Alocação'}
            </button>
          </form>
          {erro && <p style={{ color: '#ff7675', marginTop: '15px', fontSize: '0.9rem' }}>{erro}</p>}
        </section>

        {/* COLUNA DIREITA - RESULTADO E GRÁFICO */}
        <section className="glass-card" style={{ paddingBottom: '30px' }}>
          <h3>📊 Recomendação do Sistema</h3>
          
          {resultado ? (
            <div style={{ animation: 'fadeIn 0.5s ease', display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {!resultado.dentro_restricao && (
                <div style={{
                  backgroundColor: 'rgba(255, 165, 2, 0.15)',
                  border: '1px solid rgba(255, 165, 2, 0.3)',
                  borderLeft: '5px solid #ffa502',
                  padding: '15px 20px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  color: '#dfe4ea',
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}>
                  <strong style={{color: '#ffa502', display: 'block', marginBottom: '5px'}}>⚠️ Ponto Ótimo Irreal</strong>
                  A matemática encontrou um ponto ótimo, mas ele é fisicamente impossível (exige hectares negativos ou ultrapassa a área total da fazenda). Revise os parâmetros.
                </div>
              )}

              <p className="result-highlight" style={{ marginBottom: '20px' }}>
                A configuração ideal calculada é alocar <strong>{resultado.x_otimo} ha</strong> para o Açaí e <strong>{resultado.y_otimo} ha</strong> para o Cacau.
              </p>
              
              <div className="profit-box" style={{ 
                background: `linear-gradient(135deg, ${profitBg}, rgba(0, 0, 0, 0))`,
                borderColor: profitBorder,
                borderLeftColor: profitColor,
                marginBottom: '25px'
              }}>
                <p style={{ color: profitColor }}>{profitLabel}</p>
                <h2 style={{ color: isLoss ? '#ff4757' : 'white' }}>R$ {resultado.lucro_maximo}</h2>
              </div>

              {/* NOVA SECÇÃO: ANÁLISE DE SENSIBILIDADE */}
              {resultado.sensibilidade && resultado.sensibilidade.length > 0 && (
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', marginBottom: '15px', fontWeight: '600' }}>
                    📈 Impacto de Flutuações de Preço (±10%)
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    {resultado.sensibilidade.map((item, index) => (
                      <div key={index} style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        padding: '15px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>{item.cenario}</span>
                          <span style={{
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            backgroundColor: item.diferenca_lucro > 0 ? 'rgba(32, 191, 107, 0.15)' : 'rgba(255, 71, 87, 0.15)',
                            color: item.diferenca_lucro > 0 ? 'var(--cacau-green)' : '#ff4757'
                          }}>
                            {item.diferenca_lucro > 0 ? '+' : ''}R$ {item.diferenca_lucro}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          Ajustar plantio para:<br/>
                          <strong>{item.novo_x} ha</strong> Açaí | <strong>{item.novo_y} ha</strong> Cacau
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <details style={{ marginBottom: '20px' }}>
                <summary>
                  Como obtivemos este resultado?
                  <span>▼</span>
                </summary>
                <div className="math-content">
                  <p><strong>Vetor Gradiente (∇f = 0):</strong></p>
                  <p>∂f/∂x: {resultado.equacoes.df_dx} = 0</p>
                  <p>∂f/∂y: {resultado.equacoes.df_dy} = 0</p>
                  <br/>
                  <p><strong>Critério da Hessiana:</strong></p>
                  <p>O algoritmo classificou o ponto como de <strong>{resultado.tipo_ponto}</strong>.</p>
                  <p>Det(H): {resultado.det_hessiana} {resultado.det_hessiana > 0 ? '>' : '<'} 0</p>
                  <p>H11: {resultado.h11} {resultado.h11 < 0 ? '<' : '>'} 0</p>
                </div>
              </details>

              {/* GRÁFICO 3D PLOTLY NATIVO */}
              <div style={{ marginTop: 'auto', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                <div style={{ padding: '15px', backgroundColor: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--glass-border)', textAlign: 'center' }}>
                  <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: '600' }}>Superfície de Lucro Tridimensional</h4>
                </div>
                <div ref={plotRef} style={{ width: '100%', height: '400px' }} />
              </div>

            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <p>O painel de resultados e o modelo 3D aparecerão aqui após o processamento.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App