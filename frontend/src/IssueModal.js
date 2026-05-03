import React, { useState, useEffect } from "react";
import api from "./api";
import { User, Calendar, Send, X } from "lucide-react";

function IssueModal({ book, onClose, onSuccess }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchUsers();
    const date = new Date();
    date.setDate(date.getDate() + 14);
    setDueDate(date.toISOString().split("T")[0]);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      setError("Please select a user");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      await api.post("/issue", {
        book_id: book.id,
        user_id: selectedUser,
        due_date: dueDate
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to issue book");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(8px)" }}>
        <div className="glass-card animate-fade-in" style={{ width: "400px", textAlign: "center", padding: "3rem" }}>
          <div style={{ width: "60px", height: "60px", background: "rgba(76, 175, 80, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", border: "1px solid var(--success)" }}>
            <Send size={30} color="var(--success)" />
          </div>
          <h3 style={{ color: "var(--success)", marginBottom: "0.5rem" }}>Success!</h3>
          <p style={{ color: "var(--text-secondary)" }}>Book has been issued to the member.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(8px)" }}>
      <div className="glass-card animate-fade-in" style={{ width: "450px", maxWidth: "90%", background: "var(--bg-card)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h3 style={{ margin: 0 }}>Issue Book</h3>
          <button className="btn" style={{ background: "transparent", padding: 0 }} onClick={onClose}><X size={20} /></button>
        </div>

        <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Issuing Book:</p>
          <p style={{ fontWeight: 600, color: "var(--primary)" }}>{book.title}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Select Member</label>
            <div style={{ position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <select 
                value={selectedUser} 
                onChange={(e) => setSelectedUser(e.target.value)}
                style={{ paddingLeft: "42px" }}
                required
              >
                <option value="">Choose a member...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Return Due Date</label>
            <div style={{ position: "relative" }}>
              <Calendar size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ paddingLeft: "42px" }}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {error && <p style={{ color: "var(--danger)", fontSize: "0.875rem", marginBottom: "1rem", textAlign: "center" }}>{error}</p>}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={loading}
          >
            <Send size={18} />
            {loading ? "Processing..." : "Confirm Issuance"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default IssueModal;
