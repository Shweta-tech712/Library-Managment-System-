import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Clock, LogOut, Library, Users, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "./BrandLogo";

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/books", icon: BookOpen, label: "Manage Books" },
    { path: "/issued", icon: Clock, label: "Issued Books" },
    { path: "/users", icon: Users, label: "Manage Users" },
    { path: "/fines", icon: CreditCard, label: "Fine Management" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="sidebar glass-card"
      style={{
        width: "260px",
        height: "calc(100vh - 2rem)",
        margin: "1rem",
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem",
        position: "sticky",
        top: "1rem"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
        <div style={{ 
          background: "linear-gradient(135deg, var(--primary), var(--primary-maroon))", 
          padding: "6px", 
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(255, 75, 75, 0.2)"
        }}>
          <BrandLogo size={24} />
        </div>
        <h2 style={{ fontSize: "1.25rem", margin: 0, fontWeight: 800, tracking: "-0.025em" }}>LibNova</h2>
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive ? "active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                background: isActive ? "rgba(255, 75, 75, 0.15)" : "transparent",
                transition: "var(--transition)",
                fontWeight: isActive ? 600 : 500
              }}
            >
              <Icon size={20} color={isActive ? "var(--primary)" : "var(--text-secondary)"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="btn"
        style={{
          marginTop: "auto",
          justifyContent: "flex-start",
          background: "transparent",
          color: "var(--danger)",
          padding: "0.75rem 1rem",
          width: "100%"
        }}
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>

      <style>{`
        .nav-link:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          color: var(--text-primary) !important;
        }
        .nav-link.active:hover {
          background: rgba(255, 75, 75, 0.2) !important;
        }
      `}</style>
    </motion.div>
  );
};

export default Sidebar;
