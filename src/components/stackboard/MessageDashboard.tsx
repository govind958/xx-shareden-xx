"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Send,
    Paperclip,
    CheckCheck,
    Loader2,
    FileArchive,
    Download,
    ExternalLink,
    MessageSquare,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

// Create supabase client outside component to prevent recreation on each render
const supabase = createClient();

interface MessageDashboardProps {
    activeStackId: string | null;
    activeStackName: string;
    user: any;
}

export default function MessageDashboard({
    activeStackId,
    activeStackName,
    user,
}: MessageDashboardProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── 1. Fetch & Subscribe to Messages ──────────────────────────────
    useEffect(() => {
        if (!activeStackId) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            setLoadingMessages(true);
            const { data } = await supabase
                .from("project_messages")
                .select("*")
                .eq("order_item_id", activeStackId)
                .order("created_at", { ascending: true });

            if (data) setMessages(data);
            setLoadingMessages(false);
        };

        fetchMessages();

        // Real-time subscription
        const channel = supabase
            .channel(`client_view_${activeStackId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "project_messages",
                    filter: `order_item_id=eq.${activeStackId}`,
                },
                (payload) => {
                    setMessages((prev) => {
                        const newMsg = payload.new as any;
                        // Prevent duplicates
                        const exists = prev.find(
                            (m) =>
                                m.id === newMsg.id ||
                                (m.content === newMsg.content &&
                                    m.sender_id === newMsg.sender_id &&
                                    typeof m.id === "number")
                        );
                        if (exists) {
                            // Replace optimistic message with real one
                            return prev.map((m) =>
                                m.content === newMsg.content &&
                                    m.sender_id === newMsg.sender_id &&
                                    typeof m.id === "number"
                                    ? newMsg
                                    : m
                            );
                        }
                        return [...prev, newMsg];
                    });
                }
            )
            .subscribe((status, err) => {
                if (status === "SUBSCRIBED") {
                    console.log("[MessageDashboard] Realtime: Connected");
                } else if (status === "CHANNEL_ERROR") {
                    console.error("[MessageDashboard] Realtime: Channel error", err);
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeStackId]);

    // ── 2. Auto-scroll ────────────────────────────────────────────────
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loadingMessages]);

    // ── 3. Send Text Message ──────────────────────────────────────────
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user || !activeStackId) return;

        const content = input.trim();
        const tempId = Date.now();

        // Optimistic update
        const optimisticMsg = {
            id: tempId,
            content,
            sender_id: user.id,
            sender_role: "client",
            created_at: new Date().toISOString(),
            order_item_id: activeStackId,
        };

        setMessages((prev) => [...prev, optimisticMsg]);
        setInput("");

        // DB insert
        const { data, error } = await supabase
            .from("project_messages")
            .insert({
                order_item_id: activeStackId,
                content,
                sender_id: user.id,
                sender_role: "client",
            })
            .select()
            .single();

        if (error) {
            console.error("Failed to send:", error);
            setMessages((prev) => prev.filter((m) => m.id !== tempId));
            toast.error("Failed to send message");
        } else if (data) {
            setMessages((prev) => prev.map((m) => (m.id === tempId ? data : m)));
        }
    };

    // ── 4. File Upload ────────────────────────────────────────────────
    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file || !user || !activeStackId) return;

        try {
            setIsUploading(true);

            const fileExt = file.name.split(".").pop();
            const fileName = `${crypto.randomUUID()}.${fileExt}`;
            const filePath = `${activeStackId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("chats-file")
                .upload(filePath, file, { cacheControl: "3600", upsert: false });

            if (uploadError) throw uploadError;

            const {
                data: { publicUrl },
            } = supabase.storage.from("chats-file").getPublicUrl(filePath);

            const { data, error: dbError } = await supabase
                .from("project_messages")
                .insert({
                    order_item_id: activeStackId,
                    content: `Shared a file: ${file.name}`,
                    sender_id: user.id,
                    sender_role: "client",
                    message_type: "file",
                    file_url: publicUrl,
                    file_type: file.type,
                    file_name: file.name,
                    metadata: {
                        file: { url: publicUrl, name: file.name, type: file.type },
                    },
                })
                .select()
                .single();

            if (dbError) throw dbError;

            if (data) {
                setMessages((prev) => {
                    const exists = prev.find((m) => m.id === data.id);
                    return exists ? prev : [...prev, data];
                });
                toast.success("File shared!");
            }
        } catch (error: any) {
            console.error("Error uploading file:", error.message);
            toast.error("Failed to upload file");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // ── Render: No stack selected ─────────────────────────────────────
    if (!activeStackId) {
        return (
            <>
                <div className="flex-1 overflow-y-auto p-8 bg-[#F7FAFC] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                            <MessageSquare
                                size={28}
                                strokeWidth={1.5}
                                className="text-slate-300"
                            />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-slate-400">
                                No Stack Selected
                            </p>
                            <p className="text-xs text-slate-400 max-w-[260px]">
                                Select a stack from the sidebar to view messages and communicate
                                with your assigned expert.
                            </p>
                        </div>
                    </div>
                </div>
                <footer className="h-20 bg-white border-t border-slate-200 px-6 flex items-center gap-4">
                    <input
                        type="text"
                        disabled
                        placeholder="Select a stack first..."
                        className="flex-1 bg-slate-100 rounded-lg px-5 py-3 text-sm outline-none border border-transparent opacity-50 cursor-not-allowed"
                    />
                </footer>
            </>
        );
    }

    // ── Render: Messages + Input ──────────────────────────────────────
    return (
        <>
            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-2 bg-[#F7FAFC]"
            >
                {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2
                            size={24}
                            className="animate-spin text-[#2B6CB0]"
                        />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                            <MessageSquare
                                size={28}
                                strokeWidth={1.5}
                                className="text-slate-300"
                            />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-sm font-semibold text-slate-400">
                                No Messages Yet
                            </p>
                            <p className="text-xs text-slate-400 max-w-[260px]">
                                Start a conversation with your expert or wait for project
                                updates.
                            </p>
                        </div>
                    </div>
                ) : (
                    messages.map((m) => {
                        const isMe = m.sender_role === "client";
                        const isFile =
                            m.message_type === "file" && m.metadata?.file;

                        return (
                            <div
                                key={m.id}
                                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[75%] px-3 py-2 shadow-sm break-words overflow-hidden ${isMe
                                        ? "bg-[#319795] text-white rounded-lg rounded-tr-none"
                                        : "bg-white border border-slate-200 text-slate-800 rounded-lg rounded-tl-none"
                                        }`}
                                    style={{ overflowWrap: 'anywhere' }}
                                >
                                    {/* File attachment card */}
                                    {isFile && (
                                        <div className="flex items-center gap-3 p-3 bg-white/10 border border-white/20 rounded-lg max-w-[280px] my-2">
                                            <div
                                                className={`p-2 rounded-md ${isMe
                                                    ? "bg-white/20 text-white"
                                                    : "bg-[#F7FAFC] text-[#2B6CB0]"
                                                    }`}
                                            >
                                                <FileArchive size={22} strokeWidth={1.5} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={`text-sm font-semibold truncate ${isMe ? "text-white" : "text-[#1A365D]"
                                                        }`}
                                                >
                                                    {m.metadata.file.name}
                                                </p>
                                                <p
                                                    className={`text-xs uppercase tracking-wide ${isMe
                                                        ? "text-white/60"
                                                        : "text-slate-400"
                                                        }`}
                                                >
                                                    {m.metadata.file.type?.split("/")[1] || "file"}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-1 items-end">
                                                <a
                                                    href={m.metadata.file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`text-xs font-semibold flex items-center gap-1 ${isMe
                                                        ? "text-white hover:text-white/80"
                                                        : "text-[#2B6CB0] hover:text-[#1A365D]"
                                                        }`}
                                                >
                                                    Open <ExternalLink size={12} />
                                                </a>
                                                <a
                                                    href={m.metadata.file.url}
                                                    download={m.metadata.file.name}
                                                    className={`text-xs flex items-center gap-1 ${isMe
                                                        ? "text-white/60 hover:text-white"
                                                        : "text-slate-400 hover:text-slate-600"
                                                        }`}
                                                >
                                                    Save <Download size={12} />
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Text content */}
                                    {!isFile && (
                                        <p className="text-sm leading-relaxed">{m.content}</p>
                                    )}

                                    {/* Timestamp */}
                                    <div
                                        className={`flex items-center gap-1 mt-1 text-[10px] ${isMe ? "justify-end opacity-70" : "opacity-50"
                                            }`}
                                    >
                                        {new Date(m.created_at).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                        {isMe && <CheckCheck size={12} />}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Footer */}
            <footer className="h-20 bg-white border-t border-slate-200 px-6 flex items-center gap-4">
                {/* File attach button */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="p-2 text-slate-400 hover:text-[#2B6CB0] hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                >
                    <Paperclip size={20} />
                </button>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
                />

                {/* Text input */}
                <form onSubmit={handleSendMessage} className="flex-1 flex gap-4">
                    {isUploading ? (
                        <div className="flex-1 bg-slate-100 rounded-lg px-5 py-3 flex items-center gap-3">
                            <Loader2
                                size={16}
                                className="animate-spin text-[#2B6CB0]"
                            />
                            <span className="text-xs text-[#2B6CB0] font-semibold">
                                Uploading file...
                            </span>
                        </div>
                    ) : (
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Communicate with your stack expert..."
                            className="flex-1 bg-slate-100 rounded-lg px-5 py-3 text-sm outline-none border border-transparent focus:ring-2 focus:ring-[#2B6CB0] focus:border-[#2B6CB0]"
                        />
                    )}

                    <button
                        type="submit"
                        disabled={!input.trim() || isUploading}
                        className="bg-[#1A365D] hover:bg-[#2B6CB0] text-white p-3 rounded-lg transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </footer>
        </>
    );
}
