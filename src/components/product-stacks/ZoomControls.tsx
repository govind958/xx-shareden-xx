import { Plus, Minus, Maximize } from 'lucide-react';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  return (
    <div className="absolute bottom-4 left-4 bg-neutral-900 border border-neutral-800 rounded-md flex flex-col overflow-hidden z-50">
      <button
        onClick={onZoomIn}
        className="p-2 hover:bg-neutral-800 text-teal-500 transition-colors"
        title="Zoom In"
      >
        <Plus size={16} />
      </button>
      <button
        onClick={onZoomOut}
        className="p-2 hover:bg-neutral-800 text-teal-500 border-t border-neutral-800 transition-colors"
        title="Zoom Out"
      >
        <Minus size={16} />
      </button>
      <button
        onClick={onResetZoom}
        className="p-2 hover:bg-neutral-800 text-teal-500 border-t border-neutral-800 transition-colors"
        title="Reset Zoom"
      >
        <Maximize size={16} />
      </button>
    </div>
  );
};

