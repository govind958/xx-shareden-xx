import { useState, useCallback } from 'react';

export const useZoom = () => {
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 3));
  }, []);

  return {
    scale,
    panOffset,
    setPanOffset,
    zoomIn,
    zoomOut,
    resetZoom,
    handleWheel,
  };
};

