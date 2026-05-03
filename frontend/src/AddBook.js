import React, { useState, useEffect } from "react";
import api from "./api";
import { Plus, BookOpen, User, Tag, Hash, Save } from "lucide-react";

function AddBook({ initialData, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    total_copies: 1,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        author: initialData.author,
        category: initialData.category || "",
        total_copies: initialData.total_copies,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const value = e.target.type === "number" ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        // Edit Mode
        await api.put(`/admin/books/${initialData.id}`, formData);
        setMessage("Book updated successfully!");
      } else {
        // Add Mode
        await api.post("/admin/books/manage", formData);
        setMessage("Book added successfully!");
      }
      
      setTimeout(() => {
        onSuccess();
        if (!initialData) setFormData({ title: "", author: "", category: "", total_copies: 1 });
      }, 1500);
      
    } catch (err) {
      setMessage(err.response?.data?.message || "Error processing request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div className="input-group">
            <label className="input-label">Book Title</label>
            <div style={{ position: "relative" }}>
              <BookOpen size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                name="title"
                placeholder="e.g. Clean Code"
                value={formData.title}
                onChange={handleChange}
                style={{ paddingLeft: "42px" }}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Author</label>
            <div style={{ position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                name="author"
                placeholder="e.g. Robert Martin"
                value={formData.author}
                onChange={handleChange}
                style={{ paddingLeft: "42px" }}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Category</label>
            <div style={{ position: "relative" }}>
              <Tag size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                style={{ paddingLeft: "42px" }}
              >
                <option value="General">General</option>
                <option value="Science">Science</option>
                <option value="Technology">Technology</option>
                <option value="History">History</option>
                <option value="Literature">Literature</option>
                <option value="Mathematics">Mathematics</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Inventory Size</label>
            <div style={{ position: "relative" }}>
              <Hash size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="number"
                name="total_copies"
                value={formData.total_copies}
                onChange={handleChange}
                min="1"
                style={{ paddingLeft: "42px" }}
                required
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: "100%", marginTop: "1rem" }}
          disabled={loading}
        >
          {initialData ? <Save size={18} /> : <Plus size={18} />}
          {loading ? "Processing..." : (initialData ? "Update Record" : "Add to Library")}
        </button>
      </form>

      {message && (
        <div style={{ 
          marginTop: "1.5rem", 
          padding: "1rem", 
          borderRadius: "10px", 
          textAlign: "center",
          fontWeight: 600,
          fontSize: "0.9rem",
          background: message.includes("Error") ? "rgba(244, 67, 54, 0.1)" : "rgba(76, 175, 80, 0.1)",
          color: message.includes("Error") ? "var(--danger)" : "var(--success)",
          border: `1px solid ${message.includes("Error") ? "rgba(244, 67, 54, 0.2)" : "rgba(76, 175, 80, 0.2)"}`
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default AddBook;
