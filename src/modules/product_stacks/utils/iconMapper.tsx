import { Database, Shield, Zap, Box, Layers, Globe, Server, LayoutGrid, LucideIcon } from 'lucide-react';

export const getIconForType = (type?: string): LucideIcon => {
  const typeMap: Record<string, LucideIcon> = {
    'database': Database,
    'auth': Shield,
    'compute': Zap,
    'storage': Box,
    'cache': Layers,
    'network': Globe,
    'server': Server,
    'group': LayoutGrid,
  };
  return typeMap[type?.toLowerCase() || ''] || Database;
};

