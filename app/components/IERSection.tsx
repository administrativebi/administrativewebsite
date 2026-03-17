'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight, X, BarChart3, TrendingUp, AlertTriangle, ShieldCheck, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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

export default function IERSection() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentDimIndex, setCurrentDimIndex] = useState(-1);
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantCity, setRestaurantCity] = useState('');
  const [answers, setAnswers] = useState<number[]>(Array(40).fill(-1));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real stats data
  const [stats, setStats] = useState({
    general: 48,
    dims: [32, 29, 51, 44, 40, 55, 25, 38],
    total: 50
  });

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/diagnostico/stats');
      const data = await response.json();
      if (data && !data.error && data.total > 0) {
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching real stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // States for the new flow
  const [viewState, setViewState] = useState<'quiz' | 'report' | 'chat'>('quiz');
  const [reportText, setReportText] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const marketDims = stats.dims;

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, viewState]);

  const handleAnswer = (qIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = value;
    setAnswers(newAnswers);
  };

  const calculateUserScore = () => {
    const totalPoints = answers.reduce((acc, val) => acc + (val >= 0 ? val : 0), 0);
    return Math.round((totalPoints / 80) * 100);
  };
const calculateUserDimensions = () => {
  return QUESTIONS_DATA.map((dimData, dimIdx) => {
    const start = dimIdx * 5;
    const dimAnswers = answers.slice(start, start + 5);
    const points = dimAnswers.reduce((acc, val) => acc + (val >= 0 ? val : 0), 0);
    return {
      name: dimData.dim,
      score: Math.round((points / 10) * 100)
    };
  });
};

const handleNext = async () => {
  if (currentDimIndex === -1) {
// ...

      if (!restaurantName || !restaurantCity) return;
      setCurrentDimIndex(0);
      return;
    }

    if (currentDimIndex < QUESTIONS_DATA.length - 1) {
      setCurrentDimIndex(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/diagnostico', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: restaurantName,
            city: restaurantCity,
            answers
          })
        });
        const data = await response.json();

        if (data.success) {
          setReportText(data.report);
          setSessionId(data.sessionId);
          if (data.initialMessage) {
            setChatMessages([{ role: 'ai', text: data.initialMessage }]);
          }
          setViewState('report');
          // Refresh stats to include new user data
          fetchStats();
        } else {
          alert("Ocorreu um erro ao processar seu diagnóstico. Tente novamente.");
        }
      } catch (err) {
        console.error('Error processing diagnosis', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/diagnostico/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: userMsg })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'ai', text: data.text }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'ai', text: "Erro ao conectar com a inteligência central." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const startOver = () => {
    setIsQuizOpen(true);
    setViewState('quiz');
    setCurrentDimIndex(-1);
    setAnswers(Array(40).fill(-1));
    setRestaurantName('');
    setRestaurantCity('');
    setReportText(null);
    setChatMessages([]);
  }

  const currentDim = currentDimIndex >= 0 ? QUESTIONS_DATA[currentDimIndex] : null;
  const startIndex = currentDimIndex * 5; 
  const allAnsweredInDim = currentDimIndex >= 0 
    ? answers.slice(startIndex, startIndex + 5).every(a => a !== -1) 
    : false;

  return (
    <section className="py-24 px-4 bg-[#050505] relative overflow-hidden border-t border-b border-white/5">
      <div className="absolute inset-0 bg-[#0A0A0A] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0A0A0A] to-[#050505]"></div>

      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left Side: Provocative Copy */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono uppercase tracking-widest mb-6">
            <AlertTriangle className="w-4 h-4" /> Descubra o potencial de eficiência de seu Restaurante
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-tight text-white tracking-tighter">
            Sua operação está <span className="text-red-500">morrendo</span> em silêncio?
          </h2>
          <p className="text-xl text-gray-400 mb-8 border-l-2 border-red-500/50 pl-4">
            A média de eficiência dos restaurantes no Brasil é de apenas <strong className="text-white">{stats.general}/100</strong>.
            Muitos restaurantes operam com boa movimentação, mas sem visibilidade clara sobre a real eficiência do negócio. Vendem bem, porém não conseguem enxergar com precisão margens, produtividade do time e eficiência dos processos. Sem ferramentas de gestão, indicadores e rituais de acompanhamento, o potencial de performance da operação fica limitado.
            Decisões passam a ser tomadas mais pela urgência do dia a dia do que por dados confiáveis. Quando fatores críticos do negócio não são monitorados, o restaurante deixa de explorar aquilo que poderia ser seu maior diferencial competitivo.
            Para revelar essa realidade, criamos um diagnóstico com 40 perguntas organizadas em 8 pilares da gestão, capaz de mostrar com clareza os pontos que sustentam — ou travam — o crescimento da sua operação
          </p>

          <button
            onClick={startOver}
            className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-sm font-bold text-sm uppercase tracking-widest transition-all flex items-center gap-3 group"
          >
            Descubra o seu IER (Automático) <ArrowRight className="group-hover:translate-x-1" />
          </button>
        </div>

        {/* Right Side: Market Indices Chart */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 relative shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <BarChart3 className="w-32 h-32" />
          </div>

          <div className="mb-8">
            <h3 className="text-sm text-gray-400 font-mono uppercase tracking-widest">Índice Geral do Projeto (IER)</h3>
            <div className="text-5xl font-black text-blue-500 tracking-tighter mt-2">{stats.general} <span className="text-xl text-gray-500 font-normal">/ 100</span></div>
            <p className="text-xs text-gray-500 mt-1 uppercase">Baseado em {stats.total}+ diagnósticos reais</p>
          </div>

          <div className="space-y-4">
            {QUESTIONS_DATA.map((dim, idx) => (
              <div key={dim.dim}>
                <div className="flex justify-between text-xs font-bold uppercase mb-1">
                  <span className="text-gray-300">{dim.dim}</span>
                  <span className={marketDims[idx] < 50 ? 'text-red-400' : 'text-blue-400'}>{marketDims[idx]}</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${marketDims[idx]}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className={`h-full rounded-full ${marketDims[idx] < 50 ? 'bg-red-500' : 'bg-blue-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUIZ/REPORT/CHAT MODAL */}
      <AnimatePresence>
        {isQuizOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <button onClick={() => setIsQuizOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-50">
                <X className="w-6 h-6" />
              </button>

              {/* VIEW: QUIZ */}
              {viewState === 'quiz' && (
                <>
                  <div className="mb-8 border-b border-white/10 pb-6">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <span className="text-blue-500 font-mono text-xs uppercase tracking-widest block mb-1">
                          {currentDimIndex === -1 ? 'Identificação' : `Dimensão ${currentDimIndex + 1}/8`}
                        </span>
                        <h3 className="text-3xl font-black uppercase text-white tracking-tighter">
                          {currentDimIndex === -1 ? 'Sua Operação' : currentDim?.dim}
                        </h3>
                      </div>
                      <div className="text-gray-500 font-mono text-sm">
                        {currentDimIndex === -1 ? 0 : Math.round(((currentDimIndex) / 8) * 100)}% concluído
                      </div>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${currentDimIndex === -1 ? 0 : ((currentDimIndex) / 8) * 100}%` }} />
                    </div>
                  </div>

                  <div className="space-y-6 flex-1">
                    {currentDimIndex === -1 ? (
                      <div className="space-y-6 py-4">
                        <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">Para uma análise personalizada, informe os dados da sua operação:</p>
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Nome do Restaurante</label>
                          <input
                            type="text"
                            value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                            placeholder="Ex: Cantina do Renan"
                            className="w-full bg-white/5 border border-white/10 rounded-md p-4 text-white focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Cidade</label>
                          <input
                            type="text"
                            value={restaurantCity}
                            onChange={(e) => setRestaurantCity(e.target.value)}
                            placeholder="Ex: Balneário Camboriú, SC"
                            className="w-full bg-white/5 border border-white/10 rounded-md p-4 text-white focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                    ) : (
                      currentDim?.questions.map((q, i) => {
                        const qAbsoluteIndex = startIndex + i;
                        const val = answers[qAbsoluteIndex];

                        return (
                          <div key={q} className="bg-[#111] p-4 rounded-xl border border-white/5">
                            <p className="text-gray-200 font-medium mb-4">{i + 1}. {q}</p>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => handleAnswer(qAbsoluteIndex, 0)}
                                className={`py-2 px-2 text-xs font-bold uppercase rounded-md transition-all border ${val === 0 ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'}`}
                              >
                                Não existe
                              </button>
                              <button
                                onClick={() => handleAnswer(qAbsoluteIndex, 1)}
                                className={`py-2 px-2 text-xs font-bold uppercase rounded-md transition-all border ${val === 1 ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'}`}
                              >
                                Parcial
                              </button>
                              <button
                                onClick={() => handleAnswer(qAbsoluteIndex, 2)}
                                className={`py-2 px-2 text-xs font-bold uppercase rounded-md transition-all border ${val === 2 ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'}`}
                              >
                                Estruturado
                              </button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10">
                    <button
                      onClick={() => setCurrentDimIndex(prev => prev - 1)}
                      disabled={currentDimIndex === -1}
                      className="px-6 py-3 text-gray-500 hover:text-white uppercase font-bold text-xs disabled:opacity-30 transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={(currentDimIndex === -1 && (!restaurantName || !restaurantCity)) || (currentDimIndex >= 0 && !allAnsweredInDim) || isSubmitting}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-md uppercase font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                    >
                      {isSubmitting ? 'Calculando...' : currentDimIndex === 7 ? 'Finalizar Diagnóstico' : 'Próxima'}
                      {!isSubmitting && <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </>
              )}

              {/* VIEW: REPORT */}
              {viewState === 'report' && (
                <div className="text-left py-2 flex flex-col flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                      <ShieldCheck className="w-12 h-12 text-blue-500 drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                      <div>
                        <span className="text-blue-500 font-mono text-xs uppercase tracking-widest block">Diagnóstico Concluído</span>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">
                          Score: <span className="text-blue-500">{calculateUserScore()}</span> / 100
                        </h3>
                      </div>
                    </div>
                    
                    <a
                      href={`https://wa.me/5547999255801?text=Olá! Acabei de realizar o diagnóstico IER para o restaurante ${restaurantName} e meu score foi ${calculateUserScore()}/100. Gostaria de falar com um especialista.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-bounce-subtle"
                    >
                      Falar com um Especialista
                    </a>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 overflow-y-auto flex-1 scrollbar-hide">
                    {/* User Dimensions Chart */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-500" /> Seu Mapa de Performance Real
                      </h4>
                      <div className="space-y-4">
                        {calculateUserDimensions().map((dim, idx) => (
                          <div key={dim.name}>
                            <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                              <span className="text-gray-300">{dim.name}</span>
                              <span className={dim.score < 50 ? 'text-red-400' : 'text-blue-400'}>{dim.score}%</span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${dim.score}%` }}
                                transition={{ duration: 1, delay: idx * 0.1 }}
                                className={`h-full rounded-full ${dim.score < 50 ? 'bg-red-500' : 'bg-blue-500'}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Report Text Content */}
                    <div className="bg-[#111] border border-white/10 rounded-xl p-6 prose prose-invert prose-blue max-w-none prose-xs overflow-y-auto">
                      <ReactMarkdown>{reportText || ''}</ReactMarkdown>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3">
                    <button
                      onClick={() => setViewState('chat')}
                      className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-black uppercase text-xs rounded-md transition-all flex justify-center items-center gap-2 border border-white/10"
                    >
                      Acessar Brain AI <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsQuizOpen(false)}
                      className="px-8 py-4 bg-transparent border border-white/5 text-gray-500 hover:text-white font-black uppercase text-xs rounded-md transition-all"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW: CHAT */}
              {viewState === 'chat' && (
                <div className="flex flex-col h-[70vh]">
                  <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/30">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-tighter leading-none">Administrative Brain</h3>
                        <span className="text-xs text-blue-400 font-mono">Estrategista de Performance</span>
                      </div>
                    </div>
                    <a
                      href="https://wa.me/5547999255801"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    >
                      Fale com um Consultor
                    </a>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide pr-2">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-5 ${msg.role === 'ai'
                          ? 'bg-[#111] border border-white/5 text-gray-300'
                          : 'bg-blue-600 text-white'
                          }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-[#111] border border-white/5 p-4 rounded-2xl flex gap-3 items-center">
                          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                          <span className="text-gray-400 text-xs font-mono uppercase">Processando...</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Faça uma pergunta sobre sua operação..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isChatLoading}
                      className="px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
