import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, CalendarRange, Coffee } from 'lucide-react';

const mockChartData = [
  { name: 'Mon', users: 120, bookings: 40, orders: 85 },
  { name: 'Tue', users: 132, bookings: 45, orders: 90 },
  { name: 'Wed', users: 101, bookings: 30, orders: 110 },
  { name: 'Thu', users: 142, bookings: 55, orders: 130 },
  { name: 'Fri', users: 190, bookings: 80, orders: 170 },
  { name: 'Sat', users: 80, bookings: 20, orders: 60 },
  { name: 'Sun', users: 95, bookings: 25, orders: 75 }
];

const StatCard = ({ title, value, icon, trend, up }) => (
  <div className="admin-metric-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
       <span className="metric-title">{title}</span>
       <div style={{ color: 'var(--text-dim)' }}>{icon}</div>
    </div>
    <div className="metric-value">
       {value}
       <span className={`metric-trend ${up ? 'metric-up' : 'metric-down'}`}>
         {up ? '+' : '-'}{trend}%
       </span>
    </div>
  </div>
);

const AdminOverview = () => {
  return (
    <div>
       <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px 0' }}>Overview Analytics</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>Welcome back. Here's what's happening across campus.</p>
       </div>

       <div className="admin-metrics-grid">
         <StatCard title="Active Users" value="1,248" icon={<Users size={20} />} trend="12.5" up={true} />
         <StatCard title="Daily Bookings" value="84" icon={<CalendarRange size={20} />} trend="4.2" up={true} />
         <StatCard title="Cafe Orders" value="312" icon={<Coffee size={20} />} trend="8.1" up={true} />
         <StatCard title="System Reports" value="3" icon={<TrendingUp size={20} />} trend="2.0" up={false} />
       </div>

       <div className="admin-chart-box">
         <h3 style={{ fontSize: 16, marginBottom: 24, color: 'white' }}>Platform Engagement (Weekly)</h3>
         <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f5004f" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f5004f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{fill: '#8890bb'}} />
                <YAxis stroke="rgba(255,255,255,0.2)" tick={{fill: '#8890bb'}} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <Tooltip 
                  contentStyle={{ background: '#0a0c14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ fontSize: 13 }}
                />
                <Area type="monotone" dataKey="users" stroke="#667eea" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="orders" stroke="#f5004f" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
         </div>
       </div>
    </div>
  );
};

export default AdminOverview;
