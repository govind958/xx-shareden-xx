import { LucideIcon } from "lucide-react";

export interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    type: string;
    icon: LucideIcon; 
    description: string;
    link: string;
  }
  