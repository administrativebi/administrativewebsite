
# GEMINI.md - Projeto Administrative: Performance-as-a-Service (PaaS)

## 🎯 Visão do Projeto

Criar um website disruptivo para a **Administrative**, uma empresa que vende **"Estados de Eficiência"** para o setor de Comércio e Serviços (foco inicial: Food Service). O modelo é **PaaS (Performance as a Service)**, transformando consultoria em um sistema operacional vivo e orientado por dados.

## 🚀 Diferenciais Competitivos (Oceano Azul)

* **Não entregamos PDFs:** Entregamos intervenção e melhoria contínua.
* **Tecnologia Própria:** Uso de IA para análise massiva de dados (não para decidir, mas para dar suporte técnico preciso).
* **Foco em Margem:** No setor de serviços, a margem é o oxigênio. Nosso trabalho é vedar os vazamentos.
* **Cultura Científica:** Desenvolvemos processos e pessoas simultaneamente.

---

## 🛠 Stack Tecnológico & Ferramentas

O site deve refletir a integração com estas ferramentas:

* **Dashboards:** Power BI / Google AI Data Studio.
* **Gestão/Documentação:** Notion.
* **Infraestrutura/IA:** Google Antigravity / Gemini CLI / NotebookLLM.
* **Operação:** Appsheet / Google Sheets.
* **Desenvolvimento:** Framework moderno (Next.js/Tailwind) com foco em performance e animações de scroll.

---

## 📐 Estrutura do Website (Sitemap)

### 1. Hero Section (High Tech/Industrial)

* **Copy:** "Pare de gerir por instinto. Comece a operar em Estado de Eficiência."
* **Ação:** Botão de Diagnóstico de Eficiência Imediato.

### 2. A Tabela da Verdade (Inversão de Risco)

* Comparativo: Consultoria Tradicional (PDF/Gaveta) vs. Administrative (PaaS/Intervenção).

### 3. Os 5 Pilares da Performance (Interativos)

* **Financeiro:** BPO, Auditoria, Fluxo de Caixa.
* **Pessoas:** Treinamento, Disciplina, Team Building.
* **Produto:** Engenharia de cardápio, Desperdício zero.
* **Vendas:** Marketing Estratégico, Tráfego Pago.
* **Operações:** Processos, Checklists, Auditoria.

### 4. Seção: "A Ciência por trás da Cultura"

* Copy focada no desenvolvimento humano (Integridade, Generosidade, Disciplina) para suportar as ferramentas tecnológicas.

### 5. Roadmap: "Seus Primeiros 30 Dias"

* Linha do tempo: Instalação da Telemetria -> Identificação de Vazamentos -> Intervenção -> Primeiro Estado de Eficiência.

---

## 🤖 Requisitos de Funcionalidade AI & Data

### 1. Administrative Brain (Chat AI)

* **Prompt Base:** "Você é o especialista técnico da Administrative. Responda perguntas sobre gestão de restaurantes com base no método de Estados de Eficiência. Seja técnico, preciso e mostre como a Administrative resolve problemas de margem e processos."
* **Tracking:** Mapear perguntas frequentes para ajuste de copy.

### 2. Funil de Conversão (Questionário)

* Botão "Medir minha Eficiência" abre modal com 5 perguntas críticas (CMV, turnover, faturamento vs lucro, processos documentados).
* Saída: Um score de eficiência preliminar que convida para o WhatsApp.

### 3. Analytics & Tracking

* Mapeamento de cliques em botões de "Pilar" para entender o interesse do lead.
* Registro anônimo de conversas com a IA para mineração de dores (Insights).

---

## ✍️ Tom de Voz & Copy (Style Guide)

* **Inspiracional, mas Pragmático:** Tesla encontra um consultor financeiro sênior.
* **Inversão de Medo:** O medo não é contratar a Administrative, o medo é continuar perdendo margem por ineficiência.
* **Humanizado:** Não somos robôs. Entendemos que o dono quer paz e tempo para a família.


##  PROTOCOLO DE DOCUMENTAÇÃO VIVA (LIVING DOCS)
> **OBRIGATÓRIO:** Executar este protocolo a cada 'Push' ou nova Feature.

### A. Snapshot de Base de Dados
- Exportar o esquema atual para `/md/basededados/schema.sql`.
- Registrar migrações e alterações de colunas em `/md/basededados/changelog.md`.
- Na criação de base de dados todas tabelas deste projeto devem começar com o prefixo 'web_'.

### B. Ciclo de Vida de Features
- **Nova/Alterada:** Criar ou atualizar arquivo em `/md/features/[nome-da-feature].md` detalhando regras de negócio, triggers e impacto na gamificação.
- **Removida:** Arquivar o `.md` correspondente em `/md/features/archive/`.

### C. Evolução do Conhecimento
- Atualizar `/md/ai_knowledge.md` com novos contextos de dados para garantir que o 'Brain' sempre saiba onde buscar informações.

## 📅 Milestones de Desenvolvimento

1. **MVP v1.0:** Landing Page de scroll único + Chat AI integrado.
2. **MVP v1.1:** Integração com formulário de diagnóstico e automação de WhatsApp.
3. **MVP v1.2:** Dashboard de Analytics de cliques para o proprietário (Renan).

