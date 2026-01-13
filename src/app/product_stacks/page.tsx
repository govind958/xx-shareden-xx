'use client'

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getStacks } from '@/src/modules/product_stacks/actions'
import { useRouter } from 'next/navigation'
import {
  Rocket,
  ArrowRight,
  Loader2,
  Layers,
  Activity,
  Zap,
  Search,
  Bell,
  CheckCircle2,
  Cpu
} from 'lucide-react'

/* --- React Flow Imports --- */
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  Connection,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

/* --- Drag and Drop Components --- */
// Assuming these are local files as per your snippet
import Sidebar from './Sidebar'; 
import { DnDProvider, useDnD } from './DnDContext';

/* ---------------- STYLE HELPERS ---------------- */
const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')

interface SubStack { id: string; name: string; price: number; is_free: boolean; }
interface Stack { id: string; name: string; description?: string; type?: string; base_price: number; sub_stacks?: SubStack[]; }
type StackCategory = 'All' | 'HR' | 'Marketing' | 'Finance' | 'Product'

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Inbound Node' },
    position: { x: 250, y: 5 },
    style: { background: '#0a0a0a', color: '#fff', border: '1px solid #262626' }
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

/* ---------------- FLOW COMPONENT ---------------- */
const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type, setType] = useDnD();

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} Node` },
        style: { background: '#0a0a0a', color: '#fff', border: '1px solid #14b8a6' }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, setNodes],
  );

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden bg-[#050505]">
      {/* Sidebar remains inside the terminal area */}
      <Sidebar />
      
      <div className="flex-grow h-full relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Controls className="bg-neutral-900 border-neutral-800 fill-white" />
          <Background color="#171717" variant="dots" gap={20} />
        </ReactFlow>
      </div>
    </div>
  );
};

/* ---------------- MAIN PAGE ---------------- */
export default function ProductStacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<StackCategory>('All')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    async function loadStacks() {
      try {
        const data = await getStacks()
        setStacks(data || [])
      } catch (error) { console.error(error) } finally { setLoading(false) }
    }
    loadStacks()
  }, [])

  const stats = [
    { label: "Active Nodes", val: stacks.length, icon: Cpu },
    { label: "Deployment Ready", val: "99.9%", icon: Activity },
    { label: "Global Tiers", val: 5, icon: Layers },
    { label: "System Health", val: "Optimal", icon: CheckCircle2 },
  ]

  if (!mounted) return <div className="min-h-screen bg-[#020202]" />

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30">
      
      {/* 1. TOP GLOBAL NAVIGATION */}
      <nav className="h-20 border-b border-neutral-900 bg-[#050505]/50 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-black">
                <Cpu size={18} />
            </div>
            <span className="font-bold text-white tracking-tighter">NODE_OS</span>
          </div>
          <div className="h-6 w-px bg-neutral-800 hidden md:block" />
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button onClick={() => setActiveTab('All')} className={cn("py-7 transition", activeTab === 'All' ? "text-teal-400 border-b-2 border-teal-500" : "text-neutral-500 hover:text-neutral-200")}>Blueprint</button>
            <button className="hover:text-neutral-200 transition py-7 text-neutral-500">Analytics</button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 px-3 py-1.5 rounded-xl mr-4">
            <Search size={14} className="text-neutral-600" />
            <input type="text" placeholder="Search infrastructure..." className="bg-transparent border-none outline-none text-xs w-32" />
          </div>
          <button className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center relative">
            <Bell size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-10">
        
        {/* 2. HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.4em] block mb-2">Infrastructure Designer</span>
            <h1 className="text-4xl font-bold text-white tracking-tight">
                Operator: <span className="text-neutral-400">Node Mapper</span>
            </h1>
            <p className="text-neutral-500 mt-2 flex items-center gap-2 font-mono text-sm">
              <Activity size={14} className="text-teal-500" /> Drawing Terminal <span className="text-neutral-200 font-medium">Active</span>
            </p>
          </div>
          <div className="flex gap-2 bg-neutral-900/50 p-1 rounded-xl border border-neutral-800 overflow-x-auto no-scrollbar">
            {['All', 'HR', 'Marketing', 'Finance', 'Product'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as StackCategory)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                    activeTab === tab ? "bg-teal-500 text-black" : "text-neutral-500 hover:text-white"
                  )}
                >
                  {tab}
                </button>
            ))}
          </div>
        </div>

        {/* 3. STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, i) => (
            <div key={i} className="bg-neutral-900/30 border border-neutral-800/60 p-6 rounded-[24px] flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">{item.label}</p>
                  <h3 className="text-3xl font-bold text-white tracking-tighter">{item.val}</h3>
                </div>
                <item.icon size={20} className="text-neutral-700" />
            </div>
          ))}
        </div>

        {/* 4. CONTENT GRID (NOW THE REACT FLOW TERMINAL) */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[24px] overflow-hidden flex flex-col h-[600px] md:h-[800px]">
          <div className="px-8 py-5 border-b border-neutral-900 bg-neutral-900/10 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Logic Blueprint Terminal v4.0</span>
             </div>
             <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-black font-black uppercase tracking-widest text-[9px] rounded-lg hover:bg-teal-500 transition-all">
               Deploy Architecture <ArrowRight size={12} />
             </button>
          </div>

          {/* THE FLOW CANVAS AREA */}
          <div className="flex-grow">
            <ReactFlowProvider>
              <DnDProvider>
                <DnDFlow />
              </DnDProvider>
            </ReactFlowProvider>
          </div>
        </div>

        {/* 5. FOOTER LOGS */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[32px] overflow-hidden">
          <div className="px-8 py-4 bg-black/40 flex justify-between items-center">
            <p className="text-[10px] font-medium text-neutral-700 font-mono tracking-tighter">
                TERMINAL_READY: {new Date().toISOString()}
            </p>
            <p className="text-[10px] font-black text-neutral-800 uppercase tracking-[0.5em]">SYSTEM STACK TERMINAL V4.0.2</p>
          </div>
        </div>
      </main>
    </div>
  )
}