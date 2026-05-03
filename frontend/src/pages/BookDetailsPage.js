import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import DashboardLayout from "../layout/DashboardLayout";
import { Book as BookIcon, ArrowLeft, Clock, CheckCircle, AlertTriangle, Users } from "lucide-react";
import ReservationModal from "../ReservationModal";

function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reservations, setReservations] = useState([]);
  const [showReservationModal, setShowReservationModal] = useState(false);

  useEffect(() => {
    fetchBookDetails();
    fetchReservations();
  }, [id]);

  const fetchReservations = async () => {
    try {
      const res = await api.get(`/books/${id}/reservations`);
      setReservations(res.data);
    } catch (err) {
      console.error("Failed to fetch reservations", err);
    }
  };

  const fetchBookDetails = async () => {
    try {
      const res = await api.get(`/books/${id}`);
      setBook(res.data);
    } catch (err) {
      setError("Failed to load book details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Book Details">
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>Loading...</div>
      </DashboardLayout>
    );
  }

  if (error || !book) {
    return (
      <DashboardLayout title="Book Details">
        <div style={{ color: "var(--danger)", padding: "2rem" }}>{error || "Book not found"}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Book Details">
      <div className="animate-fade-in">
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate("/books")} 
          style={{ marginBottom: "2rem", padding: "0.5rem 1rem" }}
        >
          <ArrowLeft size={16} /> Back to Inventory
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "2rem", marginBottom: "2rem" }}>
          {/* Main Info Card */}
          <div className="glass-card" style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
            <div style={{ 
              background: "rgba(255,75,75,0.1)", 
              padding: "2rem", 
              borderRadius: "var(--radius-md)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <BookIcon size={64} color="var(--primary)" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                <h2 style={{ fontSize: "2rem", margin: 0 }}>{book.title}</h2>
                <span className="badge badge-info">{book.category}</span>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.25rem", marginBottom: "1.5rem" }}>By {book.author}</p>
              
              <div style={{ display: "flex", gap: "2rem" }}>
                <div>
                  <p className="input-label">Total Copies</p>
                  <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>{book.total_copies}</p>
                </div>
                <div>
                  <p className="input-label">Available Copies</p>
                  <p style={{ fontSize: "1.5rem", fontWeight: 700, color: book.available_copies > 0 ? "var(--success)" : "var(--danger)" }}>
                    {book.available_copies}
                  </p>
                </div>
                <div>
                  <p className="input-label">Currently Issued</p>
                  <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--warning)" }}>
                    {book.total_copies - book.available_copies}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Status Card */}
          <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            {book.available_copies > 0 ? (
              <>
                <CheckCircle size={48} color="var(--success)" style={{ marginBottom: "1rem" }} />
                <h3 style={{ color: "var(--success)" }}>Available for Issue</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                  There are {book.available_copies} copies currently available in the library.
                </p>
              </>
            ) : (
              <>
                <AlertTriangle size={48} color="var(--danger)" style={{ marginBottom: "1rem" }} />
                <h3 style={{ color: "var(--danger)" }}>Out of Stock</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.5rem", marginBottom: "1rem" }}>
                  All copies of this book are currently issued.
                </p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setShowReservationModal(true)}
                >
                  Reserve Book
                </button>
              </>
            )}
          </div>
        </div>

        {/* Reservations / Waitlist */}
        <div className="glass-card" style={{ marginBottom: "2rem" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <Users size={20} color="var(--primary)" /> Waitlist Queue
          </h3>
          {reservations && reservations.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Reservation Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((res) => (
                    <tr key={res.id}>
                      <td style={{ fontWeight: 600 }}>{res.user_name}</td>
                      <td>{res.user_email}</td>
                      <td>{new Date(res.reservation_date).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${
                          res.status === 'Available for Pickup' ? 'badge-success' : 
                          res.status === 'Fulfilled' ? 'badge-info' : 'badge-warning'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "1rem" }}>
              No one is currently waiting for this book.
            </p>
          )}
        </div>

        {/* Issue History */}
        <div className="glass-card">
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <Clock size={20} color="var(--primary)" /> Issue History
          </h3>
          
          {book.history && book.history.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Issued To</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                    <th>Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {book.history.map((issue) => (
                    <tr key={issue.id}>
                      <td style={{ fontWeight: 600 }}>{issue.user_name}</td>
                      <td>{new Date(issue.issue_date).toLocaleDateString()}</td>
                      <td>{new Date(issue.due_date).toLocaleDateString()}</td>
                      <td>{issue.return_date ? new Date(issue.return_date).toLocaleDateString() : "-"}</td>
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
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem" }}>This book has never been issued.</p>
          )}
        </div>
      </div>

      {showReservationModal && (
        <ReservationModal
          bookId={id}
          onClose={() => setShowReservationModal(false)}
          onSuccess={() => {
            setShowReservationModal(false);
            fetchReservations();
          }}
        />
      )}
    </DashboardLayout>
  );
}

export default BookDetailsPage;
