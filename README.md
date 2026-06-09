# acai-cacau-optimizer

## 📄 Sobre o Projeto
O **acai-cacau-optimizer** é um sistema computacional full-stack desenvolvido como projeto prático para a disciplina de **Resolução de Problemas Multivariáveis (Cálculo II)** do curso de Ciência da Computação no **Centro Universitário do Pará**, sob a orientação do **Prof. Pedro Girotto**.

O projeto adota a metodologia de Aprendizagem Baseada em Problemas (PBL) para solucionar um desafio agrícola real da Região Amazônica: a alocação ótima de terras para o cultivo combinado de **Açaí** e **Cacau** no Estado do Pará. O sistema utiliza modelagem matemática não-linear baseada em funções quadráticas de várias variáveis, cálculo algébrico computacional de derivadas parciais, vetor gradiente e classificação de pontos críticos via matriz Hessiana.

## 👤 Persona e Contexto Real
O usuário-alvo da aplicação é **Antônio Sousa**, 47 anos, produtor rural do município de Cametá (PA). Antônio gerencia uma propriedade de 100 hectares às margens do rio Tocantins e divide sua produção tradicionalmente de forma intuitiva ("no olho"), sem embasamento quantitativo. 

O sistema traduz equações matemáticas complexas em decisões de negócios acionáveis em menos de 5 minutos, permitindo que Antônio informe os parâmetros atuais de mercado (preços e custos sazonais) e visualize imediatamente a distribuição exata de hectares que maximizará seu lucro e evitará desperdícios em faixas de retornos marginais decrescentes.

## 🚀 Funcionalidades Principais
* **Motor de Cálculo Simbólico (SymPy):** Computação analítica exata do vetor gradiente (∇f = 0) para localização de pontos críticos de máximo lucro.
* **Classificação Formal pela Hessiana:** Verificação rigorosa do determinante da matriz Hessiana (H₁₁ e det(H)) para validação do ponto de máximo global.
* **Visualização Tridimensional Interativa:** Gráfico de superfície 3D dinâmico gerado nativamente via Plotly.js para exploração intuitiva da parábola de lucros e prejuízos.
* **Análise de Sensibilidade Automatizada:** Simulação instantânea de cenários mercadológicos com oscilações de ±10% nos preços base, indicando os novos ajustes ótimos de hectares.
* **Validação de Restrições Físicas e Financeiras:** Alertas visuais adaptativos em tempo real para pontos críticos irreais (hectares negativos ou que extrapolam a área total) e tratamento visual distinto para prejuízos (cenários de perda).

## 💻 Tecnologias Utilizadas
* **Back-end:** Python 3, FastAPI, SymPy (Cálculo Simbólico) e Pydantic.
* **Front-end:** React (Vite), CSS3 Moderno (Glassmorphic Dark Esthetic) e Plotly.js (via referências DOM nativas).

## 📁 Estrutura do Repositório
~~~text
acai-cacau-optimizer/
├── backend/
│   ├── main.py          # Servidor FastAPI e rotas de API
│   ├── optimizer.py     # Lógica matemática (SymPy, Gradiente, Hessiana, Sensibilidade)
│   └── requirements.txt # Dependências do ecossistema Python
├── frontend/
│   ├── src/
│   │   ├── App.jsx      # Componente principal e controle de estado React
│   │   ├── App.css      # Folha de estilo Glassmorphism Premium Fullscreen
│   │   └── main.jsx     # Ponto de entrada do ecossistema Vite
│   └── package.json     # Gerenciador de pacotes Node.js
├── LICENSE              # Licença do projeto
└── README.md            # Documentação técnica do repositório
~~~

## 🔧 Instalação e Execução (Passo a Passo)

### Pré-requisitos
* Python 3.10 ou superior instalado.
* Node.js v18 ou superior e npm instalados.

### 1. Configurando e Rodando o Back-end (FastAPI)
Abra o seu terminal, navegue até o diretório do back-end e crie o ambiente virtual:
~~~bash
cd backend
python -m venv venv
~~~

Ative o ambiente virtual:
* **Windows (PowerShell):**
  ~~~powershell
  .\venv\Scripts\activate
  ~~~
* **Linux / macOS:**
  ~~~bash
  source venv/bin/activate
  ~~~

Instale todas as dependências exigidas:
~~~bash
pip install -r requirements.txt
~~~

Inicie o servidor uvicorn de desenvolvimento local:
~~~bash
uvicorn main:app --reload
~~~
O servidor back-end subirá na porta padrão: `http://localhost:8000`. Você pode auditar a API e os esquemas JSON diretamente em `http://localhost:8000/docs`.

### 2. Configurando e Rodando o Front-end (React + Vite)
Abra um **novo terminal** a partir do diretório raiz do projeto e acesse a pasta do front-end:
~~~bash
cd frontend
~~~

Instale as dependências padrão do ecossistema Node e a biblioteca gráfica nativa:
~~~bash
npm install
npm install plotly.js-dist-min
~~~

Inicie a aplicação do cliente em modo de hot reload:
~~~bash
npm run dev
~~~
O front-end estará disponível no endereço: `http://localhost:5173`.

## 📊 Exemplo de Uso (Parâmetros da Rubrica)
Para testar o modelo matemático padrão da **Opção 1** validado em sala de aula, insira os seguintes coeficientes no formulário do sistema:
* **Área Total Disponível:** `100`
* **Preço Base Açaí (b1):** `100`
* **Preço Base Cacau (b2):** `120`
* **Retorno Decrescente Açaí (a1):** `-2`
* **Retorno Decrescente Cacau (a2):** `-3`
* **Fator de Competição (c):** `-2`

**Resultado Esperado:** O sistema gerará a recomendação de alocar perfeitamente **18.0 ha** para Açaí e **14.0 ha** para Cacau, projetando um lucro ótimo de **R$ 1740.0**. O painel matemático detalhará as derivadas parciais nulas e confirmará o ponto de máximo local estável pela Hessiana positiva (det(H) = 20.0 > 0, H₁₁ = -4.0 < 0).

## 🧠 Declaração de Uso de Inteligência Artificial
Em conformidade com as regras estabelecidas nas considerações finais do edital do projeto, declara-se que ferramentas de IA generativa utilizada foi o modelo Gemini da Google e foram aplicadas conscientemente durante o desenvolvimento. O uso restringiu-se ao auxílio no scaffolding estrutural do front-end React, refinamento de propriedades CSS modernas de Glassmorphism para adequação de tela inteira simétrica e acoplamento seguro entre o cálculo computacional do SymPy e os contratos de dados JSON validados pelo Pydantic/FastAPI. Além disso, foi utilizado o gamma para a apresentação de slides.

## ⚖️ Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.