import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  TrendingUp,
  ExternalLink,
  Plus
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import api from '../utils/api';
import { 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '../utils/cn';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/leads/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {[1,2,3].map(i => <div key={i} className="h-40 bg-muted rounded-3xl" />)}
  </div>;

  const chartData = stats?.sourceStats.map((s: any) => ({ name: s._id, value: s.count }));

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Overview</h1>
          <p className="text-muted-foreground">Monitor your leads and conversion performance</p>
        </div>
        <Link 
          to="/leads" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
          New Lead
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Leads" 
          value={stats?.totalLeads || 0} 
          icon={Users} 
          color="primary"
          trend={{ value: 12, isUp: true }}
        />
        <StatsCard 
          title="Qualified Leads" 
          value={stats?.qualifiedLeads || 0} 
          icon={UserCheck} 
          color="success"
          trend={{ value: 8, isUp: true }}
        />
        <StatsCard 
          title="Lost Leads" 
          value={stats?.lostLeads || 0} 
          icon={UserMinus} 
          color="danger"
          trend={{ value: 5, isUp: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Source Analytics */}
        <div className="glass p-8 rounded-3xl bg-card/30 border-border/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold font-display">Lead Sources</h2>
            <TrendingUp size={20} className="text-muted-foreground" />
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData?.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {chartData?.map((entry: any, index: number) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm font-medium">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="glass p-8 rounded-3xl bg-card/30 border-border/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold font-display">Recent Leads</h2>
            <Link to="/leads" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              View All <ExternalLink size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {stats?.recentLeads.map((lead: any) => (
              <Link 
                key={lead._id} 
                to={`/leads/${lead._id}`}
                className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-transparent hover:border-primary/20 hover:bg-muted transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{lead.name}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={cn(
                  "text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                  lead.status === 'Qualified' ? "bg-emerald-500/10 text-emerald-500" :
                  lead.status === 'Lost' ? "bg-rose-500/10 text-rose-500" : "bg-primary/10 text-primary"
                )}>
                  {lead.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
