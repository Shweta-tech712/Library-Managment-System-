import React, { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import api from "../api";
import { CreditCard, CheckCircle, Clock } from "lucide-react";

function FinesPage() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      const res = await api.get("/admin/fines");
      setFines(res.data);
    } catch (err) {
      console.error("Failed to fetch fines", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (issueId) => {
    if (!window.confirm("Confirm payment received for this fine?")) return;
    
    setProcessingId(issueId);
    try {
      await api.put(`/admin/fines/${issueId}/pay`);
      fetchFines();
    } catch (err) {
      alert(err.response?.data?.message || "Error processing payment");
    } finally {
      setProcessingId(null);
    }
  };

  const totalUnpaid = fines.filter(f => f.fine_status === "Unpaid").reduce((sum, f) => sum + f.fine_amount, 0);

  return (
    <DashboardLayout title="Fine Management">
      <div className="animate-fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h2 style={{ fontSize: "1.875rem" }}>Fine & Payment Processing</h2>
            <p style={{ color: "var(--text-secondary)" }}>Manage user penalties and clear outstanding balances.</p>
          </div>
          <div className="glass-card" style={{ padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ background: "rgba(255, 75, 75, 0.1)", padding: "12px", borderRadius: "50%" }}>
              <CreditCard color="var(--danger)" size={24} />
            </div>
            <div>
              <p className="input-label" style={{ margin: 0 }}>Total Outstanding</p>
              <h3 style={{ margin: 0, fontSize: "1.5rem", color: "var(--danger)" }}>₹{totalUnpaid.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User Details</th>
                <th>Book Title</th>
                <th>Overdue Period</th>
                <th>Fine Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "3rem" }}>Loading fine records...</td>
                </tr>
              ) : fines.length > 0 ? (
                fines.map(fine => (
                  <tr key={fine.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{fine.user_name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{fine.user_email}</div>
                    </td>
                    <td style={{ color: "var(--text-primary)" }}>{fine.book_title}</td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                          Due: {new Date(fine.due_date).toLocaleDateString()}
                        </span>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                          Ret: {fine.return_date ? new Date(fine.return_date).toLocaleDateString() : "Pending"}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.1rem" }}>
                      ₹{fine.fine_amount}
                    </td>
                    <td>
                      <span className={`badge ${fine.fine_status === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                        {fine.fine_status}
                      </span>
                    </td>
                    <td>
                      {fine.fine_status === "Unpaid" ? (
                        <button 
                          className="btn btn-primary" 
                          onClick={() => handlePay(fine.id)}
                          disabled={processingId === fine.id}
                          style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
                        >
                          <CheckCircle size={16} /> {processingId === fine.id ? "Processing..." : "Mark as Paid"}
                        </button>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <CheckCircle size={16} color="var(--success)" /> Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                      <CheckCircle size={48} color="var(--success)" />
                      <p>All clear! No fines found in the system.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default FinesPage;
