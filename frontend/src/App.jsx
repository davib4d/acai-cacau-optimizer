import { useState } from 'react'
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

  // Variáveis para estilo dinâmico de Lucro vs Prejuízo
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

              {/* Dica para o usuário sobre os valores negativos */}
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

        {/* COLUNA DIREITA - RESULTADO */}
        <section className="glass-card">
          <h3>📊 Recomendação do Sistema</h3>
          
          {resultado ? (
            <div style={{ animation: 'fadeIn 0.5s ease', display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* ALERTA DE RESTRIÇÃO FÍSICA */}
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

              <p className="result-highlight">
                A configuração ideal calculada é alocar <strong>{resultado.x_otimo} ha</strong> para o Açaí e <strong>{resultado.y_otimo} ha</strong> para o Cacau.
              </p>
              
              {/* PAINEL DE LUCRO DINÂMICO */}
              <div className="profit-box" style={{ 
                background: `linear-gradient(135deg, ${profitBg}, rgba(0, 0, 0, 0))`,
                borderColor: profitBorder,
                borderLeftColor: profitColor
              }}>
                <p style={{ color: profitColor }}>{profitLabel}</p>
                <h2 style={{ color: isLoss ? '#ff4757' : 'white' }}>R$ {resultado.lucro_maximo}</h2>
              </div>
              
              <details>
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
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <p>O painel de resultados aparecerá aqui após o processamento matemático.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App