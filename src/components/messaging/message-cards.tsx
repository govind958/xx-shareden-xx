"use client"

import React from 'react';
import { Calendar, Clock, Users, Star, CheckCircle2, XCircle, FileText, Download, Image as ImageIcon } from 'lucide-react';

const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

// Types for message metadata
export interface AppointmentData {
  title: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'declined';
}

export interface MeetingData {
  room: string;
  participants: string[];
  active: boolean;
}

export interface RatingData {
  topic: string;
  score: number;
  feedback: string;
}

export interface FileData {
  url: string;
  name: string;
  type: string; // MIME type
}

export type MessageType = 'text' | 'appointment' | 'meeting' | 'rating' | 'file';

export interface MessageMetadata {
  appointment?: AppointmentData;
  meeting?: MeetingData;
  rating?: RatingData;
  file?: FileData;
}

// Appointment Card Component
interface AppointmentCardProps {
  data: AppointmentData;
  isMe: boolean;
  onApprove?: () => void;
  onDecline?: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ data, isMe, onApprove, onDecline }) => (
  <div className="p-4 rounded-xl border bg-neutral-900/50 border-neutral-800 min-w-[280px]">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-teal-500/20 rounded-lg text-teal-400">
        <Calendar size={20} />
      </div>
      <div>
        <h4 className="font-bold text-sm text-white">{data.title}</h4>
        <p className="text-[11px] text-neutral-500 uppercase font-bold tracking-wider">Appointment Request</p>
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-2 text-xs text-neutral-400">
        <Clock size={14} /> {data.date} @ {data.time}
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
          data.status === 'approved' ? 'bg-green-500/20 text-green-400' :
            data.status === 'declined' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
        )}>
          {data.status}
        </span>
      </div>
    </div>
    {!isMe && data.status === 'pending' && onApprove && onDecline && (
      <div className="flex gap-2 border-t border-neutral-800 pt-3">
        <button
          onClick={onApprove}
          className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold hover:bg-green-500/30 transition-colors border border-green-500/30"
        >
          <CheckCircle2 size={14} /> Approve
        </button>
        <button
          onClick={onDecline}
          className="flex-1 flex items-center justify-center gap-1 py-2 bg-neutral-800 text-neutral-400 rounded-lg text-xs font-bold hover:bg-neutral-700 transition-colors"
        >
          <XCircle size={14} /> Decline
        </button>
      </div>
    )}
  </div>
);

// Meeting Card Component
interface MeetingCardProps {
  data: MeetingData;
  onJoin?: () => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({ data, onJoin }) => (
  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white min-w-[260px] shadow-lg shadow-indigo-500/20">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-indigo-500/50 rounded-lg">
        <Users size={20} />
      </div>
      {data.active && (
        <span className="flex items-center gap-1 text-[10px] font-bold bg-indigo-500/50 px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> LIVE
        </span>
      )}
    </div>
    <h4 className="font-bold text-sm mb-1">Meeting: {data.room}</h4>
    <p className="text-xs text-indigo-100 mb-4">{data.participants.length} participants invited</p>
    {onJoin && (
      <button
        onClick={onJoin}
        className="w-full py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors"
      >
        Join Meeting
      </button>
    )}
  </div>
);

// Rating Card Component
interface RatingCardProps {
  data: RatingData;
}

export const RatingCard: React.FC<RatingCardProps> = ({ data }) => (
  <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 min-w-[260px]">
    <p className="text-[10px] font-bold text-neutral-500 uppercase mb-1">Feedback & Rating</p>
    <h4 className="font-bold text-sm text-white mb-2">{data.topic}</h4>
    <div className="flex gap-1 mb-2">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={16}
          fill={s <= data.score ? "#EAB308" : "transparent"}
          className={s <= data.score ? "text-yellow-500" : "text-neutral-600"}
        />
      ))}
    </div>
    <p className="text-xs text-neutral-400 italic">"{data.feedback}"</p>
  </div>
);

// File Card Component
interface FileCardProps {
  data: FileData;
}

export const FileCard: React.FC<FileCardProps> = ({ data }) => {
  const isImage = data.type?.startsWith('image/');

  return (
    <div className="rounded-xl border bg-neutral-900/50 border-neutral-800 overflow-hidden min-w-[260px] max-w-[320px]">
      {isImage ? (
        <a href={data.url} target="_blank" rel="noopener noreferrer" className="block">
          <img
            src={data.url}
            alt={data.name}
            className="w-full max-h-[240px] object-cover hover:opacity-90 transition-opacity cursor-pointer"
          />
        </a>
      ) : (
        <div className="p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
            <FileText size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate">{data.name}</p>
            <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider mt-0.5">
              {data.type?.split('/')[1]?.toUpperCase() || 'FILE'}
            </p>
          </div>
        </div>
      )}
      <div className="px-4 py-3 border-t border-neutral-800 flex items-center justify-between">
        <span className="text-[10px] text-neutral-500 truncate max-w-[180px] font-bold">{data.name}</span>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
        >
          <Download size={14} />
        </a>
      </div>
    </div>
  );
};

// Message Card Renderer - renders the appropriate card based on message type
interface MessageCardRendererProps {
  messageType: MessageType;
  metadata: MessageMetadata | null;
  isMe: boolean;
  onAppointmentApprove?: () => void;
  onAppointmentDecline?: () => void;
  onMeetingJoin?: () => void;
}

export const MessageCardRenderer: React.FC<MessageCardRendererProps> = ({
  messageType,
  metadata,
  isMe,
  onAppointmentApprove,
  onAppointmentDecline,
  onMeetingJoin
}) => {
  if (messageType === 'appointment' && metadata?.appointment) {
    return (
      <AppointmentCard
        data={metadata.appointment}
        isMe={isMe}
        onApprove={onAppointmentApprove}
        onDecline={onAppointmentDecline}
      />
    );
  }

  if (messageType === 'meeting' && metadata?.meeting) {
    return (
      <MeetingCard
        data={metadata.meeting}
        onJoin={onMeetingJoin}
      />
    );
  }

  if (messageType === 'rating' && metadata?.rating) {
    return (
      <RatingCard data={metadata.rating} />
    );
  }

  if (messageType === 'file' && metadata?.file) {
    return (
      <FileCard data={metadata.file} />
    );
  }

  return null;
};
