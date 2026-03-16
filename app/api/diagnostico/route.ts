import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { generateInitialAIResponse } from '@/lib/aiEngine';

const QUESTIONS_DATA = [
  { 
    dim: 'Gestão Financeira', 
    questions: [
      'Existe DRE estruturada e mensal?',
      'Fluxo de caixa é acompanhado diariamente?',
      'Existe meta de lucratividade líquida definida?',
      'Contas a pagar e receber são conciliadas diariamente?',
      'Existe separação total entre conta física e jurídica?'
    ] 
  },
  { 
    dim: 'Controle de Custos', 
    questions: [
      'CMV é calculado regularmente com base em inventário?',
      'Fichas técnicas estão atualizadas e são seguidas?',
      'Existe controle de desperdício e quebras registrado?',
      'Compras são feitas com base em cotações e PVPS?',
      'Margem de contribuição por produto é conhecida?'
    ] 
  },
  { 
    dim: 'Processos Operacionais', 
    questions: [
      'Existe padrão (POP) de abertura e fechamento?',
      'Checklists operacionais são aplicados e auditados?',
      'O fluxo de produção da cozinha é otimizado (Lean)?',
      'Existe padrão de recebimento de mercadorias?',
      'A manutenção preventiva de equipamentos é realizada?'
    ] 
  },
  { 
    dim: 'Gestão de Pessoas', 
    questions: [
      'Existe treinamento estruturado para novos colaboradores?',
      'As funções e responsabilidades estão documentadas (Job Description)?',
      'Existe feedback formal e rotina de alinhamento com a equipe?',
      'O turnover da operação é medido e controlado?',
      'Existe política de incentivos baseada em metas?'
    ] 
  },
  { 
    dim: 'Gestão Comercial', 
    questions: [
      'O ticket médio é acompanhado e existem metas de aumento?',
      'Existe estratégia de engenharia de cardápio (Menu Engineering)?',
      'As campanhas de marketing são medidas por ROI real?',
      'Existe base de clientes (CRM) para ações de fidelização?',
      'A presença digital (Google/Redes) é gerida estrategicamente?'
    ] 
  },
  { 
    dim: 'Experiência do Cliente', 
    questions: [
      'Existe um padrão de atendimento (script/etapas) definido?',
      'O tempo de espera/entrega é monitorado constantemente?',
      'Existe pesquisa de satisfação (NPS ou similar) ativa?',
      'O ambiente (limpeza, som, luz) é auditado regularmente?',
      'Existe protocolo de resolução de reclamações em tempo real?'
    ] 
  },
  { 
    dim: 'Inteligência de Dados', 
    questions: [
      'Existe dashboard ou BI para acompanhamento de KPIs?',
      'Os indicadores de performance (vendas, custos, pessoas) são cruzados?',
      'Existe análise de concorrência e benchmark de mercado?',
      'Decisões de investimento são baseadas em dados históricos?',
      'O estoque é gerido por sistema integrado (ERP)?'
    ] 
  },
  { 
    dim: 'Liderança', 
    questions: [
      'O dono possui rotina de gestão semanal fora da operação?',
      'Existem rituais de cultura e valores com toda a equipe?',
      'O plano estratégico do negócio é revisado trimestralmente?',
      'A sucessão ou delegabilidade operacional está em construção?',
      'O líder foca mais em estratégia do que em "apagar incêndios"?'
    ] 
  }
];

export async function POST(req: Request) {
  try {
    const { name, city, answers } = await req.json();

    // 1. Lógica de Cálculo IER (Máximo 80 pontos agora: 40 questões * 2 pts)
    const totalPoints = answers.reduce((acc: number, val: number) => acc + (val >= 0 ? val : 0), 0);
    const ierScore = Math.round((totalPoints / 80) * 100);
    
    let classification = '';
    if (ierScore <= 25) classification = 'Crítico';
    else if (ierScore <= 50) classification = 'Operacional';
    else if (ierScore <= 75) classification = 'Gerenciado';
    else classification = 'Alta Eficiência';

    // 2. Cálculo das Dimensões (5 questões por dimensão)
    const dimensions = QUESTIONS_DATA.map((dimData, dimIdx) => {
      const startIndex = dimIdx * 5;
      const dimAnswers = answers.slice(startIndex, startIndex + 5);
      const dimPoints = dimAnswers.reduce((acc: number, val: number) => acc + (val >= 0 ? val : 0), 0);
      return {
        name: dimData.dim,
        score: Math.round((dimPoints / 10) * 100) // 5 questões * 2 pts = 10 pts max por dim
      };
    });

    const weakestDimension = [...dimensions].sort((a, b) => a.score - b.score)[0];

    const zeroAnswers: string[] = [];
    const flatQuestions = QUESTIONS_DATA.flatMap(d => d.questions);
    answers.forEach((val: number, idx: number) => {
      if (val === 0) {
        zeroAnswers.push(flatQuestions[idx]);
      }
    });

    // 3. Salvar no Banco
    const { data: diagnostic, error } = await supabase
      .from('web_ier_diagnostics')
      .insert([{
        restaurant_name: name,
        restaurant_city: city,
        score_total: ierScore,
        classification,
        raw_answers: answers,
        dim_financeira: dimensions[0].score,
        dim_custos: dimensions[1].score,
        dim_processos: dimensions[2].score,
        dim_pessoas: dimensions[3].score,
        dim_comercial: dimensions[4].score,
        dim_experiencia: dimensions[5].score,
        dim_dados: dimensions[6].score,
        dim_lideranca: dimensions[7].score
      }])
      .select()
      .single();

    if (error) console.error("Supabase Error saving diagnostic:", error);

    // Cria a sessão de chat vinculada ao diagnóstico
    let sessionId = null;
    if (diagnostic) {
      const { data: session } = await supabase
        .from('web_chat_sessions')
        .insert([{ diagnostic_id: diagnostic.id }])
        .select()
        .single();
      
      if (session) {
        sessionId = session.id;

        // Inserimos a submissão do diagnóstico como a PRIMEIRA mensagem do USUÁRIO
        await supabase
          .from('web_chat_messages')
          .insert([{ 
            session_id: sessionId, 
            role: 'user', 
            content: `Acabei de realizar meu diagnóstico IER para o restaurante ${name} em ${city}. Meu score foi ${ierScore}/100.` 
          }]);
      }
    }

    // 4. Gerar Relatório e Primeira Mensagem da IA
    const contextForAI = {
      restaurantName: name,
      city,
      ierScore, 
      classification, 
      weakestDimension, 
      zeroAnswers
    };
    
    const initialAiMessage = await generateInitialAIResponse(contextForAI);
    
    // Salvar mensagem inicial da IA no banco
    if (sessionId && initialAiMessage) {
        await supabase
        .from('web_chat_messages')
        .insert([{ session_id: sessionId, role: 'ai', content: initialAiMessage }]);
    }

    // Construção do Relatório
    let reportText = `### 📊 Relatório de Eficiência do Restaurante: ${name}\n\n`;
    reportText += `**1. Pontuação Geral (IER):** ${ierScore}/100\n`;
    reportText += `**2. Classificação de Eficiência:** ${classification}\n\n`;
    reportText += `**3. Mapa de Performance por Dimensão:**\n`;
    dimensions.sort((a, b) => b.score - a.score).forEach(d => {
      reportText += `- ${d.name}: ${d.score}%\n`;
    });
    reportText += `\n**4. Principais Lacunas Identificadas (Não-Competências):**\n`;
    zeroAnswers.slice(0, 5).forEach(q => {
      reportText += `- Ausência de: ${q.replace('Existe ', '').replace(/\?$/, '')}\n`;
    });
    reportText += `\n**5. Potencial de Intervenção:**\n`;
    reportText += `A estabilização estrutural pode destravar de **+6% a +15% de margem operacional líquida** nos próximos 90 dias.\n`;

    return NextResponse.json({ 
      success: true, 
      report: reportText, 
      initialMessage: initialAiMessage,
      diagnosticId: diagnostic?.id,
      sessionId
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao processar diagnóstico' }, { status: 500 });
  }
}
