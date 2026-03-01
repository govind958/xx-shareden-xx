"use client"

import React from 'react';
import { Calendar, FileText, X } from 'lucide-react';
import type { MessageType } from './message-cards';

interface ActionMenuItem {
  label: string;
  icon: React.ReactNode;
  color: string;
  type: MessageType | 'file';
}

const actionItems: ActionMenuItem[] = [
  { label: 'Appointment', icon: <Calendar size={24} />, color: 'bg-teal-500/20 text-teal-400', type: 'appointment' },
  { label: 'Share File', icon: <FileText size={24} />, color: 'bg-blue-500/20 text-blue-400', type: 'file' },
];

interface ActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (type: MessageType | 'file') => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ isOpen, onClose, onAction }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full left-0 mb-4 w-full max-w-sm bg-neutral-900 rounded-2xl shadow-2xl p-6 grid grid-cols-2 gap-4 z-30 border border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-200">
      {actionItems.map((item) => (
        <button
          key={item.label}
          onClick={() => onAction(item.type)}
          className="flex flex-col items-center gap-2 group"
        >
          <div className={`p-4 rounded-2xl ${item.color} group-hover:scale-110 transition-transform`}>
            {item.icon}
          </div>
          <span className="text-[11px] font-bold text-neutral-500">{item.label}</span>
        </button>
      ))}
      <button
        onClick={onClose}
        className="absolute -top-3 -right-3 bg-neutral-800 text-white rounded-full p-1.5 shadow-lg hover:bg-neutral-700 transition-colors border border-neutral-700"
      >
        <X size={14} />
      </button>
    </div>
  );
};
