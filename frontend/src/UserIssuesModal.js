import React, { useState, useEffect } from "react";
import api from "./api";
import { BookOpen } from "lucide-react";

function UserIssuesModal({ user, onClose }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user]);

  const fetchIssues = async () => {
    try {
      const res = await api.get(`/admin/users/${user.id}/issues`);
      setIssues(res.data);
    } catch (err) {
      setError("Failed to load user issues.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
      background: "rgba(0,0,0,0.85)", display: "flex", 
      alignItems: "center", justifyContent: "center", 
      zIndex: 1000, backdropFilter: "blur(8px)" 
    }}>
      <div className="glass-card" style={{ width: "700px", maxWidth: "95%", maxHeight: "90vh", display: "flex", flexDirection: "column", background: "var(--bg-card)", padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2rem", borderBottom: "1px solid var(--glass-border)" }}>
          <div>
            <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BookOpen size={20} color="var(--primary)" />
              {user.name}'s Issued Books
            </h3>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              {user.email} • {user.role}
            </p>
          </div>
          <button className="btn" style={{ background: "transparent", padding: 0 }} onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: "2rem", overflowY: "auto", flex: 1 }}>
          {error && <div style={{ color: "var(--danger)", marginBottom: "1rem" }}>{error}</div>}
          
          {loading ? (
            <div style={{ textAlign: "center", color: "var(--text-muted)" }}>Loading issues...</div>
          ) : issues.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map(issue => (
                    <tr key={issue.id}>
                      <td style={{ fontWeight: 600 }}>{issue.book_title}</td>
                      <td>{new Date(issue.issue_date).toLocaleDateString()}</td>
                      <td>{new Date(issue.due_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${
                          issue.status === 'Returned' ? 'badge-success' : 
                          issue.status === 'Overdue' ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {issue.status}
                        </span>
                      </td>
                      <td style={{ color: issue.fine > 0 ? "var(--danger)" : "var(--text-secondary)" }}>
                        ₹{issue.fine}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem 0" }}>
              No books have been issued to this user.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserIssuesModal;
