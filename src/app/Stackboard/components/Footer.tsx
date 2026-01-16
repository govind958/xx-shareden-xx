export const Footer: React.FC = () => {
  return (
    <div className="bg-[#080808] border border-neutral-900 rounded-[20px] p-4 flex justify-between items-center px-8">
      <p className="text-[10px] font-mono text-neutral-700 uppercase">
        Status one: Nodes Initialized // Listener Active
      </p>
      <p className="text-[10px] font-mono text-neutral-700 uppercase">
        Last Sync: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
};

