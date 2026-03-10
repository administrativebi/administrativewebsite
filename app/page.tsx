'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Utensils, 
  Zap, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  MessageSquare,
  BarChart3,
  X,
  Send,
  Loader2
} from 'lucide-react';
import { trackClick, logAiChat, supabase } from '../lib/supabaseClient';
import { ASSETS } from '../lib/assets';

// --- DATA & COPY ---

const PILLARS = [
  {
    id: 'financeiro',
    title: 'Dominância Financeira',
    description: 'BPO que não apenas reporta, mas intervém. Instalamos auditoria de precisão cirúrgica para garantir retenção máxima de lucro.',
    icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
  },
  {
    id: 'pessoas',
    title: 'Engenharia Humana',
    description: 'Transformamos colaboradores em operadores de elite. Disciplina científica e team building focado em resultados reais.',
    icon: <Users className="w-8 h-8 text-blue-500" />,
  },
  {
    id: 'produto',
    title: 'Eficiência em Prateleira',
    description: 'Engenharia de cardápio voltada para margem máxima e desperdício zero. Unidades de lucro otimizadas em cada prato.',
    icon: <Utensils className="w-8 h-8 text-blue-500" />,
  },
  {
    id: 'vendas',
    title: 'Máquina de Aquisição',
    description: 'Tráfego pago e marketing estratégico com ROI rastreável. Funil de vendas previsível, agressivo e escalável.',
    icon: <Zap className="w-8 h-8 text-blue-500" />,
  },
  {
    id: 'operacoes',
    title: 'Blindagem Operacional',
    description: 'Checklists vivos e auditoria constante. Padronizamos a excelência para que sua operação rode com ou sem você.',
    icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
  },
];

const ROADMAP = [
  { day: 'Dia 07', title: 'Instalação da Telemetria', desc: 'Mapeamento total de dados e identificação de gargalos imediatos.' },
  { day: 'Dia 15', title: 'Identificação de Vazamentos', desc: 'Intervenção direta nos pontos críticos de perda de margem.' },
  { day: 'Dia 25', title: 'Protocolo de Intervenção', desc: 'Ajuste fino de processos e treinamento intensivo da equipe de elite.' },
  { day: 'Dia 30', title: 'Primeiro Estado de Eficiência', desc: 'Estabilização da nova operação com foco em escala e lucro líquido.' },
];

// --- COMPONENTS ---

const SectionHeading = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-12 text-center">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter uppercase"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-gray-400 text-lg max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const LOGO_VERSION = 'v=1.1';

export default function AdministrativeLanding() {
  const [showChat, setShowChat] = useState(false);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // Chat State
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: 'Olá! Sou o especialista técnico da Administrative. Como posso ajudar com a gestão do seu restaurante hoje?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: '',
    restaurante: '',
    dor_principal: '',
    score_eficiencia: 0
  });

  const handleCTA = (id: string, section: string) => {
    trackClick(id, section);
    if (id === 'iniciar-diagnostico') {
      setFormStep(1);
      setShowDiagnosis(true);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, showChat]);

  const handleSendMessage = async (msgOverride?: string) => {
    const userMsg = msgOverride || chatInput.trim();
    if (!userMsg) return;
    
    if (!msgOverride) {
      setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
      setChatInput('');
    }
    
    setIsChatLoading(true);
    trackClick('ai-interaction', 'chat-brain');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      
      if (msgOverride) {
        setChatMessages([{ role: 'ai', text: data.text }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'ai', text: data.text }]);
      }
      
      await logAiChat(userMsg, data.text, 0.8);
    } catch (err) {
      console.error(err);
      const errorMsg = "Erro na telemetria central. Verifique sua conexão.";
      if (msgOverride) setChatMessages([{ role: 'ai', text: errorMsg }]);
      else setChatMessages(prev => [...prev, { role: 'ai', text: errorMsg }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    const score = Math.floor(Math.random() * 50) + 10;
    const { error } = await supabase
      .from('leads')
      .insert([{
        nome: formData.nome,
        restaurante: formData.restaurante,
        dor_principal: formData.dor_principal,
        score_eficiencia: score
      }]);

    if (!error) {
      setFormData(prev => ({...prev, score_eficiencia: score}));
      setFormStep(4);
    } else {
      console.error('Error saving lead:', error);
      alert('Erro ao salvar diagnóstico. Tente novamente.');
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-blue-500 selection:text-white overflow-x-hidden pt-20">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-black/60 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img src={`${ASSETS.LOGO_HORIZONTAL}?${LOGO_VERSION}`} alt="Administrative Logo" className="h-8 md:h-12 w-auto object-contain" />
          <div className="hidden md:flex gap-8 text-xs font-mono uppercase tracking-widest text-gray-400">
            <a href="#metodologia" className="hover:text-blue-500 transition-colors">Metodologia</a>
            <a href="#cultura" className="hover:text-blue-500 transition-colors">Cultura</a>
          </div>
          <button 
            onClick={() => handleCTA('iniciar-diagnostico', 'navbar')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase rounded-md transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            Diagnóstico
          </button>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex items-center justify-start px-6 md:px-20 overflow-hidden border-b border-white/5">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={ASSETS.HERO_VIDEO} type="video/mp4" />
          </video>
        </div>

        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_20%_50%,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent z-[1]"
        />
        
        <div className="max-w-3xl z-10 text-left relative mt-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1 rounded-full border border-blue-500/50 bg-black/50 backdrop-blur-sm text-blue-400 text-xs font-mono uppercase tracking-widest mb-6">
              Performance as a Service (PaaS)
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-[0.9] mb-6 drop-shadow-2xl">
              Sua margem<br />
              é o seu <span className="text-blue-500">oxigênio.</span><br />
              <span className="text-gray-300 text-3xl md:text-5xl block mt-2 drop-shadow-lg">Pare de gerir por instinto.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-lg mb-10 font-medium leading-tight border-l-2 border-blue-600/80 pl-6 drop-shadow-xl bg-black/20 backdrop-blur-sm py-2 rounded-r-md">
              Entregamos Estados de Eficiência. Não somos consultoria de papel; somos o braço de inteligência que blinda sua operação.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-start items-start">
              <button 
                onClick={() => handleCTA('iniciar-diagnostico', 'hero')}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-sm font-bold text-base uppercase transition-all flex items-center gap-3 group shadow-[0_0_30px_rgba(37,99,235,0.4)] backdrop-blur-sm"
              >
                Iniciar Diagnóstico <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => {
                  trackClick('ver-metodologia', 'hero');
                  document.getElementById('metodologia')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 text-white rounded-sm font-bold text-base uppercase transition-all"
              >
                Metodologia
              </button>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40 z-10 text-white drop-shadow-lg">
          <ChevronRight className="rotate-90 w-8 h-8" />
        </div>
      </section>

      {/* 2. TABELA DE RUPTURA (Inversão de Risco) */}
      <section className="py-24 px-4 bg-[#050505]">
        <div className="max-w-5xl mx-auto">
          <SectionHeading 
            title="A Tabela da Verdade" 
            subtitle="O modelo de consultoria tradicional morreu. O PaaS (Performance as a Service) é a evolução biológica da gestão."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Tradicional */}
            <div className="p-8 md:p-12 bg-white/5 border-b md:border-b-0 md:border-r border-white/10">
              <h3 className="text-xl font-mono text-gray-500 mb-8 uppercase tracking-widest">Consultoria Tradicional</h3>
              <ul className="space-y-6">
                {[
                  'Entrega de PDFs e Relatórios Estáticos',
                  'Diagnóstico que morre na gaveta',
                  'Foco em "O que fazer" (Teoria)',
                  'Custo fixo sem garantia de margem',
                  'Dependência de reuniões mensais'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-500 line-through decoration-red-500/50">
                    <X className="w-5 h-5 mt-1 shrink-0 text-red-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Administrative PaaS */}
            <div className="p-8 md:p-12 bg-blue-600/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <Zap className="w-12 h-12 text-blue-500 opacity-20 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-mono text-blue-400 mb-8 uppercase tracking-widest">Administrative PaaS</h3>
              <ul className="space-y-6">
                {[
                  'Intervenção Direta e Monitoramento Vivo',
                  'Sistemas de IA que bloqueiam vazamentos',
                  'Foco em "Como executar" (Prática)',
                  'Remuneração atrelada à Eficiência',
                  'Telemetria de dados em tempo real'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-blue-50 font-medium">
                    <ShieldCheck className="w-5 h-5 mt-1 shrink-0 text-blue-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 p-4 rounded-lg bg-blue-600/20 border border-blue-500/30 text-center text-sm font-bold uppercase tracking-tighter text-blue-400">
                Inversão Total de Risco: Só lucramos se você lucrar.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE 5 PILLARS (Interactive Grid) */}
      <section id="metodologia" className="py-24 px-4 max-w-7xl mx-auto">
        <SectionHeading 
          title="Os 5 Pilares da Performance" 
          subtitle="Ativamos as engrenagens que sustentam o seu negócio. Cada pilar é uma máquina de eficiência monitorada em tempo real."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-[#111] border border-white/5 rounded-xl hover:border-blue-500/50 transition-colors group relative overflow-hidden cursor-pointer"
              onClick={() => handleCTA(`pilar-${pillar.id}`, 'pilares')}
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                {pillar.icon}
              </div>
              <div className="mb-6 bg-blue-500/10 w-16 h-16 rounded-lg flex items-center justify-center">
                {pillar.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">{pillar.title}</h3>
              <p className="text-gray-400 leading-relaxed italic">{pillar.description}</p>
              
              <div className="mt-8 flex items-center text-blue-500 font-bold text-sm uppercase tracking-widest gap-2">
                Ativar Módulo <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
          
          {/* Dashboard Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="lg:col-span-1 p-8 bg-blue-600 rounded-xl flex flex-col justify-between items-start"
          >
            <div>
              <h3 className="text-3xl font-black uppercase mb-2">Telemetria em Tempo Real</h3>
              <p className="text-blue-100 mb-6">Visualização massiva de dados para suporte técnico preciso.</p>
            </div>
            <BarChart3 className="w-24 h-24 text-blue-400/50 mb-4" />
            <button className="w-full py-3 bg-white text-blue-600 font-bold uppercase rounded-md hover:bg-gray-100 transition-colors">
              Explorar Dashboard
            </button>
          </motion.div>
        </div>
      </section>

      {/* --- LABORATÓRIO DE INTERVENÇÃO (AI SOLUTION ENGINE) --- */}
      <section className="py-24 px-4 bg-[#0A0A0A] relative overflow-hidden">
        <div className="max-w-6xl mx-auto border border-blue-500/20 bg-blue-500/5 rounded-3xl p-8 md:p-16 relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap className="w-32 h-32 text-blue-500" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-500 font-mono text-sm uppercase tracking-widest mb-4 block">Laboratório de Intervenção</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase mb-8 leading-tight">
                Submeta sua <span className="text-blue-500">Dor Operacional.</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Descreva o seu maior gargalo hoje. Nossa IA processará seu problema através do Método Administrative e gerará uma hipótese de recuperação imediata.
              </p>
              
              <div className="space-y-4">
                <div className="relative">
                  <textarea 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ex: Meu CMV está em 38% e minha equipe tem alto turnover..."
                    className="w-full h-32 bg-black border border-white/10 rounded-xl p-4 text-gray-200 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                  <button 
                    onClick={() => handleSendMessage(chatInput)}
                    disabled={isChatLoading || !chatInput.trim()}
                    className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold uppercase text-xs flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    Gerar Protocolo
                  </button>
                </div>
              </div>
            </div>

            <div className="min-h-[400px] bg-black border border-white/5 rounded-2xl p-8 font-mono relative overflow-hidden shadow-inner group">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20" />
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-[10px] text-gray-600 ml-4 uppercase">Administrative_Brain_v2.0 // Terminal</span>
              </div>

              {isChatLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-blue-500 animate-pulse">
                  <Loader2 className="w-12 h-12 animate-spin mb-4" />
                  <span className="text-xs uppercase tracking-widest font-bold">Escaneando Metodologia...</span>
                </div>
              ) : chatMessages.length > 0 && chatMessages[0].role === 'ai' && chatMessages[0].text !== 'Olá! Sou o especialista técnico da Administrative. Como posso ajudar com a gestão do seu restaurante hoje?' ? (
                <div className="space-y-6">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <span className="text-blue-500 block mb-2 font-bold uppercase text-xs tracking-tighter">{">>>"} HIPÓTESE DE INTERVENÇÃO GERADA:</span>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line italic">
                      {chatMessages[0].text}
                    </p>
                  </motion.div>
                  <button 
                    onClick={() => handleCTA('iniciar-diagnostico', 'laboratorio')}
                    className="mt-8 text-blue-500 border border-blue-500/30 px-4 py-2 rounded text-[10px] hover:bg-blue-500 hover:text-white transition-all uppercase font-bold"
                  >
                    Baixar Protocolo Completo via WhatsApp
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-700 text-center">
                  <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
                  <span className="text-[10px] uppercase">Aguardando dados de entrada para análise termográfica de margem.</span>
                </div>
              )}
              
              {/* Scan Line Animation */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-20 w-full animate-scan" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. A CIÊNCIA DA CULTURA (Tipografia Pesada) */}
      <section id="cultura" className="py-32 bg-white text-[#0A0A0A] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
           <img src={`${ASSETS.LOGO_LAMPADA}?${LOGO_VERSION}`} alt="Cultura Mark" className="w-32 h-32 mx-auto object-contain animate-pulse mb-8" />
        </div>
        <div className="max-w-7xl mx-auto px-4 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-24">
            <div className="lg:col-span-8">
              <motion.h2 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-7xl md:text-9xl font-black uppercase leading-[0.8] tracking-tighter"
              >
                A CIÊNCIA DA <span className="text-blue-600 italic">CULTURA.</span>
              </motion.h2>
            </div>
            <div className="lg:col-span-4">
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-xl md:text-2xl font-medium leading-tight text-gray-500 border-l-4 border-blue-600 pl-6"
              >
                Ferramentas de alta performance exigem virtudes humanas inegociáveis. Não instalamos apenas sistemas; instalamos caráter operacional.
              </motion.p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 px-1 bg-gray-200 border border-gray-200">
            {[
              { label: 'INTEGRIDADE', desc: 'A base da verdade nos dados. Sem honestidade intelectual, a telemetria é inútil.' },
              { label: 'GENEROSIDADE', desc: 'Compartilhamento de conhecimento. A eficiência só escala quando o time cresce junto.' },
              { label: 'DISCIPLINA', desc: 'A execução impiedosa do método. Rigor científico em cada checklist, todos os dias.' },
            ].map((virtue, i) => (
              <motion.div 
                key={virtue.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-12 hover:bg-blue-50 transition-colors group cursor-default text-left"
              >
                <span className="text-blue-600 font-mono text-sm mb-4 block uppercase">Virtude 0{i+1}</span>
                <h3 className="text-4xl font-black uppercase mb-6 tracking-tighter group-hover:text-blue-700 transition-colors leading-none">{virtue.label}</h3>
                <p className="text-gray-600 text-lg leading-snug">{virtue.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-24 text-center"
          >
            <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter max-w-4xl mx-auto leading-none text-center">
              "O DONO QUER <span className="bg-blue-600 text-white px-4 inline-block transform -skew-x-12">PAZ</span>. A ADMINISTRATIVE ENTREGA SEGURANÇA."
            </p>
          </motion.div>
        </div>
      </section>

      {/* 5. ROADMAP (Vertical Timeline) */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <SectionHeading title="30 Dias para a Eficiência" subtitle="O roadmap crítico para transformar caos em lucratividade previsível." />
        
        <div className="relative border-l-2 border-blue-500/30 ml-4 md:ml-0 md:left-1/2">
          {ROADMAP.map((item, index) => (
            <motion.div
              key={item.day}
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              onViewportEnter={() => trackClick(`roadmap-${item.day}`, 'roadmap')}
              className={`relative mb-16 ${index % 2 === 0 ? 'md:left-8' : 'md:-left-full md:-ml-8'} pl-8 md:w-[48%]`}
            >
              <div className="absolute top-0 -left-[41px] md:left-auto md:right-[-41px] w-5 h-5 bg-blue-600 rounded-full border-4 border-[#0A0A0A] shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
              <div className="p-6 bg-[#111] border border-white/5 rounded-lg hover:border-blue-500/30 transition-all text-left">
                <span className="text-blue-500 font-mono font-bold mb-2 block uppercase">{"["} {item.day} {"]"}</span>
                <h4 className="text-2xl font-bold text-white mb-2 uppercase">{item.title}</h4>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI FLOATING CHAT */}
      <div className="fixed bottom-8 right-8 z-50">
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 right-0 w-[350px] bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 bg-blue-600 flex justify-between items-center text-left">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="font-bold uppercase text-xs tracking-tighter">Administrative Brain v1.2</span>
                </div>
                <button onClick={() => setShowChat(false)} className="text-white hover:opacity-70">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-80 p-4 overflow-y-auto space-y-4 text-sm scrollbar-hide flex flex-col">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-lg border max-w-[85%] text-left ${
                    msg.role === 'ai' 
                      ? 'bg-white/5 border-white/5 self-start text-gray-200' 
                      : 'bg-blue-600/20 border-blue-500/30 self-end text-blue-50'
                  }`}>
                    {msg.text}
                  </div>
                ))}
                {isChatLoading && (
                  <div className="bg-white/5 border border-white/5 p-3 rounded-lg self-start flex gap-2 items-center text-left">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> <span className="text-gray-400 text-xs uppercase">Analisando...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 border-t border-white/5 flex gap-2 bg-[#0A0A0A]">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Sua pergunta técnica..." 
                  className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button 
                  onClick={() => handleSendMessage()}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => { setShowChat(!showChat); trackClick('abrir-chat', 'floating'); }}
          className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 group"
        >
          <MessageSquare className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* 6. DIAGNOSIS MODAL (Multi-step Form) */}
      <AnimatePresence>
        {showDiagnosis && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDiagnosis(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 text-center"
            >
              <button onClick={() => setShowDiagnosis(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center">
                
                {formStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <span className="text-blue-500 font-mono text-sm mb-4 block uppercase tracking-tighter">PASSO 1 DE 3</span>
                    <h3 className="text-3xl font-black uppercase mb-8 text-center">Qual é o seu principal gargalo?</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {['Margem de Lucro Baixa', 'Falta de Processos', 'Equipe Desqualificada', 'Controle Financeiro Inexistente'].map((opt) => (
                        <button 
                          key={opt}
                          onClick={() => { setFormData({...formData, dor_principal: opt}); setFormStep(2); }}
                          className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-xl text-left hover:border-blue-500 hover:bg-blue-500/5 transition-all flex justify-between items-center group"
                        >
                          {opt} <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {formStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <span className="text-blue-500 font-mono text-sm mb-4 block uppercase tracking-tighter">PASSO 2 DE 3</span>
                    <h3 className="text-3xl font-black uppercase mb-8">Identificação</h3>
                    <div className="space-y-4 text-left">
                      <div>
                        <label className="text-sm font-bold text-gray-400 mb-1 block uppercase">Seu Nome</label>
                        <input 
                          type="text" 
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-left" 
                          placeholder="Digite seu nome"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-400 mb-1 block uppercase">Nome do Restaurante</label>
                        <input 
                          type="text" 
                          value={formData.restaurante}
                          onChange={(e) => setFormData({...formData, restaurante: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-left" 
                          placeholder="Ex: Cantina do Chef"
                        />
                      </div>
                      <div className="pt-4 flex gap-3">
                        <button onClick={() => setFormStep(1)} className="flex-1 py-3 px-4 border border-white/20 rounded-lg font-bold hover:bg-white/5 transition-colors uppercase text-sm">Voltar</button>
                        <button 
                          onClick={() => setFormStep(3)} 
                          disabled={!formData.nome || !formData.restaurante}
                          className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 disabled:opacity-50 transition-colors uppercase text-sm"
                        >
                          Avançar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {formStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <span className="text-blue-500 font-mono text-sm mb-4 block uppercase tracking-tighter">PASSO 3 DE 3</span>
                    <h3 className="text-3xl font-black uppercase mb-4 text-center">Processando Dados</h3>
                    <p className="text-gray-400 mb-8">Gerando seu score preliminar de eficiência operacional...</p>
                    
                    <button 
                      onClick={handleFormSubmit}
                      className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
                    >
                      Revelar Score de Eficiência <Zap className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}

                {formStep === 4 && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="w-24 h-24 bg-blue-600/20 border-2 border-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl font-black text-blue-500">{formData.score_eficiencia}</span>
                    </div>
                    <h3 className="text-3xl font-black uppercase mb-4 text-center">Eficiência Comprometida</h3>
                    <p className="text-gray-400 mb-8">Seu score de {formData.score_eficiencia}/100 indica vazamentos críticos em: <strong className="text-white uppercase">{formData.dor_principal}</strong>.</p>
                    
                    <a 
                      href={`https://wa.me/5511999999999?text=Olá, meu nome é ${formData.nome} do restaurante ${formData.restaurante}. Meu score de eficiência foi ${formData.score_eficiencia} e meu principal problema é ${formData.dor_principal}. Quero entender como a Administrative pode intervir.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 px-6 bg-green-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-green-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                    >
                      Falar com Especialista <MessageSquare className="w-5 h-5" />
                    </a>
                  </motion.div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="py-24 bg-[#050505] border-t border-white/5 text-center flex flex-col items-center gap-8">
        <img src={`${ASSETS.LOGO_VERTICAL}?${LOGO_VERSION}`} alt="Administrative Logo" className="h-32 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
        <div className="text-gray-600 text-xs font-mono uppercase tracking-[0.3em] text-center">
          © 2026 ADMINISTRATIVE - ESTADO DE EFICIÊNCIA. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </main>
  );
}
