import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import { useAuth } from "./context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import BrandLogo from "./components/BrandLogo";

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      login(res.data.access_token);
      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      if (!err.response) {
        setMessage("Connection failed. Is the backend server running?");
      } else {
        setMessage(err.response.data.message || "Invalid Credentials");
      }
    } finally {

      setLoading(false);
    }
  };


  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent), radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.05), transparent)"
    }}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card" 
        style={{ width: "400px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ 
            background: "linear-gradient(135deg, var(--primary), var(--primary-maroon))", 
            width: "60px", 
            height: "60px", 
            borderRadius: "18px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            boxShadow: "0 8px 32px rgba(255, 75, 75, 0.3)"
          }}>
            <BrandLogo size={32} />
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.025em" }}>LibNova</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Sign in to manage your library
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail 
                size={18} 
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} 
              />
              <input
                type="email"
                placeholder="admin@college.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: "40px" }}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: "relative" }}>
              <Lock 
                size={18} 
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} 
              />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: "40px" }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {message && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              color: "var(--danger)", 
              textAlign: "center", 
              marginTop: "1.5rem",
              fontSize: "0.875rem",
              padding: "0.5rem",
              background: "rgba(239, 68, 68, 0.1)",
              borderRadius: "var(--radius-sm)"
            }}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default Login;
