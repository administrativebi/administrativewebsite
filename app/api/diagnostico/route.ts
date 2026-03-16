import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { generateInitialAIResponse } from '@/lib/aiEngine';
import { sendEmail } from '@/lib/resend';

const QUESTIONS_DATA = [
  { 
    dim: 'Gestão Financeira', 
    questions: [
      'Existe DRE estruturada?',
      'A DRE é analisada mensalmente?',
      'Existe controle de fluxo de caixa projetado?',
      'Existe orçamento ou meta financeira?',
      'Existe análise de lucratividade do negócio?'
    ] 
  },
  { 
    dim: 'Controle de Custos', 
    questions: [
      'CMV é calculado regularmente?',
      'Existe ficha técnica completa dos pratos?',
      'Existe inventário periódico?',
      'Existe controle de desperdício?',
      'Existe análise de margem por prato?'
    ] 
  },
  { 
    dim: 'Processos Operacionais', 
    questions: [
      'Existe padrão de abertura e fechamento?',
      'Existe padrão de montagem dos pratos?',
      'Existe controle de tempo de preparo?',
      'Existe checklists operacionais?',
      'Existe controle de qualidade da produção?'
    ] 
  },
  { 
    dim: 'Gestão de Pessoas', 
    questions: [
      'Existe treinamento estruturado?',
      'Existe avaliação de desempenho?',
      'Existe definição clara de funções?',
      'Existe rotina de reunião com equipe?',
      'Existe plano de metas para equipe?'
    ] 
  },
  { 
    dim: 'Gestão Comercial', 
    questions: [
      'Ticket médio é acompanhado?',
      'Giro de mesas é analisado?',
      'Ranking de pratos vendidos é acompanhado?',
      'Existe estratégia de vendas ativa?',
      'Existe gestão de canais (delivery, salão etc.)?'
    ] 
  },
  { 
    dim: 'Experiência do Cliente', 
    questions: [
      'Existe padrão de atendimento?',
      'Existe acompanhamento de avaliações online?',
      'Existe gestão de reclamações?',
      'Existe padrão de tempo de atendimento?',
      'Existe estratégia de fidelização?'
    ] 
  },
  { 
    dim: 'Inteligência de Dados', 
    questions: [
      'Existe dashboard ou BI?',
      'Indicadores são revisados regularmente?',
      'Existe análise de tendências de vendas?',
      'Existe acompanhamento de metas?',
      'Decisões são tomadas com base em dados?'
    ] 
  },
  { 
    dim: 'Liderança e Gestão do Dono', 
    questions: [
      'O dono possui rotina de gestão semanal?',
      'Existe planejamento estratégico anual?',
      'O dono delega responsabilidades?',
      'Existe acompanhamento de metas mensais?',
      'Existe revisão periódica da operação?'
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

    // ENVIO DE E-MAIL NOTIFICANDO NOVO DIAGNÓSTICO
    await sendEmail({
      subject: `🚨 Novo Diagnóstico IER: ${name} (${ierScore}/100)`,
      html: `
        <h2>Novo Lead de Diagnóstico IER</h2>
        <p><strong>Restaurante:</strong> ${name}</p>
        <p><strong>Cidade:</strong> ${city}</p>
        <p><strong>Score IER:</strong> ${ierScore}/100</p>
        <p><strong>Classificação:</strong> ${classification}</p>
        <p><strong>Pior Dimensão:</strong> ${weakestDimension.name} (${weakestDimension.score}%)</p>
        <hr />
        <p><small>Enviado automaticamente pelo sistema Administrative via Resend.</small></p>
      `,
    });

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
