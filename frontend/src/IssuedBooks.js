import React, { useState, useEffect } from "react";
import api from "./api";
import { Clock, User, Book as BookIcon, Calendar, Filter, DollarSign } from "lucide-react";

function IssuedBooks() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchIssuedBooks();
  }, [status]);

  const fetchIssuedBooks = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/all-issues?status=${status}`);
      setIssuedBooks(res.data);
    } catch (err) {
      console.error("Failed to load issued books", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Returned": return <span className="badge badge-success" style={{ background: "#4CAF50", color: "white" }}>Returned</span>;
      case "Overdue": return <span className="badge badge-danger" style={{ background: "#F44336", color: "white" }}>Overdue</span>;
      default: return <span className="badge badge-warning" style={{ background: "#FF9800", color: "white" }}>Active</span>;
    }
  };

  const handleReturn = async (id) => {
    if (window.confirm("Mark this book as returned?")) {
      try {
        await api.put(`/return-book/${id}`);
        fetchIssuedBooks();
      } catch (err) {
        alert(err.response?.data?.error || "Error returning book");
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "1.875rem" }}>Issuance Records</h2>
          <p style={{ color: "var(--text-secondary)" }}>Track loans, returns, and overdue fines.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Filter size={18} color="var(--text-muted)" />
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: "180px", padding: "0.6rem" }}
          >
            <option value="">All Records</option>
            <option value="Pending">Active</option>
            <option value="Overdue">Overdue</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Book Details</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Fine</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "3rem" }}>Loading records...</td>
              </tr>
            ) : issuedBooks.length > 0 ? issuedBooks.map((ib) => (
              <tr key={ib.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ padding: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "50%" }}>
                      <User size={16} color="var(--text-secondary)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{ib.user_name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ID: #{ib.user_id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <BookIcon size={16} color="var(--primary)" />
                    <span style={{ fontWeight: 500 }}>{ib.book_title}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                    <Calendar size={14} color="var(--text-muted)" />
                    {new Date(ib.due_date).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  {getStatusBadge(ib.status)}
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 700, color: ib.fine > 0 ? "var(--danger)" : "var(--success)" }}>
                    {ib.fine > 0 && <span>₹</span>}
                    {ib.fine > 0 ? ib.fine : "None"}
                  </div>
                </td>
                <td>
                  {ib.status !== "Returned" ? (
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem", background: "linear-gradient(to right, #8B1E3F, #5A0F2E)" }}
                      onClick={() => handleReturn(ib.id)}
                    >
                      Return
                    </button>
                  ) : (
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Completed</span>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                  No issuance records found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default IssuedBooks;
