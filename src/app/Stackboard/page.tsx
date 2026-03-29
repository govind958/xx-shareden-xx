import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MoreHorizontal,
  Paperclip,
  Send,
  FileArchive,
  Download,
  ExternalLink,
  CheckCheck,
  Pin,
  Smile,
  Mic,
  Info,
  Menu,
  X,
  ChevronLeft,
  Phone
} from "lucide-react";

// --- Utility ---
const cn = (...classes) => classes.filter(Boolean).join(" ");

// --- Mock Data ---
const MOCK_STACKS = [
  {
    id: "STK-9921",
    name: "Next.js Enterprise Stack",
    description: "Advanced architecture with multi-tenant auth.",
    progress: 75,
    status: "In Progress",
    updated_at: "10:42 AM",
    initial: "N",
    color: "#2B6CB0",
    notifications: 3
  },
  {
    id: "STK-4402",
    name: "AI Microservice Integration",
    description: "Python FastAPI + LangGraph workflow.",
    progress: 100,
    status: "Completed",
    updated_at: "Yesterday",
    initial: "A",
    color: "#38A169",
    notifications: 0
  },
  {
    id: "STK-1108",
    name: "Stripe Billing Engine",
    description: "Custom subscription logic & webhooks.",
    progress: 15,
    status: "Initiated",
    updated_at: "9:15 AM",
    initial: "S",
    color: "#805AD5",
    notifications: 1
  },
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    type: 'incoming',
    text: "The core modules have been deployed. I've attached the latest architectural manifest for your review.",
    time: "11:20 AM",
    file: { name: "architecture_v2_final.zip", size: "2.8 MB" }
  },
  {
    id: 2,
    type: 'outgoing',
    text: "Manifest received. Checking configuration now. Looks solid so far.",
    time: "11:24 AM",
    status: 'read'
  },
  {
    id: 3,
    type: 'system',
    text: "Status updated to ",
    statusHighlight: "In Progress",
    time: "11:25 AM"
  }
];

// --- Components ---

const FileCard = ({ fileName, size }) => (
  <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg max-w-full sm:max-w-[280px] my-2 hover:border-[#2B6CB0] transition-colors cursor-pointer group shadow-sm">
    <div className="bg-[#F7FAFC] p-2 rounded-md text-[#2B6CB0] group-hover:bg-[#EBF8FF]">
      <FileArchive size={22} strokeWidth={1.5} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold truncate text-[#1A365D]">
        {fileName}
      </p>
      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
        {size}
      </p>
    </div>
    <div className="flex flex-col gap-1 items-end ml-2">
      <button className="text-[11px] font-bold text-[#2B6CB0] hover:text-[#1A365D] flex items-center gap-1">
        Open <ExternalLink size={10} />
      </button>
      <button className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1">
        Save <Download size={10} />
      </button>
    </div>
  </div>
);

export default function App() {
  const [selectedStack, setSelectedStack] = useState(MOCK_STACKS[0]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedStack]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'outgoing',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  return (
    <div className="flex h-screen w-full text-slate-800 overflow-hidden bg-[#F7FAFC] font-sans">
      
      {/* Mobile Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden" 
          onClick={() => setIsSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:relative z-30 h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-80 translate-x-0" : "w-0 -translate-x-full md:w-20 md:translate-x-0"
      )}>
        
        {/* Sidebar Header */}
        <div className={cn(
          "p-6 flex items-center justify-between border-b border-slate-100 h-20 shrink-0 overflow-hidden",
          !isSidebarOpen && "md:px-4 md:justify-center"
        )}>
          <div className={cn("transition-opacity", !isSidebarOpen && "md:hidden")}>
            <h1 className="text-xl font-bold text-[#1A365D] whitespace-nowrap">
              Messages
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 whitespace-nowrap">
              Stack Engine v2
            </p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Stack List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 custom-scrollbar">
          {MOCK_STACKS.map((stack) => (
            <div
              key={stack.id}
              onClick={() => {
                setSelectedStack(stack);
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className={cn(
                "group relative flex items-center gap-3 p-3 cursor-pointer transition-all rounded-xl",
                selectedStack.id === stack.id
                  ? "bg-[#F0F7FF] ring-1 ring-[#2B6CB0]/10"
                  : "hover:bg-slate-50"
              )}
            >
              <div className="relative shrink-0">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  style={{ backgroundColor: stack.color }}
                >
                  {stack.initial}
                </div>
                {/* Notification Badge - Always visible even when collapsed */}
                {stack.notifications > 0 && (
                  <div className={cn(
                    "absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white",
                    isSidebarOpen ? "h-5 w-5" : "h-4 w-4"
                  )}>
                    {isSidebarOpen ? stack.notifications : ""}
                  </div>
                )}
              </div>

              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold truncate text-[#1A365D]">
                      {stack.name}
                    </h3>
                    <span className="text-[10px] font-medium text-slate-400">
                      {stack.updated_at}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden max-w-[60px]">
                      <div 
                        className="h-full bg-[#2B6CB0] rounded-full" 
                        style={{ width: `${stack.progress}%` }} 
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold truncate uppercase tracking-tighter">
                      {stack.status}
                    </p>
                  </div>
                </div>
              )}

              {isSidebarOpen && (
                <Pin
                  size={12}
                  className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              )}
              
              {selectedStack.id === stack.id && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#2B6CB0] rounded-r-full" />
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        
        {/* Chat Header */}
        <header className="h-20 border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 min-w-0">
            <button 
              className="md:hidden p-2 -ml-2 text-slate-500"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div 
              className="w-10 h-10 rounded-lg shrink-0 text-white flex items-center justify-center font-bold shadow-md"
              style={{ backgroundColor: selectedStack.color }}
            >
              {selectedStack.initial}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-[#1A365D] truncate">
                {selectedStack.name}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  Expert Online
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-[#2B6CB0] rounded-full transition-all">
              <Search size={18} />
            </button>
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-[#2B6CB0] rounded-full transition-all" title="Start Call">
              <Phone size={18} />
            </button>
            <button className="hidden sm:block p-2.5 text-slate-400 hover:bg-slate-50 hover:text-[#2B6CB0] rounded-full transition-all">
              <Info size={18} />
            </button>
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-[#2B6CB0] rounded-full transition-all">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-[#F7FAFC] scroll-smooth"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex",
                msg.type === 'outgoing' ? "justify-end" : msg.type === 'system' ? "justify-center" : "justify-start"
              )}
            >
              {msg.type === 'system' ? (
                <div className="bg-white px-4 py-2 rounded-full border border-slate-200 text-[11px] font-bold text-slate-500 shadow-sm uppercase tracking-wider">
                  {msg.text}
                  <span className="text-[#2B6CB0]">
                    {msg.statusHighlight}
                  </span>
                </div>
              ) : (
                <div className={cn(
                  "max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl shadow-sm relative group",
                  msg.type === 'outgoing' 
                    ? "bg-[#1A365D] text-white rounded-tr-none" 
                    : "bg-white border border-slate-200 text-[#1A365D] rounded-tl-none"
                )}>
                  <p className="text-sm leading-relaxed font-medium">
                    {msg.text}
                  </p>
                  
                  {msg.file && (
                    <FileCard fileName={msg.file.name} size={msg.file.size} />
                  )}

                  <div className={cn(
                    "flex items-center gap-1 mt-1.5 text-[10px] font-bold opacity-60",
                    msg.type === 'outgoing' ? "justify-end" : "justify-start"
                  )}>
                    {msg.time}
                    {msg.type === 'outgoing' && (
                      <CheckCheck size={12} className={msg.status === 'read' ? "text-sky-300" : "text-slate-300"} />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Footer */}
        <footer className="p-4 sm:p-6 bg-white border-t border-slate-100 shrink-0">
          <form 
            onSubmit={handleSendMessage}
            className="max-w-5xl mx-auto flex items-end gap-2 sm:gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-[#2B6CB0] focus-within:ring-4 focus-within:ring-[#2B6CB0]/5 transition-all"
          >
            <div className="flex items-center">
              <button 
                type="button"
                className="p-2.5 text-slate-400 hover:text-[#2B6CB0] hover:bg-white rounded-xl transition-colors"
              >
                <Paperclip size={20} />
              </button>
            </div>

            <textarea
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Message stack expert..."
              className="flex-1 bg-transparent py-2.5 px-1 text-sm outline-none resize-none max-h-32 min-h-[40px] font-medium placeholder:text-slate-400"
            />

            <div className="flex items-center gap-1">
              <button 
                type="button"
                className="hidden sm:flex p-2.5 text-slate-400 hover:text-[#2B6CB0] hover:bg-white rounded-xl transition-colors"
              >
                <Smile size={20} />
              </button>
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className={cn(
                  "p-3 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:shadow-none",
                  inputValue.trim() ? "bg-[#1A365D] text-white hover:bg-[#2B6CB0]" : "bg-slate-200 text-slate-400"
                )}
              >
                <Send size={18} strokeWidth={2.5} />
              </button>
            </div>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-widest">
            End-to-end encrypted • Enterprise Tier
          </p>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E0;
        }
      `}} />
    </div>
  );
}