"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Button } from "@/src/components/ui/button";
import { 
  MessageSquare, 
  Command, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Cpu,
  MousePointer2,
  Box,
  Activity,
  ChevronRight
} from "lucide-react";

const AetherShadowSpace: FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
    let shadowGroup: THREE.Group;
    let mainLight: THREE.PointLight;
    let rimLight: THREE.PointLight;
    let targetScrollY = 0;
    let currentScrollY = 0;

    const init3D = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 18;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

      shadowGroup = new THREE.Group();
      scene.add(shadowGroup);

      const geometry = new THREE.BoxGeometry(10, 0.15, 5);
      
      for (let i = 0; i < 25; i++) {
        const material = new THREE.MeshStandardMaterial({
          color: 0x050505,
          roughness: 0.9,
          metalness: 0.1,
          transparent: true,
          opacity: 0.9
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = (i - 12) * 0.6;
        mesh.userData = { 
          baseY: mesh.position.y,
          offset: Math.random() * 10 
        };
        shadowGroup.add(mesh);
      }

      mainLight = new THREE.PointLight(0x3b82f6, 500, 50); 
      scene.add(mainLight);

      rimLight = new THREE.PointLight(0x8b5cf6, 300, 40);
      scene.add(rimLight);

      const ambient = new THREE.AmbientLight(0xffffff, 0.05);
      scene.add(ambient);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      
      currentScrollY += (targetScrollY - currentScrollY) * 0.07;
      const time = Date.now() * 0.001;

      mainLight.position.x = Math.sin(time * 0.5) * 12;
      mainLight.position.y = Math.cos(time * 0.3) * 10;
      mainLight.position.z = 5;

      rimLight.position.x = Math.cos(time * 0.4) * -12;
      rimLight.position.y = Math.sin(time * 0.6) * 8;

      shadowGroup.children.forEach((mesh: any, i) => {
        const scrollGap = currentScrollY * 25;
        mesh.position.y = mesh.userData.baseY + (i - 12) * scrollGap;
        mesh.rotation.y = Math.sin(time * 0.2 + i * 0.1) * 0.1 + (currentScrollY * 3);
        mesh.rotation.x = currentScrollY * 2;
        mesh.position.x = Math.sin(time + mesh.userData.offset) * 0.2;
      });

      renderer.render(scene, camera);
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    init3D();
    animate();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#020203] text-zinc-400 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-blue-600/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-purple-600/5 rounded-full blur-[160px]" />
      </div>

      <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />

      <nav className="fixed top-0 left-0 w-full z-50 px-10 h-24 flex items-center justify-between border-b border-white/[0.03] backdrop-blur-xl bg-black/20">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center group-hover:border-blue-500 transition-colors">
            <Command className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold tracking-[0.3em] uppercase text-sm">Aether.OS</span>
        </div>
        <div className="flex gap-10 items-center">
          <div className="hidden lg:flex gap-8 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Architecture</a>
            <a href="#" className="hover:text-white transition-colors">Shadow Engine</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <Button variant="outline" className="rounded-none border-zinc-800 bg-transparent hover:bg-white hover:text-black px-8 py-6 uppercase tracking-tighter font-bold transition-all">
            Terminal Access
          </Button>
        </div>
      </nav>

      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col justify-center px-10 max-w-7xl mx-auto">
          <div className="max-w-3xl space-y-8">
            <div className="flex items-center gap-4 text-blue-500">
                <div className="h-[1px] w-12 bg-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Integrated Intelligence</span>
            </div>
            <h1 className="text-7xl lg:text-[140px] font-bold text-white tracking-tightest leading-[0.8]">
              Dark <br/> <span className="text-zinc-800">Matter.</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-500 max-w-xl font-light leading-relaxed">
              Experience a UI that exists in the periphery. Subtle, deep, and powered by <span className="text-white">gradient-mapped</span> light data.
            </p>
            <div className="flex flex-wrap gap-5 pt-10">
              <Button className="h-16 px-12 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform">Initialize Deployment</Button>
              <Button variant="ghost" className="h-16 px-12 text-zinc-400 border border-zinc-800 rounded-full font-bold hover:bg-zinc-900">View Source</Button>
            </div>
          </div>
        </section>

        {/* --- NEW SECTION: TRUSTED BY & COLLABORATION --- */}
        <section className="py-32 px-10 bg-[#f9f7f2] text-[#1a1a1a]">
          <div className="max-w-7xl mx-auto text-center space-y-20">
            
            {/* LOGO GRID */}
            <div className="space-y-12">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900">
                Trusted by 300K+ businesses worldwide
              </h2>
              
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { name: "TAFE", color: "text-red-600" },
                  { name: "BLUE STAR", color: "text-blue-800" },
                  { name: "Joyalukkas", color: "text-rose-900" },
                  { name: "hotstar", color: "text-black" },
                  { name: "IIFL", color: "text-orange-600" },
                  { name: "Mercedes", color: "text-black" }
                ].map((logo, idx) => (
                  <div 
                    key={idx}
                    className="bg-white px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-black/5 flex items-center justify-center min-w-[160px] hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <span className={`font-black text-xl italic tracking-tighter ${logo.color}`}>
                      {logo.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* COLLABORATION TEXT */}
            <div className="max-w-4xl mx-auto space-y-10 pt-10">
              <h2 className="text-5xl md:text-7xl font-bold text-[#1e60ff] leading-[1.1] tracking-tight">
                Teams that work together, win together
              </h2>
              <p className="text-lg md:text-xl text-zinc-600 max-w-3xl mx-auto leading-relaxed font-medium">
                Multiple teams come together with sales to close deals. With Aether for Everyone, you can build unique, collaborative spaces for each team — all with some AI assistance, of course. Start winning more, together.
              </p>
              <div className="flex justify-center">
                <a 
                  href="#" 
                  className="flex items-center gap-2 text-[#1e60ff] font-bold text-lg group hover:underline underline-offset-8"
                >
                  Learn more
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>


          </div>




        </section>

{/* --- TESTIMONIAL SECTION --- */}
        <section className="py-32 px-10 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  logo: "AGAPPE",
                  quote: "Aether OS offers us technology that allows us to be more proactive and insight-driven. Our productivity is up by 80% in the last year.",
                  author: "Thomas John",
                  role: "Managing Director, Agappe",
                  img: "https://i.pravatar.cc/150?u=thomas"
                },
                {
                  logo: "SIMPLIFY9",
                  quote: "Aether for Everyone is incredibly user-friendly. The reporting tools were a standout, providing clear insights that helped us make decisions.",
                  author: "Samer Zughul",
                  role: "Managing Partner, Simplify9",
                  img: "https://i.pravatar.cc/150?u=samer"
                },
                {
                  logo: "MINOR HOTELS",
                  quote: "Aether helped us automate our processes after we implemented workflow rules. Privacy and security are essential, and Zoho addressed it all.",
                  author: "Olga Kovshanova",
                  role: "Director, Minor Hotels",
                  img: "https://i.pravatar.cc/150?u=olga"
                },
                {
                  logo: "AVA 7",
                  quote: "I'm overall very satisfied. The new CRM4E update has significantly enhanced the potential for effective team collaboration.",
                  author: "Ari Daniel Hernandez",
                  role: "Marketing Director, Ava 7",
                  img: "https://i.pravatar.cc/150?u=ari"
                }
              ].map((card, idx) => (
                <div 
                  key={idx} 
                  className="group p-8 rounded-[32px] bg-zinc-900/40 border border-white/5 backdrop-blur-md flex flex-col justify-between hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="space-y-6">
                    <div className="h-8 flex items-center">
                      <span className="text-xs font-black tracking-[0.3em] text-zinc-500 group-hover:text-blue-400 transition-colors uppercase">
                        {card.logo}
                      </span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed font-medium">
                      "{card.quote}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-12">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                      <img src={card.img} alt={card.author} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{card.author}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{card.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* --- END NEW SECTION --- */}

{/* --- INTEGRATIONS SECTION --- */}
{/* --- INTEGRATIONS SECTION --- */}


        









        

      </main>

      <footer className="py-20 px-10 border-t border-zinc-900 text-center">
          <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-zinc-700">Aether © 2026 / All Rights Reserved</p>
      </footer>

      {/* FLOATING CHAT WIDGET (Like in the screenshot) */}
      <div className="fixed bottom-8 right-8 z-[100] flex items-end gap-4">
        <div className="bg-white p-4 rounded-xl rounded-br-none shadow-2xl border border-zinc-200 hidden md:block animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <p className="text-xs font-bold text-zinc-400 leading-tight">We're Online!</p>
           <p className="text-sm font-medium text-zinc-900">How may I help you today?</p>
        </div>
        <button className="w-16 h-16 bg-[#1e60ff] rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
          <MessageSquare className="w-7 h-7" />
        </button>
      </div>

    </div>
  );
};

export default AetherShadowSpace;