"use client"

import React, { useState } from 'react';
import { X, Calendar, Users, Star } from 'lucide-react';
import type { AppointmentData, MeetingData, RatingData } from './message-cards';

const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

// Modal Wrapper
interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ isOpen, onClose, title, icon, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md mx-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 rounded-lg text-teal-400">
              {icon}
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Appointment Modal
interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentData) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time) return;
    
    onSubmit({
      title: title.trim(),
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time,
      status: 'pending'
    });
    
    setTitle('');
    setDate('');
    setTime('');
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Create Appointment" icon={<Calendar size={20} />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Project Review Meeting"
            className="w-full bg-black border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white placeholder-neutral-600 focus:border-teal-500 focus:outline-none transition-colors"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:border-teal-500 focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:border-teal-500 focus:outline-none transition-colors"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-teal-500 text-black rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-teal-400 transition-colors mt-6"
        >
          Send Appointment Request
        </button>
      </form>
    </ModalWrapper>
  );
};

// Meeting Modal
interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MeetingData) => void;
}

export const MeetingModal: React.FC<MeetingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [room, setRoom] = useState('');
  const [participants, setParticipants] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room.trim()) return;
    
    onSubmit({
      room: room.trim(),
      participants: participants.split(',').map(p => p.trim()).filter(Boolean),
      active: true
    });
    
    setRoom('');
    setParticipants('');
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Start Meeting" icon={<Users size={20} />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Meeting Room Name
          </label>
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="e.g., Design-Sync-Alpha"
            className="w-full bg-black border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white placeholder-neutral-600 focus:border-teal-500 focus:outline-none transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Participants (comma separated)
          </label>
          <input
            type="text"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            placeholder="e.g., John, Sarah, Mike"
            className="w-full bg-black border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white placeholder-neutral-600 focus:border-teal-500 focus:outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-indigo-500 text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-indigo-400 transition-colors mt-6"
        >
          Create Meeting Room
        </button>
      </form>
    </ModalWrapper>
  );
};

// Rating Modal
interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RatingData) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [topic, setTopic] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || score === 0) return;
    
    onSubmit({
      topic: topic.trim(),
      score,
      feedback: feedback.trim() || 'No additional feedback provided.'
    });
    
    setTopic('');
    setScore(0);
    setFeedback('');
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Request Rating" icon={<Star size={20} />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Topic / Deliverable
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Phase 1 Delivery"
            className="w-full bg-black border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white placeholder-neutral-600 focus:border-teal-500 focus:outline-none transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Your Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScore(s)}
                className="p-2 hover:scale-110 transition-transform"
              >
                <Star 
                  size={28} 
                  fill={s <= score ? "#EAB308" : "transparent"} 
                  className={cn(
                    "transition-colors",
                    s <= score ? "text-yellow-500" : "text-neutral-600 hover:text-neutral-400"
                  )} 
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Feedback (optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full bg-black border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white placeholder-neutral-600 focus:border-teal-500 focus:outline-none transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={score === 0}
          className={cn(
            "w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors mt-6",
            score > 0 
              ? "bg-yellow-500 text-black hover:bg-yellow-400" 
              : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
          )}
        >
          Send Rating
        </button>
      </form>
    </ModalWrapper>
  );
};
