"use client";

import { motion } from "framer-motion";
import { 
  Music, 
  Calendar, 
  DollarSign, 
  Users, 
  Package, 
  FileText, 
  ShieldCheck, 
  Monitor,
  CheckCircle2,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import Link from "next/link";
import { BandFlowIcon } from "@/components/bandflow-icon";

const allFeatures = [
  {
    title: "Gestão Financeira",
    description: "Controle absoluto de MRR, fluxo de caixa, pagamentos de cachês e análise de inadimplência em tempo real.",
    icon: DollarSign,
  },
  {
    title: "Shows & Logística",
    description: "Agenda centralizada com horários de load-in, passagem de som e o inovador Trip Manager para hotéis e voos.",
    icon: Calendar,
  },
  {
    title: "Contratos Automáticos",
    description: "Geração instantânea de contratos em PDF/DOCX a partir de templates mestres. Elimine erros manuais.",
    icon: FileText,
  },
  {
    title: "Setlists Dinâmicos",
    description: "Biblioteca completa de músicas com Tons, BPM, ISRC e criação automática de setlists para cada show.",
    icon: Music,
  },
  {
    title: "CRM de Vendas",
    description: "Pipeline de negociações (Vendas), histórico de clientes e base de dados de parceiros estratégicos.",
    icon: Users,
  },
  {
    title: "Patrimônio & Estoque",
    description: "Rastreio de equipamentos por número de série e gestão de estoque de merchandising integrado às vendas.",
    icon: Package,
  }
];

const plans = [
  {
    name: "Starter",
    price: "R$ 99,90",
    period: "/mês",
    description: "Para bandas em ascensão que precisam de organização profissional.",
    features: [
      "Até 5 membros",
      "Agenda de Shows",
      "Setlists & Repertório",
      "Contratos básicos",
      "Suporte por e-mail",
    ],
    cta: "Começar Agora",
    highlight: false,
  },
  {
    name: "Pro",
    price: "R$ 199,90",
    period: "/mês",
    description: "Para artistas e bandas em turnê que precisam de controle total.",
    features: [
      "Membros ilimitados",
      "Tudo do Starter +",
      "Gestão Financeira completa",
      "Trip Manager (hotéis/voos)",
      "Technical Rider & Stage Plot",
      "Estoque & Merch",
      "Suporte prioritário",
    ],
    cta: "Assinar Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    description: "Para grandes produções e selos com múltiplas bandas e equipes.",
    features: [
      "Múltiplas bandas",
      "Tudo do Pro +",
      "Dashboard administrativo",
      "Integrações customizadas",
      "Onboarding dedicado",
      "SLA garantido",
    ],
    cta: "Falar com Consultor",
    highlight: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ccff00] selection:text-black font-body overflow-x-hidden selection:rounded-none">
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] noise-layer" />

      {/* Nav */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-4">
            <BandFlowIcon className="w-16 h-16" />
            <span className="text-3xl font-black tracking-tighter uppercase font-heading leading-none text-white">
              Band<span className="text-[#ccff00]">Flow</span>
            </span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-12 text-[10px] uppercase tracking-[0.4em] font-black">
            <a href="#vision" className="hover:text-[#ccff00] transition-colors">A Visão</a>
            <a href="#features" className="hover:text-[#ccff00] transition-colors">O Sistema</a>
            <a href="#pricing" className="hover:text-[#ccff00] transition-colors">Planos</a>
          </nav>

          <div className="flex items-center gap-8">
            <Link href="/login" className="text-[10px] uppercase tracking-[0.4em] font-black hover:text-[#ccff00] transition-colors">
              Acessar Painel
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-3 bg-[#ccff00] text-black text-[10px] font-black tracking-[0.3em] uppercase rounded-none hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.1)]"
            >
              Criar Conta AGORA
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section id="vision" className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-40 px-8">
          {/* Background Visual */}
          <div className="absolute inset-0 z-0">
             <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(204,255,0,0.1)_0%,transparent_60%)]" />
             <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 text-center max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center gap-4 mb-16"
            >
               <span className="w-10 h-px bg-zinc-800" />
               <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#ccff00]">Infraestrutura de Elite para Música</span>
               <span className="w-10 h-px bg-zinc-800" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "circOut" }}
              className="text-[12vw] lg:text-[10vw] font-black leading-[0.8] tracking-[-0.05em] uppercase font-heading mb-16"
            >
               Domine <br />O <span className="text-zinc-600">Negócio</span><span className="text-[#ccff00]">.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-500 font-medium leading-relaxed mb-20 uppercase tracking-tight"
            >
              Profissionalize sua banda com o centro de comando definitivo para administrativo, logística e operações. O sistema construído para a vida na estrada.
            </motion.p>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.8 }}
               className="flex flex-col sm:flex-row items-center justify-center gap-8"
            >
               <Link href="/login" className="w-full sm:w-auto px-16 py-6 bg-[#ccff00] text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.15)] active:scale-95">
                 Começar Agora
               </Link>
               <a href="#features" className="w-full sm:w-auto px-16 py-6 bg-transparent border border-white/10 text-white text-[12px] font-black uppercase tracking-[0.4em] hover:bg-white/5 transition-all text-center">
                 Ver o Sistema
               </a>
            </motion.div>
          </div>

          <div className="absolute bottom-12 left-12 hidden lg:flex flex-col gap-2">
             <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
                <span className="w-2 h-2 rounded-full bg-zinc-800" />
                <span className="w-2 h-2 rounded-full bg-zinc-800" />
             </div>
             <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700">Sistema Ativo: Acesso Seguro</span>
          </div>
        </section>

        {/* ECOSYSTEM GRID */}
        <section id="features" className="py-40 bg-[#0a0a0a] border-t border-white/5 px-8">
            <div className="max-w-7xl mx-auto mb-24">
                <span className="text-[#ccff00] font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">O Ecossistema Completo</span>
                <h2 className="text-5xl lg:text-8xl font-black font-heading leading-tight uppercase tracking-tighter text-white">GESTÃO 360º DA <br />SUA CARREIRA.</h2>
            </div>
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {allFeatures.map((f, i) => (
                    <div key={f.title} className="p-12 border border-white/5 hover:bg-zinc-900 transition-colors group relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                           <f.icon className="w-16 h-16" />
                        </div>
                        <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-6 block">Módulo {i+1}</span>
                        <h3 className="text-2xl font-black font-heading uppercase tracking-tighter mb-4 text-white group-hover:text-[#ccff00] transition-colors">{f.title}</h3>
                        <p className="text-zinc-500 font-bold text-xs uppercase tracking-tight leading-relaxed">
                            {f.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>

        {/* DASHBOARD PREVIEW */}
        <section className="py-40 px-8 max-w-7xl mx-auto border-t border-white/5">
            <div className="grid lg:grid-cols-12 gap-24 items-center">
                <div className="lg:col-span-5 space-y-12">
                   <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ccff00] mb-6 block">Gerenciamento Profissional</span>
                        <h2 className="text-5xl lg:text-7xl font-black font-heading uppercase leading-[0.9] tracking-tighter text-white">
                           Central de <br />Alta <br />Performance <span className="text-zinc-800">Geral</span>
                        </h2>
                   </div>
                   <p className="text-zinc-500 font-bold text-sm uppercase leading-relaxed max-w-md">
                      Integramos cada aspecto do mercado musical em um ambiente unificado. Da nota fiscal ao show, tudo sob controle.
                   </p>
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <Monitor className="w-6 h-6 text-[#ccff00]" />
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Sincronização Total</h4>
                         <p className="text-[8px] font-bold text-zinc-600 uppercase">Arquitetura nativa para acesso de toda a equipe.</p>
                      </div>
                      <div className="space-y-4">
                         <ShieldCheck className="w-6 h-6 text-zinc-600" />
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Segurança Total</h4>
                         <p className="text-[8px] font-bold text-zinc-600 uppercase">Criptografia de dados financeiros e contratuais.</p>
                      </div>
                   </div>
                   <Link href="/login" className="inline-block px-12 py-5 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-colors">
                      Acessar o Painel →
                   </Link>
                </div>

                <div className="lg:col-span-7 bg-zinc-950 border border-white/10 p-12 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-[#ccff00]/5 pointer-events-none" />
                   <div className="flex items-center gap-2 mb-12 opacity-30">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                   </div>
                   
                   <div className="space-y-12">
                      <div className="flex items-end justify-between border-b border-white/5 pb-4">
                         <div className="space-y-2">
                            <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Receita Mensal</span>
                            <div className="h-6 w-48 bg-zinc-900 border border-white/5">
                               <div className="h-full bg-[#ccff00] w-[78%] animate-pulse" />
                            </div>
                         </div>
                         <span className="text-xl font-black font-heading text-white">78% DA META</span>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                         <div className="bg-zinc-900/50 border border-white/5 p-6 space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-600">
                               <span>Usuários Ativos</span>
                               <span className="text-[#ccff00]">+24</span>
                            </div>
                            <div className="h-1 w-full bg-zinc-950">
                               <div className="h-full bg-[#ccff00] w-full" />
                            </div>
                         </div>
                         <div className="bg-zinc-900/50 border border-white/5 p-6 space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-600">
                               <span>Inadimplência</span>
                               <span className="text-zinc-800">4.2%</span>
                            </div>
                            <div className="h-1 w-full bg-zinc-950">
                               <div className="h-full bg-zinc-800 w-[15%]" />
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="absolute inset-0 flex items-center justify-center p-12 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <Link href="/login" className="px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#ccff00] transition-colors">
                         Simular Ambiente Real
                      </Link>
                   </div>
                </div>
            </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-40 px-8 bg-zinc-950 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-24 text-center">
              <span className="text-[#ccff00] font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Planos e Preços</span>
              <h2 className="text-5xl lg:text-7xl font-black font-heading leading-tight uppercase tracking-tighter text-white">
                ESCOLHA SEU<br /><span className="text-zinc-700">NÍVEL.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`p-12 border flex flex-col ${
                    plan.highlight
                      ? "border-[#ccff00] bg-[#ccff00]/5"
                      : "border-white/5 bg-zinc-900/20"
                  }`}
                >
                  {plan.highlight && (
                    <span className="text-[8px] font-black uppercase tracking-[0.5em] text-[#ccff00] border border-[#ccff00] px-3 py-1 w-fit mb-8">
                      MAIS POPULAR
                    </span>
                  )}
                  <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 mb-4">{plan.name}</h3>
                  <div className="flex items-end gap-1 mb-6">
                    <span className={`text-5xl font-black font-heading ${plan.highlight ? "text-[#ccff00]" : "text-white"}`}>
                      {plan.price}
                    </span>
                    {plan.period && <span className="text-zinc-600 font-black text-sm mb-2">{plan.period}</span>}
                  </div>
                  <p className="text-zinc-600 text-xs font-bold uppercase tracking-tight mb-10">{plan.description}</p>
                  <ul className="space-y-4 mb-12 flex-1">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-[#ccff00]" : "text-zinc-600"}`} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  {plan.name === "Enterprise" ? (
                    <a
                      href="https://wa.me/5511999999999?text=Olá,%20tenho%20interesse%20no%20plano%20Enterprise%20do%20BandFlow."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-5 bg-transparent border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:border-[#ccff00] hover:text-[#ccff00] transition-all text-center block"
                    >
                      {plan.cta}
                    </a>
                  ) : (
                    <Link
                      href="/login"
                      className={`py-5 text-[10px] font-black uppercase tracking-[0.3em] text-center block transition-all ${
                        plan.highlight
                          ? "bg-[#ccff00] text-black hover:bg-white"
                          : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-60 px-8 relative overflow-hidden bg-[#ccff00] text-black">
             <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-black to-transparent opacity-20" />
             <div className="max-w-7xl mx-auto text-center relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[1em] mb-12 block text-black/40">Pronto para Começar</span>
                <h2 className="text-[12vw] lg:text-[10vw] font-black font-heading leading-tight uppercase tracking-[-0.05em] mb-20">
                   PREPARADO PARA <br />ESCALAR <br /><span className="text-black opacity-30">SUA CARREIRA?</span>
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                   <Link href="/login" className="w-full md:w-auto px-20 py-8 bg-black text-[#ccff00] text-[12px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-3xl">
                      Criar Minha Conta Agora
                   </Link>
                   <a
                     href="https://wa.me/5511999999999?text=Olá,%20quero%20saber%20mais%20sobre%20o%20BandFlow."
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex flex-col items-start text-left group cursor-pointer"
                   >
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] mb-2">Implementação Imediata</span>
                      <span className="text-xl font-black font-heading tracking-tight underline group-hover:opacity-70 transition-opacity">FALAR COM CONSULTOR</span>
                   </a>
                </div>
             </div>
        </section>
      </main>

      <footer className="py-40 bg-[#0a0a0a] px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="md:col-span-2 space-y-12">
            <div className="flex items-center gap-8">
              <BandFlowIcon className="w-40 h-40" />
              <span className="text-4xl font-black tracking-tighter uppercase font-heading block text-white">
                Band<span className="text-[#ccff00]">Flow</span>
              </span>
            </div>
            <p className="max-w-sm text-zinc-500 font-bold text-sm uppercase tracking-tight leading-relaxed">
               A infraestrutura de inteligência para a nova economia da música ao vivo. Gestão profissional em escala industrial.
            </p>
            <div className="flex gap-4">
               {[
                 { icon: Instagram, href: "#", name: "Instagram" },
                 { icon: Twitter, href: "#", name: "Twitter" },
                 { icon: Linkedin, href: "#", name: "LinkedIn" },
               ].map((social) => (
                 <a 
                   key={social.name}
                   href={social.href} 
                   className="w-14 h-14 bg-zinc-900 border border-white/5 flex items-center justify-center hover:border-[#ccff00] hover:bg-[#ccff00]/10 transition-all cursor-pointer group"
                   title={social.name}
                 >
                    <social.icon className="w-5 h-5 text-zinc-600 group-hover:text-[#ccff00]" />
                 </a>
               ))}
            </div>
          </div>
          
          <div className="space-y-12">
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">Plataforma</h5>
            <ul className="space-y-6 text-[10px] font-black uppercase tracking-widest text-zinc-700">
                <li><a href="#features" className="hover:text-white transition-colors">O Sistema</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Planos</a></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Acessar Painel</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Criar Conta</Link></li>
            </ul>
          </div>

          <div className="space-y-12">
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">Contato</h5>
            <ul className="space-y-6 text-[10px] font-black uppercase tracking-widest text-zinc-700">
                <li>
                  <a
                    href="https://wa.me/5511999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href="mailto:contato@bandflow.com.br" className="hover:text-white transition-colors">
                    E-mail
                  </a>
                </li>
                <li><a href="#vision" className="hover:text-white transition-colors">A Visão</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-40 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-800">© 2026 BANDFLOW — MADE IN BRAZIL</p>
            <div className="flex gap-8 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />
                <span className="text-[8px] font-black uppercase tracking-[0.5em] text-[#ccff00]/30">Sistemas de Gestão Profissional</span>
            </div>
        </div>
      </footer>
    </div>
  );
}
