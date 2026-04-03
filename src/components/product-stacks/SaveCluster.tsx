import { Lock, LayoutGrid, CheckCircle2, Save } from 'lucide-react';


/* ---------------- CUSTOM NODE COMPONENT ---------------- */
const SaveCluster = ({ 
    id,
    label, 
    type, 
    isSelected, 
    width, 
    height, 
    isSaved,
    onResizeStart,
    // onConnectStart is forwarded but not used internally
    onSave
  }: { 
    id: string;
    label: string; 
    type?: string; 
    isSelected: boolean; 
    width?: number; 
    height?: number; 
    isSaved?: boolean;
    onResizeStart?: (e: React.MouseEvent) => void;
    onConnectStart: (e: React.MouseEvent, id: string) => void;
    onSave: (id: string) => void;
  }) => {
    // 1. GROUP NODE RENDERING (Resizeable Box)
    if (type === 'group') {
      return (
        <div 
          style={{ width: width || 380, height: height || 240 }}
          className={`
            rounded-xl border-2 border-dashed transition-all relative flex flex-col
            ${isSelected 
              ? 'border-teal-500 bg-teal-500/5 shadow-[0_0_20px_rgba(20,184,166,0.1)]' 
              : isSaved
                ? 'border-green-500/50 bg-green-500/5'
                : 'border-neutral-700 bg-neutral-900/30 hover:border-neutral-600'
            }
          `}
        >
          <div className="absolute -top-3 left-4 px-2 bg-[#080808] flex items-center gap-2">
            {isSaved ? <Lock size={12} className="text-green-500" /> : <LayoutGrid size={12} className="text-neutral-500" />}
            <span className={`text-[10px] font-mono uppercase tracking-widest ${isSaved ? 'text-green-500 font-bold' : 'text-neutral-400'}`}>
              {isSaved ? 'Locked Cluster' : label}
            </span>
          </div>
          
          {/* Content Area */}
          <div className="flex-grow"></div>
  
          {/* Save Button Footer */}
          <div className="p-3 flex justify-end">
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 if (!isSaved) onSave(id);
               }}
               className={`
                 flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
                 ${isSaved 
                   ? 'bg-green-500/20 text-green-500 cursor-default' 
                   : 'bg-teal-500/10 text-teal-500 hover:bg-teal-500 hover:text-white'
                 }
               `}
             >
               {isSaved ? (
                 <>Saved <CheckCircle2 size={10} /></>
               ) : (
                 <>Save Cluster <Save size={10} /></>
               )}
             </button>
          </div>
  
          {/* Resize Handle (Only if NOT saved) */}
          {!isSaved && (
            <div 
               className="absolute bottom-1 right-1 w-6 h-6 flex items-end justify-end cursor-nwse-resize p-1 z-30 group/handle"
               onMouseDown={(e) => {
                 e.stopPropagation();
                 if (onResizeStart) onResizeStart(e);
               }}
            >
               <div className="w-2 h-2 border-r-2 border-b-2 border-neutral-600 group-hover/handle:border-teal-500 transition-colors" />
            </div>
          )}
        </div>
      );
    }
  };

  export default SaveCluster;

