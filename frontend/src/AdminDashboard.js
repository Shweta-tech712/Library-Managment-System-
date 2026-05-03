import React, { useState, useEffect } from "react";
import { Book, Users, Clock, AlertTriangle, ArrowUpRight, BarChart2, PieChart, Activity } from "lucide-react";
import api from "./api";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const StatCard = ({ icon: Icon, label, value, color, description }) => (
  <div className="glass-card" style={{ flex: 1, padding: "1.5rem", position: "relative", overflow: "hidden" }}>
    <div style={{ 
      position: "absolute", 
      top: "-10px", 
      right: "-10px", 
      width: "80px", 
      height: "80px", 
      background: `rgba(${color}, 0.05)`, 
      borderRadius: "50%" 
    }} />
    
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
      <div style={{ 
        background: `rgba(${color}, 0.1)`, 
        padding: "12px", 
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid rgba(${color}, 0.2)`
      }}>
        <Icon color={`rgb(${color})`} size={24} />
      </div>
      <ArrowUpRight size={18} color="var(--text-muted)" />
    </div>
    
    <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {label}
    </p>
    <h3 style={{ fontSize: "2rem", margin: "0.5rem 0", color: "var(--text-primary)" }}>{value}</h3>
    <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{description}</p>
  </div>
);

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
      const analyticsRes = await api.get("/admin/dashboard/analytics");
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error("Error fetching stats", err);
    } finally {
      setLoading(false);
    }
  };

  const lineChartData = {
    labels: analytics?.recent_issues?.map(d => d.date) || [],
    datasets: [{
      label: 'Books Issued',
      data: analytics?.recent_issues?.map(d => d.count) || [],
      borderColor: 'rgb(255, 75, 75)',
      backgroundColor: 'rgba(255, 75, 75, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const doughnutData = {
    labels: analytics?.categories?.map(c => c.name) || [],
    datasets: [{
      data: analytics?.categories?.map(c => c.count) || [],
      backgroundColor: [
        'rgba(255, 75, 75, 0.8)',
        'rgba(255, 152, 0, 0.8)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(33, 150, 243, 0.8)',
        'rgba(156, 39, 176, 0.8)',
        'rgba(0, 188, 212, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  const barData = {
    labels: analytics?.top_books?.map(b => b.title) || [],
    datasets: [{
      label: 'Times Issued',
      data: analytics?.top_books?.map(b => b.count) || [],
      backgroundColor: 'rgba(255, 75, 75, 0.8)',
      borderRadius: 4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)', stepSize: 1, beginAtZero: true } }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: 'rgba(255,255,255,0.7)', padding: 20 } }
    }
  };

  if (loading) return <div className="animate-fade-in" style={{ textAlign: "center", padding: "4rem" }}>Loading Dashboard...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "2.25rem", color: "var(--text-primary)" }}>System Overview</h2>
        <p style={{ color: "var(--text-secondary)" }}>Real-time library metrics and administrative insights.</p>
      </div>

      <div className="stats-grid">
        <StatCard 
          icon={Book} 
          label="Total Inventory" 
          value={stats?.total_books || 0} 
          color="255, 75, 75" 
          description="Global book count"
        />
        <StatCard 
          icon={Clock} 
          label="Currently Issued" 
          value={stats?.total_issued || 0} 
          color="255, 152, 0" 
          description="Active loans"
        />
        <StatCard 
          icon={AlertTriangle} 
          label="Overdue Alerts" 
          value={stats?.overdue_books || 0} 
          color="244, 67, 54" 
          description="Action required"
        />
        <StatCard 
          icon={Users} 
          label="Registered Members" 
          value={stats?.total_users || 0} 
          color="76, 175, 80" 
          description="Total active users"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
        {/* Line Chart */}
        <div className="glass-card">
          <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Activity size={20} color="var(--primary)" />
            7-Day Issuing Trend
          </h3>
          <div style={{ height: "300px" }}>
            {analytics ? <Line data={lineChartData} options={chartOptions} /> : <div style={{color:"var(--text-muted)"}}>Loading...</div>}
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="glass-card">
          <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <PieChart size={20} color="var(--primary)" />
            Category Distribution
          </h3>
          <div style={{ height: "300px" }}>
            {analytics && analytics.categories.length > 0 ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <div style={{display:"flex", height:"100%", alignItems:"center", justifyContent:"center", color:"var(--text-muted)"}}>No data</div>
            )}
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="glass-card">
        <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <BarChart2 size={20} color="var(--primary)" />
          Top 5 Most Popular Books
        </h3>
        <div style={{ height: "300px" }}>
          {analytics ? <Bar data={barData} options={{...chartOptions, plugins: { legend: { display: false }}}} /> : <div style={{color:"var(--text-muted)"}}>Loading...</div>}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
