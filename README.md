# acai-cacau-optimizer

## 📄 Descrição do Projeto

[cite_start]O **acai-cacau-optimizer** é um sistema computacional full-stack desenvolvido como parte do Projeto de Otimização da disciplina de Resolução de Problemas Multivariáveis (Cálculo II)[cite: 1]. [cite_start]O projeto adota a metodologia de Aprendizagem Baseada em Problemas (PBL) para integrar conceitos matemáticos avançados ao desenvolvimento de software[cite: 1].

[cite_start]O objetivo principal é solucionar um problema real de planejamento agrícola na região do Pará: a alocação ideal de terras para o cultivo combinado de açaí e cacau. [cite_start]A modelagem utiliza uma função objetivo não-linear (quadrática) de duas variáveis para representar o lucro total da operação, considerando fatores críticos como a competição por recursos e retornos marginais decrescentes.

A partir da modelagem analítica, o sistema automatiza o cálculo de:
* [cite_start]**Derivadas parciais e vetor gradiente ($\nabla f = 0$):** para a localização exata do ponto crítico de máximo lucro[cite: 1, 2].
* [cite_start]**Matriz Hessiana:** para a classificação formal do ponto crítico como um ponto de máximo global dentro do domínio de restrição da propriedade[cite: 1, 2].

### 👤 Contexto e Persona
[cite_start]A aplicação foi projetada para apoiar a tomada de decisão de produtores rurais locais (representados pela persona *Antônio Sousa*, do município de Cametá-PA). [cite_start]O sistema elimina a necessidade de conhecimento matemático avançado por parte do usuário final, transformando parâmetros de mercado (como variação de preços e custos sazonais) em recomendações visuais e acionáveis de alocação de hectares[cite: 1, 2].

### 💻 Tecnologias Utilizadas
* [cite_start]**Back-end:** Python (FastAPI), SymPy (para resolução algébrica e cálculo simbólico) e NumPy.
* [cite_start]**Front-end:** React (Vite), Tailwind CSS e Plotly.js / Chart.js (para visualização gráfica bidimensional ou tridimensional da superfície de lucro).
