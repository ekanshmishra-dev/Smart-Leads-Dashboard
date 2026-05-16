import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  CheckCircle,
  XCircle
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import LeadModal from '../components/LeadModal';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const Leads = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(query);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Sync search state with URL query
  useEffect(() => {
    if (query) setSearch(query);
  }, [query]);
  
  const { user } = useAuth();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/leads', {
        params: {
          keyword: search,
          status: statusFilter,
          source: sourceFilter,
          sort,
          pageNumber: page,
          pageSize: 10
        }
      });
      setLeads(data.leads);
      setTotalPages(data.pages);
    } catch (error) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sourceFilter, sort, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  const handleStatusUpdate = async (id: string, newStatus: string, name: string) => {
    try {
      await api.put(`/leads/${id}`, { status: newStatus });
      toast.success(`${name} marked as ${newStatus}`);
      fetchLeads();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        toast.success('Lead deleted');
        fetchLeads();
      } catch (error) {
        toast.error('Only admins can delete leads');
      }
    }
  };

  const handleEdit = (lead: any) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Leads Management</h1>
          <p className="text-muted-foreground">Manage and track your sales opportunities</p>
        </div>
        <button 
          onClick={() => { setSelectedLead(null); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
          Add New Lead
        </button>
      </div>

      {/* Filters & Search */}
      <div className="glass p-6 rounded-3xl bg-card/30 border-border/50 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name or email..." 
            className="w-full bg-background/50 border border-border rounded-xl py-2.5 pl-10 pr-10 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
            >
              <Plus size={16} className="rotate-45" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-background/50 border border-border rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
          <select 
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-background/50 border border-border rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
          <button 
            onClick={() => setSort(sort === 'latest' ? 'oldest' : 'latest')}
            className="flex items-center gap-2 bg-background/50 border border-border rounded-xl py-2.5 px-4 hover:bg-muted transition-colors"
          >
            <ArrowUpDown size={18} />
            {sort === 'latest' ? 'Newest' : 'Oldest'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass overflow-hidden rounded-3xl bg-card/30 border-border/50 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Lead Info</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-6 h-20 bg-muted/20" />
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Search size={48} className="mb-4 opacity-20" />
                      <p className="text-lg font-medium">No leads found</p>
                      <p className="text-sm">Try adjusting your filters or search keywords</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead: any) => (
                  <tr key={lead._id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full",
                        lead.status === 'Qualified' ? "bg-emerald-500/10 text-emerald-500" :
                        lead.status === 'Lost' ? "bg-rose-500/10 text-rose-500" :
                        lead.status === 'Contacted' ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
                      )}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-muted-foreground">{lead.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleStatusUpdate(lead._id, 'Qualified', lead.name)}
                          className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-500" 
                          title="Mark as Qualified"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(lead._id, 'Lost', lead.name)}
                          className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-500" 
                          title="Mark as Lost"
                        >
                          <XCircle size={16} />
                        </button>
                        <button onClick={() => handleEdit(lead)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" title="Edit">
                          <Edit size={16} />
                        </button>
                        {user?.role === 'admin' && (
                          <button onClick={() => handleDelete(lead._id)} className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-500" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        )}
                        <Link to={`/leads/${lead._id}`} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" title="View Details">
                          <Eye size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page <span className="font-bold text-foreground">{page}</span> of <span className="font-bold text-foreground">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 rounded-xl border border-border hover:bg-muted disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 rounded-xl border border-border hover:bg-muted disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchLeads} 
        lead={selectedLead}
      />
    </div>
  );
};

export default Leads;
