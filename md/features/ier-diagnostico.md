# Feature: Diagnóstico IER Inteligente (v2.0)

## Visão Geral
O Diagnóstico IER (Índice de Eficiência de Restaurante) agora opera como o funil de entrada principal da Administrative, integrando coleta de dados operacionais com análise de sentimento de mercado via IA.

## Fluxo de Dados
1. **Identificação:** O usuário informa `restaurant_name` e `restaurant_city`.
2. **Diagnóstico:** 8 dimensões operacionais (40 questões).
3. **Persistência:** Dados salvos na tabela `web_ier_diagnostics`.
4. **Análise de IA:** O Gemini recebe os scores + dados do restaurante e realiza um cruzamento técnico.

## Regras de Inteligência (Brain Protocol - Atualizado v2.1)
A IA (Administrative Brain) agora opera com foco em conversão e geração de consciência:
*   **Simular/Pesquisar Mercado:** Usar o nome e cidade para identificar o perfil do restaurante no Google.
*   **Correlação Crítica:** Se o score de "Processos" é baixo, a IA deve prever reclamações sobre "demora" ou "inconsistência no prato".
*   **Estado de Eficiência:** A IA deve reforçar que a Administrative entrega um "Estado de Eficiência" — um sistema operacional vivo que gera lucro real — e não apenas relatórios.
*   **Call to Action (WhatsApp):** Após 2 ou 3 interações de valor, a IA deve sugerir uma conversa estratégica com um especialista via WhatsApp (+5547999255801) para análise profunda.

## Interface e Conversão
*   Botão "Fale com um Consultor" integrado diretamente no cabeçalho do Chat de Diagnóstico.
*   Copy agressivo e focado em potencial de eficiência: "Descubra o potencial de eficiência de seu Restaurante".
*   Inversão de risco na copy: "Clientes podem até vir. Sem performance, o resultado não vem."

## Metadados do Banco de Dados
*   Tabela: `web_ier_diagnostics`
*   Campos novos: `restaurant_name` (text), `restaurant_city` (text)
