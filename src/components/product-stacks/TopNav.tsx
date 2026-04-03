import { Cpu, Search, Bell } from 'lucide-react';

export const TopNav: React.FC = () => {
  return (
    <nav className="h-20 border-b border-neutral-900 bg-[#050505]/50 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center text-black">
            <Cpu size={18} />
          </div>
          <span className="font-bold text-white tracking-tighter">NODE_OS</span>
        </div>
        <div className="h-6 w-px bg-neutral-800 mx-4" />
        <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
          Operator Console v4.0.2
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Search size={16} className="text-neutral-600" />
        <Bell size={16} className="text-neutral-600" />
      </div>
    </nav>
  );
};

