'use client'

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { ReactFlow, ReactFlowProvider, addEdge, useNodesState, useEdgesState, Controls, useReactFlow, Background, Connection, Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { createClient } from '@/utils/supabase/client'
import { getStacks } from '@/src/modules/product_stacks/actions'
import { useRouter } from 'next/navigation'
import { Rocket, ArrowRight, Loader2, Layers, Activity, Search, Bell, CheckCircle2, Cpu, Database } from 'lucide-react'
import { DnDProvider, useDnD } from './DnDContext' // Import from your context file

/* ---------------- STYLE HELPERS ---------------- */
const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')

interface SubStack { id: string; name: string; price: number; is_free: boolean; }
interface Stack { id: string; name: string; description?: string; type?: string; base_price: number; sub_stacks?: SubStack[]; }

/* ---------------- SIDEBAR COMPONENT ---------------- */
const Sidebar = ({ stacks }: { stacks: Stack[] }) => {
  const [, setType] = useDnD();

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-72 border-r border-neutral-900 bg-[#080808] p-6 overflow-y-auto">
      <div className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-6">Available Modules</div>
      <div className="space-y-4">
        {stacks.map((stack) => (
          <div
            key={stack.id}
            draggable
            onDragStart={(e) => onDragStart(e, stack.name)}
            className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl cursor-grab hover:border-teal-500/50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Database size={14} className="text-neutral-500 group-hover:text-teal-500" />
              <span className="text-xs font-bold text-white uppercase">{stack.name}</span>
            </div>
            <p className="text-[10px] text-neutral-500 leading-tight">Drag to deploy to infrastructure</p>
          </div>
        ))}
      </div>
    </aside>
  );
};

/* ---------------- FLOW CANVAS COMPONENT ---------------- */
let id = 0;
const getId = () => `node_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!type) return;

    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const newNode = {
      id: getId(),
      type: 'default',
      position,
      data: { label: `${type} Node` },
      style: { background: '#0a0a0a', color: '#fff', border: '1px solid #262626', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold' }
    };

    setNodes((nds) => nds.concat(newNode));
  }, [screenToFlowPosition, type, setNodes]);

  return (
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
        <Controls className="bg-neutral-900 border-neutral-800 fill-teal-500" />
        <Background color="#171717" variant="dots" gap={20} />
      </ReactFlow>
    </div>
  );
};

/* ---------------- PAGE COMPONENT ---------------- */
export default function ProductStacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

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

  if (!mounted) return <div className="min-h-screen bg-[#020202]" />

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans">
      {/* 1. TOP NAV */}
      <nav className="h-20 border-b border-neutral-900 bg-[#050505]/50 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center text-black"><Cpu size={18} /></div>
            <span className="font-bold text-white tracking-tighter">NODE_OS</span>
          </div>
          <div className="h-6 w-px bg-neutral-800 mx-4" />
          <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Operator Console v4.0.2</div>
        </div>
        <div className="flex items-center gap-4">
           <Search size={16} className="text-neutral-600" />
           <Bell size={16} className="text-neutral-600" />
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8 space-y-8">
        {/* 2. HEADER */}
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.4em] block mb-2">System Deployment</span>
            <h1 className="text-4xl font-bold text-white tracking-tight">Infrastructure <span className="text-neutral-500">Architect</span></h1>
          </div>
          <div className="flex gap-4 text-right">
             <div>
                <p className="text-[10px] text-neutral-500 uppercase font-bold">Health</p>
                <p className="text-sm text-teal-500 font-mono">OPTIMAL</p>
             </div>
             <div>
                <p className="text-[10px] text-neutral-500 uppercase font-bold">Sync</p>
                <p className="text-sm text-white font-mono">ACTIVE</p>
             </div>
          </div>
        </div>

        {/* 3. THE TERMINAL (React Flow Content) */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[24px] overflow-hidden flex flex-col h-[750px] shadow-2xl">
          <div className="px-8 py-5 border-b border-neutral-900 bg-neutral-900/10 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Visual Deployment Logic</span>
             </div>
             <button className="text-[10px] font-bold bg-teal-600 text-black px-4 py-1.5 rounded-lg uppercase tracking-widest hover:bg-teal-400 transition">
               Finalize Build
             </button>
          </div>

          <div className="flex flex-grow overflow-hidden">
            <ReactFlowProvider>
              <DnDProvider>
                <Sidebar stacks={stacks} />
                <DnDFlow />
              </DnDProvider>
            </ReactFlowProvider>
          </div>
        </div>

        {/* 4. FOOTER LOGS */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[20px] p-4 flex justify-between items-center px-8">
          <p className="text-[10px] font-mono text-neutral-700 uppercase">Status: Nodes Initialized // Listener Active</p>
          <p className="text-[10px] font-mono text-neutral-700 uppercase">Last Sync: {new Date().toLocaleTimeString()}</p>
        </div>
      </main>
    </div>
  )
}