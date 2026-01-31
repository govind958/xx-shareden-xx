export const PageHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-end">
      <div>
        <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.4em] block mb-2">
          System Deployment
        </span>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Infrastructure <span className="text-neutral-500">Architect</span>
        </h1>
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
  );
};

