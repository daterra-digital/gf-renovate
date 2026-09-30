# RENOVATE - 2ª Sessão do Grupo Focal (ESAS 2026)

Aplicação Web SPA (Single Page Application) responsiva de suporte à **2ª Sessão do Grupo Focal** do projeto europeu **RENOVATE**, organizada pela **DATERRA - Lógica de Terra** em colaboração com a **Escola Superior Agrária de Santarém - Universidade Politécnica de Santarém (ESAS)**, a decorrer a **06 de outubro de 2026**.

A plataforma destina-se a orientar os participantes ao vivo nas dinâmicas de validação pedagógica de ferramentas digitais (**Serious Game da Tallentto** e **Simulador Virtual da Virmedex**), recolha de inquéritos via Google Forms com código de participante persistente, consulta de slides e arquivo histórico.

---

## 🎨 Identidade Visual & Design System

- **Cor Primária:** `#FFCC66` (Amarelo RENOVATE)
- **Fundo:** `#F8FAFC` (Slate 50)
- **Texto e Estrutura:** `#0F172A` (Dark Slate)
- **Biblioteca de Ícones:** [Lucide Icons](https://lucide.dev)
- **Framework CSS:** Tailwind CSS (via CDN)
- **Arquitetura:** Pure Vanilla JavaScript (sem etapa de compilação ou tooling pesado)

### Logótipos (Raiz do Projeto)
Os ficheiros de imagem institucionais estão localizados na raiz da aplicação:
- `logo-renovate.png` — Logótipo oficial do Projeto RENOVATE.
- `logo-daterra.png` — Logótipo oficial da DATERRA - Lógica de Terra.
- `logo-esas.png` — Logótipo oficial da Escola Superior Agrária de Santarém - Universidade Politécnica de Santarém.

---

## 📱 Estrutura da Aplicação (4 Separadores Principais)

1. **Sessão ao Vivo (`#live`):**
   - Registo e atribuição de **Código de Participante** armazenado em `localStorage`.
   - Injeção automática do código nos parâmetros dos Google Forms (prefill).
   - Fluxo interativo em 4 fases com bloqueio/desbloqueio condicional.
   - Acesso direto ao **Serious Game (Tallentto)** e ao **Simulador Virtual (Virmedex)**.
   - Checkboxes de auto-avaliação do progresso de cada participante.

2. **Programa & Slides (`#program`):**
   - Embed responsivo em formato 16:9 da apresentação oficial em Google Slides.
   - Acesso em ecrã inteiro.
   - Tabela cronológica completa do programa oficial com oradores, horários e badges.
   - Suporte a impressão rápida do programa (`window.print()`).

3. **Grupo Focal 1 - Lisboa (`#gf1`):**
   - Histórico e contexto da 1ª sessão realizada em Lisboa a **22 de outubro de 2024**.
   - Métricas chave consolidadas (participantes, entidades, necessidades identificadas).
   - Conclusões do diagnóstico inicial.
   - Ligação direta ao artigo completo no portal DATERRA.

4. **Resultados & Media (`#results`):**
   - Resumo executivo do **Deliverable 1.4** (*Relatório de Requisitos e Validação de Ferramentas Digitais para Formação em Proteção de Culturas*).
   - Hub com embeds do YouTube (demonstrações dos jogos e simulações).
   - Galeria fotográfica documental dos eventos.

5. **Consórcio e Parceiros & Side Note:**
   - Lista completa com ligações aos websites oficiais do **Projeto RENOVATE**, **DATERRA**, **ESAS**, **Tallentto**, **Virmedex**, **UPC**, **UNITO**, **INRAE**, **pcfruit** e **Horta**.
   - Nota lateral de disseminação técnica associada ao **EuroTech Day**.

---

## 🔒 Mecanismo de Desbloqueio do Moderador (Opção C)

A aplicação inclui uma modal de controlo protegida por PIN:
- **PIN de Acesso:** `2026`
- **Funcionalidades do Painel:**
  - Desbloqueio individual de qualquer fase (1 a 4).
  - Botão **"Desbloquear Tudo"** para libertar todas as workstations instantaneamente.
  - Botão **"Repor Padrão"** (reverte para Fase 1 desbloqueada e Fases 2, 3 e 4 bloqueadas).

### Desbloqueio e Configuração via Parâmetros de URL (Overrides)
Para facilitar a dinâmica em auditório (por exemplo, via projeção de QR Code):
- `?unlock=all` — Desbloqueia automaticamente todas as fases para quem abrir o link.
- `?step=2` ou `?fase=3` — Desbloqueia até à fase indicada.
- `?code=P05` — Pré-atribui o código de participante no dispositivo.
- `?tab=program` — Abre diretamente a tab pretendida.

---

## 🚀 Publicação no GitHub Pages & Domínio Personalizado

### Ficheiro CNAME
O repositório já inclui o ficheiro `CNAME` configurado para o subdomínio institucional:
```
gfrenovate.daterra.com.pt
```

### Configuração no GitHub
1. Aceder ao repositório `daterra-digital/gf-renovate` no GitHub.
2. Ir a **Settings** > **Pages**.
3. Em **Build and deployment** > **Source**, selecionar **Deploy from a branch**.
4. Definir branch **`main`** e diretoria **`/ (root)`**.
5. Em **Custom domain**, o GitHub detetará automaticamente `gfrenovate.daterra.com.pt`.
6. Ativar **Enforce HTTPS**.

### Apontamento de DNS na Zona DATERRA (`daterra.com.pt`)
Adicionar a seguinte entrada CNAME no fornecedor de DNS:
- **Tipo:** `CNAME`
- **Nome/Host:** `gfrenovate`
- **Destino/Valor:** `daterra-digital.github.io.`
