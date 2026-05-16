import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  Tag, 
  Edit,
  Trash2,
  Phone,
  CheckCircle,
  XCircle,
  MessageSquare,
  Save,
  X
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import LeadModal from '../components/LeadModal';

import { cn } from '../utils/cn';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLead = async () => {
    try {
      const { data } = await api.get(`/leads/${id}`);
      setLead(data);
    } catch (error) {
      toast.error('Lead not found');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id, navigate]);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const { data } = await api.put(`/leads/${id}`, { status: newStatus });
      setLead(data);
      toast.success(`Lead marked as ${newStatus}`);
      addNotification(`Lead ${data.name} marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleUpdateNotes = async () => {
    try {
      const { data } = await api.put(`/leads/${id}`, { notes: tempNotes });
      setLead(data);
      setIsEditingNotes(false);
      toast.success('Notes updated');
      addNotification(`Updated notes for ${data.name}`);
    } catch (error) {
      toast.error('Failed to update notes');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        toast.success('Lead deleted');
        navigate('/leads');
      } catch (error) {
        toast.error('Action not permitted');
      }
    }
  };

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-10 w-40 bg-muted rounded-xl" />
    <div className="h-96 w-full bg-muted rounded-3xl" />
  </div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
      <Link to="/leads" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Leads
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold">
            {lead.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-4xl font-bold font-display tracking-tight">{lead.name}</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Mail size={14} />
              {lead.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-card border border-border/50 px-6 py-2.5 rounded-xl font-bold hover:bg-muted transition-all flex items-center gap-2 shadow-sm"
          >
            <Edit size={18} />
            Edit
          </button>
          {user?.role === 'admin' && (
            <button onClick={handleDelete} className="flex items-center gap-2 bg-rose-500/10 text-rose-500 px-4 py-2.5 rounded-xl font-semibold hover:bg-rose-500/20 transition-all">
              <Trash2 size={18} />
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Main Info */}
          <div className="glass p-8 rounded-3xl bg-card/30 border-border/50 space-y-8">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <h3 className="text-lg font-bold font-display">Lead Overview</h3>
              <div className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest",
                lead.status === 'Qualified' ? "bg-emerald-500/10 text-emerald-500" :
                lead.status === 'Lost' ? "bg-rose-500/10 text-rose-500" :
                lead.status === 'Contacted' ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
              )}>
                {lead.status}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Address</p>
                <div className="flex items-center gap-2 mt-2 font-semibold text-foreground">
                  <Mail size={18} className="text-primary" />
                  {lead.email}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Phone Number</p>
                <div className="flex items-center gap-2 mt-2 font-semibold text-foreground">
                  <Phone size={18} className="text-primary" />
                  {lead.phone || 'Not provided'}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Source</p>
                <div className="flex items-center gap-2 mt-2 font-semibold text-foreground">
                  <Tag size={18} className="text-primary" />
                  {lead.source}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Creation Date</p>
                <div className="flex items-center gap-2 mt-2 font-semibold text-foreground">
                  <Calendar size={18} className="text-primary" />
                  {new Date(lead.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare size={12} />
                  Internal Notes
                </p>
                {!isEditingNotes && (
                  <button 
                    onClick={() => { setIsEditingNotes(true); setTempNotes(lead.notes || ''); }}
                    className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
                  >
                    {lead.notes ? 'Edit' : 'Add Note'}
                  </button>
                )}
              </div>
              
              {isEditingNotes ? (
                <div className="space-y-3">
                  <textarea 
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    className="w-full bg-muted/50 rounded-2xl p-6 text-sm leading-relaxed border border-primary/30 outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-none"
                    placeholder="Type your internal notes here..."
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setIsEditingNotes(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 transition-all flex items-center gap-2"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                    <button 
                      onClick={handleUpdateNotes}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                      <Save size={14} />
                      Save Notes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/50 rounded-2xl p-6 text-sm leading-relaxed italic text-muted-foreground border border-border/50">
                  {lead.notes || 'No notes added for this lead yet. Click Add Note to add context.'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-3xl bg-card/30 border-border/50">
            <h4 className="font-bold text-sm mb-4">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleStatusUpdate('Qualified')}
                className="flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-500 py-3 rounded-xl font-bold hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
              >
                <CheckCircle size={18} />
                Qualify
              </button>
              <button 
                onClick={() => handleStatusUpdate('Lost')}
                className="flex items-center justify-center gap-2 bg-rose-500/10 text-rose-500 py-3 rounded-xl font-bold hover:bg-rose-500/20 transition-all border border-rose-500/20"
              >
                <XCircle size={18} />
                Lost
              </button>
            </div>
          </div>



          {/* Activity Mini Log */}
          <div className="glass p-6 rounded-3xl bg-card/30 border-border/50">
            <h4 className="font-bold text-sm mb-4">Recent Activity</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Lead Created</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LeadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLead}
        lead={lead}
      />
    </div>
  );
};

export default LeadDetails;
