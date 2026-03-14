"use client";

import { useState } from "react";
import { MessageSquare, X, Paperclip, Loader2, CheckCircle } from "lucide-react";
import { createSupportTicket } from "@/src/modules/support/action";
import { toast } from "sonner";

interface SupportModalProps {
  onClose: () => void;
  userId: string;
}

export default function SupportModal({ onClose, userId }: SupportModalProps) {
    const [step, setStep] = useState<'form' | 'submitting' | 'success'>('form');
    const [ticketId, setTicketId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
      subject: '',
      category: 'technical',
      priority: 'medium',
      description: ''
    });
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!userId) {
        toast.error("You must be signed in to submit a ticket.");
        return;
      }
      setStep('submitting');

      const fd = new FormData();
      fd.set('user_id', userId);
      fd.set('subject', formData.subject);
      fd.set('category', formData.category);
      fd.set('priority', formData.priority);
      fd.set('description', formData.description);

      const result = await createSupportTicket(fd);

      if (result.success && result.data) {
        setTicketId(result.data.id);
        setStep('success');
      } else {
        setStep('form');
        toast.error(result.error ?? "Failed to submit ticket. Please try again.");
      }
    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
        <div 
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {step === 'form' && (
            <>
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <MessageSquare size={20} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Submit an Issue</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
  
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <p className="text-sm text-gray-500 mb-6">
                  Need help? Fill out the form below and our support team will get back to you within 24 hours.
                </p>
  
                <form id="support-form" onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input 
                      required
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Briefly describe the issue"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                    />
                  </div>
  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select 
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                      >
                        <option value="technical">Technical Issue</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="account">Account Access</option>
                        <option value="feature">Feature Request</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select 
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                      Description
                      <span className="text-gray-400 font-normal">Required</span>
                    </label>
                    <textarea 
                      required
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Please provide as much detail as possible to help us resolve your issue quickly."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm resize-none"
                    ></textarea>
                  </div>
  
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <button 
                      type="button" 
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Paperclip size={16} />
                      Attach file (Optional)
                    </button>
                  </div>
                </form>
              </div>
  
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 rounded-b-2xl">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  form="support-form"
                  disabled={!formData.subject || !formData.description}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Submit Ticket
                </button>
              </div>
            </>
          )}
  
          {step === 'submitting' && (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Submitting your request...</h3>
              <p className="text-gray-500 text-sm">Please wait while we create your support ticket.</p>
            </div>
          )}
  
          {step === 'success' && (
            <div className="p-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ticket Submitted!</h3>
              <p className="text-gray-600 mb-8 max-w-sm">
                We&apos;ve received your request and our support team will get back to you shortly.
                {ticketId != null && (
                  <> Your ticket ID is <span className="font-semibold text-gray-900">#{ticketId}</span>.</>
                )}
              </p>
              <button 
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm w-full"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }