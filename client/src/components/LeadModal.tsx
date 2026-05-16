import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { X, Loader2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral', 'Other']),
  notes: z.string().optional(),
});

type LeadForm = z.infer<typeof leadSchema>;

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lead?: any;
}

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSuccess, lead }) => {
  const { addNotification } = useNotifications();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
  });

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        status: lead.status,
        source: lead.source,
        notes: lead.notes || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        status: 'New',
        source: 'Website',
        notes: '',
      });
    }
  }, [lead, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: LeadForm) => {
    try {
      if (lead) {
        await api.put(`/leads/${lead._id}`, data);
        toast.success('Lead updated successfully');
        addNotification(`Updated lead: ${data.name}`);
      } else {
        await api.post('/leads', data);
        toast.success('Lead created successfully');
        addNotification(`New lead created: ${data.name}`);
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="glass w-full max-w-lg rounded-3xl bg-card shadow-2xl border border-border/50 relative z-10 animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-xl font-bold font-display">{lead ? 'Edit Lead' : 'Create New Lead'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Lead Name</label>
            <input 
              {...register('name')}
              className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="Full name"
            />
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <input 
              {...register('email')}
              className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="email@example.com"
            />
            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select 
                {...register('status')}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Source</label>
              <select 
                {...register('source')}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              >
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number (Optional)</label>
            <input 
              {...register('phone')}
              className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea 
              {...register('notes')}
              className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[100px] resize-none"
              placeholder="Add any additional context about this lead..."
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-semibold border border-border hover:bg-muted transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              {isSubmitting && <Loader2 className="animate-spin" size={18} />}
              {lead ? 'Update Lead' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
