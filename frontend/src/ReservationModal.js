import React, { useState, useEffect } from "react";
import api from "./api";

function ReservationModal({ bookId, onClose, onSuccess }) {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
      if (res.data.length > 0) setSelectedUserId(res.data[0].id);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError("Please select a user.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await api.post(`/books/${bookId}/reserve`, { user_id: selectedUserId });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reserve book.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ 
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
      background: "rgba(0,0,0,0.85)", display: "flex", 
      alignItems: "center", justifyContent: "center", 
      zIndex: 1000, backdropFilter: "blur(8px)" 
    }}>
      <div className="glass-card" style={{ width: "400px", maxWidth: "95%", background: "var(--bg-card)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ margin: 0 }}>Reserve Book</h3>
          <button className="btn" style={{ background: "transparent", padding: 0 }} onClick={onClose}>✕</button>
        </div>

        {error && (
          <div style={{ padding: "0.75rem", background: "rgba(244, 67, 54, 0.1)", color: "var(--danger)", borderRadius: "var(--radius-sm)", marginBottom: "1rem", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Select User for Waitlist</label>
            {loading ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading users...</p>
            ) : (
              <select 
                value={selectedUserId} 
                onChange={(e) => setSelectedUserId(e.target.value)} 
                required
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            )}
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading || submitting}>
              {submitting ? "Reserving..." : "Confirm Reservation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReservationModal;
