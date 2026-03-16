'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Utensils,
  Zap,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  X
} from 'lucide-react';
import { trackClick } from '../lib/supabaseClient';
import { ASSETS } from '../lib/assets';
import IERSection from './components/IERSection';

// --- DATA & COPY ---

const SYSTEMS = [
  {
    id: 'financeiro',
    title: '1 — DOMINÂNCIA FINANCEIRA',
    description: 'Controle absoluto da saúde financeira do restaurante. Implementamos engenharia de DRE, auditoria de custos e controle de CMV.',
    points: ['Engenharia de DRE', 'Auditoria de custos', 'Controle de CMV', 'Leitura estratégica', 'Protocolos de margem'],
    goal: 'Reter o máximo lucro na operação.',
    icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
  },
  {
    id: 'pessoas',
    title: '2 — ENGENHARIA DE EQUIPE',
    description: 'Equipe não é custo. Equipe é sistema de produção de resultado. Estruturamos liderança e disciplina científica.',
    points: ['Liderança operacional', 'Protocolos de disciplina', 'Treinamento de performance', 'Estrutura de funções'],
    goal: 'Transformar equipe em operadores de eficiência.',
    icon: <Users className="w-6 h-6 text-blue-500" />,
  },
  {
    id: 'produto',
    title: '3 — ENGENHARIA DE CARDÁPIO',
    description: 'Cardápio é o principal motor de lucro. Analisamos margem por prato, engenharia de vendas e desperdício.',
    points: ['Margem por prato', 'Engenharia de vendas', 'Desperdício zero', 'Estrutura de produção'],
    goal: 'Maximizar lucro por prato.',
    icon: <Utensils className="w-6 h-6 text-blue-500" />,
  },
  {
    id: 'vendas',
    title: '4 — MÁQUINA DE AQUISIÇÃO',
    description: 'Não basta vender. É preciso vender com previsibilidade. Implementamos funis de marketing orientados por dados.',
    points: ['Aquisição estratégica', 'Funis de marketing', 'Campanhas por dados', 'Análise de retorno real'],
    goal: 'Crescer faturamento com ROI controlado.',
    icon: <Zap className="w-6 h-6 text-blue-500" />,
  },
  {
    id: 'operacoes',
    title: '5 — BLINDAGEM OPERACIONAL',
    description: 'Restaurantes quebram quando dependem de pessoas. Criamos checklists vivos e processos padronizados.',
    points: ['Checklists vivos', 'Processos padronizados', 'Auditoria operacional', 'Cultura de execução'],
    goal: 'Garantir operação livre do dono.',
    icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
  },
];

const LOGO_VERSION = 'v=1.1';

export default function AdministrativeLanding() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const [formStatus, setFormStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = {
      empresa: formData.get('empresa'),
      nome: formData.get('nome'),
      whatsapp: formData.get('whatsapp'),
      mensagem: formData.get('mensagem'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setFormStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setFormStatus('error');
      }
    } catch (err) {
      setFormStatus('error');
    }
  };

  const handleCTA = (id: string, section: string) => {
    trackClick(id, section);
    // Scroll to IERSection
    const ierSection = document.getElementById('ier-diagnostico');
    if (ierSection) {
      ierSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-blue-500 selection:text-white overflow-x-hidden pt-16">

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-black/60 backdrop-blur-xl px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <img src={`${ASSETS.LOGO_HORIZONTAL}?${LOGO_VERSION}`} alt="Administrative Logo" className="h-10 md:h-14 w-auto object-contain" />
          <div className="hidden md:flex gap-6 text-[10px] font-mono uppercase tracking-widest text-gray-400">
            <a href="#metodologia" className="hover:text-blue-500 transition-colors">Metodologia</a>
            <a href="#solucao" className="hover:text-blue-500 transition-colors">Solução</a>
          </div>
          <button
            onClick={() => handleCTA('navbar-cta', 'navbar')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase rounded transition-all"
          >
            Diagnóstico
          </button>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-start px-4 md:px-16 overflow-hidden border-b border-white/5 pb-20">
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 767px)" srcSet={ASSETS.HERO_MOBILE} />
            <img
              src={ASSETS.HERO_DESKTOP}
              alt="Administrative Background"
              className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
            />
          </picture>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_20%_50%,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent z-[1]"
        />

        <div className="max-w-3xl z-10 text-left relative mt-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-[0.9] mb-6">
              Seu restaurante não precisa de mais esforço.<br />
              <span className="text-blue-500 italic">Precisa de Performance.</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-xl mb-8 font-medium leading-tight border-l-2 border-blue-600 pl-4">
              A Administrative instala no seu restaurante um escritório de performance para aumentar margem, eficiência e previsibilidade.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleCTA('hero-cta', 'hero')}
                className="w-fit px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-sm uppercase transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
              >
                Diagnosticar Operação <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-blue-400 font-mono text-[10px] uppercase tracking-widest animate-pulse">
                {">>>"} Descubra onde sua operação perde dinheiro.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. DIAGNÓSTICO IER (MOVED HERE) */}
      <div id="ier-diagnostico" className="bg-[#050505] -mt-10 relative z-20">
        <IERSection />
      </div>

      {/* 3 & 4. O PROBLEMA & A VERDADE */}
      <section className="py-20 px-4 bg-[#050505]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <span className="text-red-500 font-mono text-[10px] uppercase tracking-widest mb-4 block">A Causa</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
              Falta de clientes não quebra.<br />
              <span className="text-red-500">Falta de performance sim.</span>
            </h2>
            <div className="space-y-4 text-gray-400 text-sm">
              <p>Tem proprietário achando que o negócio é ruim, ja tentou e continua com estes sintomas:</p>
              <ul className="grid grid-cols-1 gap-4 border-l border-white/10 pl-4">
                {[
                  'Têm uma ideia aproximada do lucro da operação, mas nunca conseguem enxergar com clareza onde o dinheiro realmente se perde.',
                  'Sabem a teoria do controle de CMV, mas nunca conseguiram transformar isso em um processo natural dentro da operação.',
                  'Tentam implantar controles e processos constantemente, mas eles desaparecem com a rotatividade da equipe e viram números que não mudam a realidade.',
                  'Acompanham dashboards e relatórios genéricos, mas deixam de enxergar as áreas chaves do restaurante que realmente determinam o resultado.',
                  'Testam benefícios e incentivos para motivar colaboradores, mas nunca medem o impacto real disso na produtividade e no resultado da operação.'
                ].map((i, idx) => (
                  <li key={idx} className="text-white font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                    <span className="text-red-500 mr-2">—</span>{i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-[#111] p-8 rounded-xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <BarChart3 className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-black uppercase mb-4 tracking-tighter">A Ilusão do Dono</h3>
            <div className="text-gray-400 text-[11px] mb-6 leading-relaxed italic uppercase tracking-wider space-y-4 whitespace-pre-line">
              {`É uma ilusão acreditar que os restaurantes de amanhã funcionarão como os de ontem.

As pessoas não vão parar de comer fora.
Mas a forma de fazer restaurante mudou.

Durante anos, o mercado acreditou que diferenciação vinha de:

experiência,
ambiente instagramável,
embalagens criativas,
técnicas de atendimento,
gourmetização de pratos.

Hoje tudo isso está acessível para qualquer restaurante.

Não diferencia mais.

Controle de CMV, treinamentos, POPs, checklists e processos também deixaram de ser diferenciais.
Esses conceitos chegaram a todos os nichos porque a necessidade de gestão se tornou inevitável.

Se você ainda está tentando aprender isso agora, na prática você está apenas correndo atrás do restante do mercado.

O problema é outro.

Sem gestão de performance, sua margem desaparece silenciosamente:

em um quadro de funcionários maior do que o necessário,
em um desperdício que passou despercebido este mês,
em um estoque vencido por falta de PVPS,
ou em processos que existem no papel mas não funcionam no dia a dia.

`}
            </div>
            <div className="pt-4 border-t border-white/5">
              <p className="text-sm font-black uppercase tracking-tighter text-red-500">Quem cuida da performance cresce.
                Quem não cuida, trabalha mais para ganhar menos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. A SOLUÇÃO */}
      <section id="solucao" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-blue-500 font-mono text-[10px] uppercase tracking-widest mb-4 block">A Solução</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
            A Administrative é o <span className="text-blue-500">Departamento de Performance.</span>
          </h2>
          <p className="text-base md:text-lg text-gray-400 mb-8 leading-snug italic">
            Somos um escritório externo dedicado a monitorar e melhorar o desempenho da sua operação. Nosso trabalho é garantir que cada parte opere no máximo potencial.
          </p>
          <div className="flex flex-col items-center justify-center pt-8 border-t border-white/10">
            <p className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none mb-4">
              Transformar seu restaurante em um negócio controlado por indicadores e <span className="text-blue-500">orientado por performance.</span>
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Financeiro', 'Operacional', 'Equipe', 'Tecnologia'].map(item => (
                <div key={item} className="flex items-center gap-2 text-white font-bold uppercase text-[10px] tracking-widest bg-white/5 px-3 py-1 rounded">
                  <CheckCircle2 className="w-3 h-3 text-blue-500" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. PERFORMANCE AS A SERVICE (Comparativo) */}
      <section className="py-20 px-4 bg-white text-[#0A0A0A]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-3 leading-none">Performance não é consultoria.</h2>
            <p className="text-lg font-bold uppercase text-blue-600 tracking-widest italic">É operação contínua.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 shadow-xl text-sm">
            <div className="bg-gray-50 p-8">
              <h3 className="text-base font-mono text-gray-400 mb-6 uppercase tracking-[0.2em]">Consultoria Tradicional</h3>
              <ul className="space-y-4">
                {[
                  'Relatórios e apresentações',
                  'Recomendações teóricas',
                  'Reuniões esporádicas',
                  'Pouca execução',
                  'Nenhuma responsabilidade pelo lucro'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-500 font-medium line-through">
                    <X className="w-4 h-4 text-red-500 shrink-0" /> <span className="uppercase text-[10px] tracking-widest">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-600 p-8 text-white">
              <h3 className="text-base font-mono text-blue-200 mb-6 uppercase tracking-[0.2em]">Performance como Serviço</h3>
              <ul className="space-y-6">
                {[
                  { title: 'Intervenção direta nos processos que impactam margem', desc: 'Não apontamos problemas. Atuamos na causa deles.' },
                  { title: 'Implantação de sistemas de inteligência operacional', desc: 'Processos, dados e rotinas organizados para gerar decisões melhores.' },
                  { title: 'Construção de estados de eficiência no negócio', desc: 'Cada melhoria vira um novo padrão operacional mensurável.' },
                  { title: 'Execução, auditoria e evolução contínua', desc: 'Planejar, implantar, medir, corrigir e evoluir — constantemente.' },
                  { title: 'Responsabilidade real pela performance da operação', desc: 'Nosso trabalho só existe se os indicadores do restaurante melhorarem.' }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-black uppercase text-[10px] tracking-widest mb-1 leading-tight">{item.title}</span>
                      <span className="block text-[10px] text-blue-100 italic leading-tight font-medium">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. OS 5 SISTEMAS DE PERFORMANCE */}
      <section id="metodologia" className="py-20 px-4 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-none">Os 5 Sistemas de Performance</h2>
            <p className="text-gray-400 text-sm italic">As engrenagens que ativamos para blindar a sua margem.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SYSTEMS.map((system) => (
              <div key={system.id} className="p-6 bg-[#111] border border-white/5 rounded-xl hover:border-blue-500/30 transition-all flex flex-col">
                <div className="mb-4">{system.icon}</div>
                <h3 className="text-base font-black uppercase tracking-tight mb-2">{system.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">{system.description}</p>
                <div className="space-y-1 mb-4 flex-1">
                  {system.points.map(p => (
                    <div key={p} className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500">
                      <div className="w-1 h-1 bg-blue-500" /> {p}
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/5">
                  <p className="text-blue-500 font-bold uppercase text-[10px] tracking-widest">Meta: {system.goal}</p>
                </div>
              </div>
            ))}

            {/* Telemetria Card */}
            <div className="p-6 bg-blue-600 rounded-xl flex flex-col justify-center lg:col-span-1">
              <span className="text-blue-200 font-mono text-[10px] uppercase tracking-[0.3em] block mb-2">Apoio</span>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 leading-none">Telemetria Viva</h3>
              <p className="text-blue-100 text-xs italic mb-6">Monitoramento contínuo da operação para embasar nossa inteligência de intervenção.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-4 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Zap className="w-48 h-48" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-[0.9] text-white">
              Pare de operar no escuro.<br />
              <span className="text-black italic">Opere com inteligência.</span>
            </h2>
            <button
              onClick={() => handleCTA('final-cta', 'footer')}
              className="px-8 py-4 bg-black text-white font-black uppercase text-base rounded hover:scale-105 transition-transform shadow-xl"
            >
              Iniciar Diagnóstico
            </button>
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="py-20 px-4 bg-[#050505] border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <span className="text-blue-500 font-mono text-[10px] uppercase tracking-widest mb-4 block">Contato</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
                Pronto para o <span className="text-blue-500">Próximo Nível?</span>
              </h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed italic">
                Deixe seus dados e nossa equipe de performance entrará em contato para agendar seu diagnóstico de eficiência.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-500 font-mono text-[10px] uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Balneário Camboriú — SC
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">Empresa</label>
                  <input required name="empresa" type="text" className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors text-white" placeholder="NOME DO SEU RESTAURANTE" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">Seu Nome</label>
                  <input required name="nome" type="text" className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors text-white" placeholder="COMO PODEMOS TE CHAMAR?" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">WhatsApp</label>
                  <input required name="whatsapp" type="tel" className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors text-white" placeholder="(00) 0 0000-0000" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">Mensagem</label>
                  <textarea required name="mensagem" rows={4} className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors text-white resize-none" placeholder="COMO A ADMINISTRATIVE PODE AJUDAR HOJE?"></textarea>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={formStatus === 'loading'}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white font-black uppercase text-xs tracking-[0.2em] rounded transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
              >
                {formStatus === 'loading' ? 'Enviando...' : 'Enviar Solicitação'}
              </button>

              {formStatus === 'success' && (
                <p className="text-green-500 text-[10px] font-mono uppercase text-center mt-2">Mensagem enviada com sucesso!</p>
              )}
              {formStatus === 'error' && (
                <p className="text-red-500 text-[10px] font-mono uppercase text-center mt-2">Erro ao enviar. Tente novamente.</p>
              )}
            </form>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-black text-center flex flex-col items-center gap-6">
        <img src={`${ASSETS.LOGO_VERTICAL}?${LOGO_VERSION}`} alt="Administrative Logo" className="h-16 w-auto object-contain grayscale opacity-30" />
        <div className="space-y-2">
          <p className="text-gray-400 font-black text-lg uppercase tracking-tighter italic leading-none">Administrative BI Ltda.</p>
          <div className="text-gray-600 text-[9px] font-mono uppercase tracking-[0.2em]">
            CNPJ: 59.526.646/0001-50 — Balneário Camboriú/SC
          </div>
          <div className="text-gray-700 text-[8px] font-mono uppercase tracking-[0.3em] pt-2">
            Estado de Eficiência para Restaurantes
          </div>
        </div>
        <div className="text-gray-800 text-[8px] font-mono uppercase tracking-[0.1em] mt-4">
          © 2026 ADMINISTRATIVE - ALL RIGHTS RESERVED.
        </div>
      </footer>
    </main>
  );
}