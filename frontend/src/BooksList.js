import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import { Search, Filter, Plus, Edit2, Trash2, Book as BookIcon, Send, Eye } from "lucide-react";
import AddBook from "./AddBook";
import IssueModal from "./IssueModal";

function BooksList() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [issuingBook, setIssuingBook] = useState(null);

  const categories = ["General", "Science", "Technology", "History", "Literature", "Mathematics"];

  useEffect(() => {
    setPage(1);
  }, [search, category, status]);

  useEffect(() => {
    fetchBooks();
  }, [search, category, status, page]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/books?search=${search}&category=${category}&status=${status}&page=${page}&per_page=10`);
      if (res.data && Array.isArray(res.data.books)) {
        setBooks(res.data.books);
        setTotalPages(res.data.pages || 1);
      } else {
        setBooks(res.data);
      }
    } catch (err) {
      console.error("Error fetching books", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book? This will remove all records.")) {
      try {
        await api.delete(`/admin/books/${id}`);
        fetchBooks();
      } catch (err) {
        alert(err.response?.data?.message || "Error deleting book");
      }
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowAddModal(true);
  };

  const handleIssue = (book) => {
    setIssuingBook(book);
    setShowIssueModal(true);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "1.875rem" }}>Book Inventory</h2>
          <p style={{ color: "var(--text-secondary)" }}>Manage your collection and track availability.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingBook(null); setShowAddModal(true); }}>
          <Plus size={20} />
          Add New Book
        </button>
      </div>

      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "40px" }}
          />
        </div>
        <div style={{ minWidth: "200px" }}>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div style={{ minWidth: "200px" }}>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="issued">Issued</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Book Info</th>
              <th>Category</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "3rem" }}>Loading books...</td>
              </tr>
            ) : books.length > 0 ? books.map((book) => (
              <tr key={book.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ background: "rgba(255,75,75,0.1)", padding: "10px", borderRadius: "12px" }}>
                      <BookIcon size={20} color="var(--primary)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{book.title}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{book.author}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-info">{book.category}</span>
                </td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <div style={{ fontSize: "0.9rem" }}>
                      <span style={{ fontWeight: 700, color: book.available_copies > 0 ? "var(--success)" : "var(--danger)" }}>
                        {book.available_copies}
                      </span>
                      <span style={{ color: "var(--text-muted)" }}> / {book.total_copies} available</span>
                    </div>
                    <div style={{ width: "100px", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
                      <div style={{ 
                        width: `${(book.available_copies / book.total_copies) * 100}%`, 
                        height: "100%", 
                        background: book.available_copies > 0 ? "var(--success)" : "var(--danger)",
                        borderRadius: "2px"
                      }} />
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="btn btn-secondary" style={{ padding: "0.5rem" }} onClick={() => navigate(`/books/${book.id}`)} title="View Details">
                      <Eye size={16} />
                    </button>
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: "0.5rem 0.75rem", fontSize: "0.75rem" }} 
                      onClick={() => handleIssue(book)}
                      disabled={book.available_copies <= 0}
                    >
                      <Send size={14} />
                      Issue
                    </button>
                    <button className="btn btn-secondary" style={{ padding: "0.5rem" }} onClick={() => handleEdit(book)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn btn-danger" style={{ padding: "0.5rem" }} onClick={() => handleDelete(book.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                  No books found matches your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Page {page} of {totalPages}
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ padding: "0.5rem 1rem" }}
            >
              Previous
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ padding: "0.5rem 1rem" }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(8px)" }}>
          <div className="glass-card" style={{ width: "500px", maxWidth: "95%", background: "var(--bg-card)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <h3 style={{ margin: 0 }}>{editingBook ? "Edit Book Details" : "Add New Collection"}</h3>
              <button className="btn" style={{ background: "transparent", padding: 0 }} onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <AddBook 
              initialData={editingBook} 
              onSuccess={() => { setShowAddModal(false); fetchBooks(); }} 
            />
          </div>
        </div>
      )}

      {showIssueModal && (
        <IssueModal 
          book={issuingBook} 
          onClose={() => setShowIssueModal(false)} 
          onSuccess={() => { setShowIssueModal(false); fetchBooks(); }} 
        />
      )}
    </div>
  );
}

export default BooksList;
