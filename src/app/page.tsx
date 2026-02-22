"use client";

import React, { FC, useState, useRef, ReactNode, useEffect } from "react";
import { getStacks } from "@/src/modules/product_stacks/actions";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import Footer from "@/src/components/Footer";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/src/components/ui/sheet";
import { Menu, ArrowRight, Zap, Shield, BarChart3, Users, LogIn, Clock, Rocket, Plus } from "lucide-react";

// --- MAGNETIC WRAPPER COMPONENT ---
const MagneticWrapper = ({ children, strength = 0.5 }: { children: ReactNode, strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * strength);
    y.set((clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
};

// --- SCROLL REVEAL VARIANTS ---
const revealVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const App: FC = () => {
  const { scrollYProgress } = useScroll();
  
  const [stacks, setStacks] = useState<Array<{
    id: string;
    name: string;
    base_price: number;
    sub_stacks?: Array<{ name: string }>;
  }>>([]);

  useEffect(() => {
    async function loadStacks() {
      const data = await getStacks();
      const predictableStacks = data.filter(stack => 
        ["HR Stack", "Web Development Stack", "Custom Stack"].includes(stack.name)
      );
      setStacks(predictableStacks);
    }
    loadStacks();
  }, []);
  
  // High-fidelity background transitions
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const blobRotation = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <main className="min-h-screen bg-[#030303] text-white selection:bg-teal-500/30 overflow-x-hidden relative">
      
      {/* --- PREMIUM AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* SMALLER 15px Micro-Grid */}
        <motion.div 
          className="absolute inset-0 opacity-[0.12]" 
          style={{ 
            y: gridY,
            backgroundImage: `radial-gradient(circle, #ffffff 0.5px, transparent 0.5px)`,
            backgroundSize: '15px 15px' 
          }} 
        />
        <motion.div 
          style={{ rotate: blobRotation }}
          className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-teal-500/[0.08] blur-[160px] rounded-full" 
        />
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-purple-500/[0.05] blur-[160px] rounded-full" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.03] bg-[#030303]/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <MagneticWrapper strength={0.2}>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-5 h-5 bg-teal-500 rounded-sm shadow-[0_0_15px_rgba(20,184,166,0.4)]" />
              <span className="text-sm font-black tracking-[0.2em] uppercase">ShareDen</span>
            </div>
          </MagneticWrapper>

          <div className="hidden md:flex items-center gap-8 text-[10px] font-bold tracking-widest uppercase text-neutral-500">
            <a href="#stacks" className="hover:text-white transition-colors">The Stacks</a>
            <a href="#metrics" className="hover:text-white transition-colors">Metrics</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <div className="flex items-center gap-4">
               <a href="/login" className="flex items-center gap-1 hover:text-white transition-colors">
                 <LogIn className="h-3 w-3" /> LOGIN
               </a>
               <MagneticWrapper strength={0.3}>
                 <Button className="bg-white text-black hover:bg-neutral-200 rounded-none px-6 h-8 text-[9px] font-black">
                   REQUEST ACCESS
                 </Button>
               </MagneticWrapper>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 pt-32 pb-16 container mx-auto px-6">
        <div className="max-w-5xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={revealVariants}
          >
            <h1 className="text-6xl md:text-[9rem] font-black leading-[0.8] tracking-tighter mb-10">
              ELIMINATE <br />
              <span className="text-neutral-800 outline-text">FRICTION.</span>
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-neutral-500 font-light max-w-xl leading-tight"
          >
            Shareden is the operating system for founders who prioritize <span className="text-white">velocity over headcount.</span>
          </motion.p>
        </div>
      </section>

      {/* LOGO CLOUD */}
      <section className="relative z-10 py-16 border-y border-white/[0.03] bg-white/[0.01]">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-10">Trusted by developers and designers at</p>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700"
          >
            {['OpenAI', 'Apple', 'Vercel', 'Figma', 'Stripe', 'Notion', 'Cursor'].map((logo) => (
              <motion.span variants={revealVariants} key={logo} className="text-xl md:text-3xl font-bold tracking-tighter text-white">
                {logo}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* METRICS DASHBOARD */}
      <section id="metrics" className="relative z-10 py-24 bg-white/[0.01]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Avg. Completion", value: "2.4h", icon: Clock },
              { label: "Compliance Score", value: "100%", icon: Shield },
              { label: "Founder Hours Saved", value: "40+/mo", icon: Rocket }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center"
              >
                <stat.icon className="mx-auto mb-4 h-5 w-5 text-teal-500" />
                <div className="text-5xl font-black mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BENTO GRID */}
      <section id="stacks" className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <motion.div 
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            className="md:col-span-8 bg-white/[0.02] border border-white/[0.05] p-12 flex flex-col justify-between min-h-[400px]"
          >
            <h3 className="text-4xl font-bold tracking-tight">Everything you need <br/> to run, none of the <br/> management overhead.</h3>
            <div className="flex gap-4 border-t border-white/5 pt-8">
               <div className="flex flex-col">
                  <span className="text-teal-500 font-bold text-2xl tracking-tighter">48h</span>
                  <span className="text-[9px] text-neutral-500 uppercase tracking-widest">Setup Time</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-white font-bold text-2xl tracking-tighter">Instant</span>
                  <span className="text-[9px] text-neutral-500 uppercase tracking-widest">Operator Match</span>
               </div>
            </div>
          </motion.div>

          <motion.div 
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            className="md:col-span-4 bg-teal-500 p-12 text-black"
          >
            <MagneticWrapper strength={0.4}>
                <Zap className="h-12 w-12 mb-20" />
                <h4 className="text-4xl font-black tracking-tighter uppercase leading-none">Execution <br/>over advice.</h4>
            </MagneticWrapper>
          </motion.div>

          {[
            { icon: BarChart3, title: "Finance", color: "text-purple-400" },
            { icon: Shield, title: "Compliance", color: "text-teal-400" },
            { icon: Users, title: "People", color: "text-blue-400" },
          ].map((stack, i) => (
            <motion.div
              key={i}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ delay: i * 0.1 }}
              className="md:col-span-4 bg-white/[0.01] border border-white/[0.05] p-8 group cursor-crosshair"
            >
              <MagneticWrapper strength={0.25}>
                <stack.icon className={`${stack.color} mb-6 h-6 w-6`} />
                <h4 className="text-lg font-bold uppercase tracking-widest">{stack.title}</h4>
                <p className="text-neutral-500 text-xs mt-2 group-hover:text-white transition-colors">Automated workflows & expert oversight.</p>
              </MagneticWrapper>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative z-10 py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Predictable Stacks</h2>
          <p className="text-neutral-500 text-sm">No hourly billing. No overhead.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stacks.length > 0 ? stacks.map((stack) => (
            <motion.div 
              key={stack.id} 
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              whileHover={{ y: -5 }} 
              className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/10 flex flex-col"
            >
              <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-2">{stack.name}</h4>
              <div className="text-4xl font-black mb-8 tracking-tighter">
                {stack.base_price > 0 ? `₹${stack.base_price.toLocaleString()}` : "Custom"}
                <span className="text-xs text-neutral-700 ml-1">/MO</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {stack.sub_stacks?.map((sub, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs text-neutral-400">
                    <div className="w-1 h-1 rounded-full bg-teal-500" /> {sub.name}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-white text-black font-black text-[10px] tracking-widest h-12 rounded-none">SELECT STACK</Button>
            </motion.div>
          )) : (
            <div className="col-span-3 text-center py-12 text-neutral-500">
              Loading stacks...
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 py-24 container mx-auto px-6 max-w-3xl">
        <h2 className="text-2xl font-black mb-12 text-center uppercase tracking-widest">Protocol FAQ</h2>
        <div className="space-y-3">
          {[
            { q: "How is this different from a VA?", a: "VAs take tasks; our Operators take ownership. We don't ask you how to set up payroll; we execute the setup based on multi-state nexus logic." },
            { q: "Do you sign NDAs?", a: "Always. We handle sensitive financial and employee data for 50+ high-growth companies." },
            { q: "Can I cancel anytime?", a: "Yes. We operate on month-to-month memberships with zero lock-in contracts." }
          ].map((faq, i) => (
            <div key={i} className="p-6 bg-white/[0.01] border border-white/[0.05] hover:border-white/10 transition-colors">
              <h4 className="font-bold text-sm mb-2 flex justify-between items-center tracking-tight">
                {faq.q} <Plus className="h-3 w-3 text-teal-500" />
              </h4>
              <p className="text-neutral-500 text-xs leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL MAGNETIC CTA */}
      <section className="relative z-10 py-40 flex justify-center">
        <MagneticWrapper strength={0.6}>
          <button 
            className="group relative flex flex-col items-center justify-center w-72 h-72 rounded-full border border-white/10 hover:border-teal-500/50 transition-colors"
            onClick={() => window.location.href = "/register"}
          >
            <div className="absolute inset-0 rounded-full bg-teal-500/5 scale-0 group-hover:scale-100 transition-transform duration-500" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-2">Ready to deploy?</span>
            <span className="text-3xl font-black tracking-tighter">Start Stack</span>
            <ArrowRight className="mt-4 h-6 w-6 transform group-hover:translate-x-2 transition-transform" />
          </button>
        </MagneticWrapper>
      </section>

      <Footer />

      <style jsx>{`
        .outline-text {
          -webkit-text-stroke: 1px #222;
          color: transparent;
        }
      `}</style>
    </main>
  );
};

export default App;