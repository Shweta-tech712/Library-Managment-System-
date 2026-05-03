import React, { useState, useEffect } from "react";
import api from "./api";

function UserModal({ initialData, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        password: "" // Keep empty on edit unless changing
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (initialData) {
        // Edit
        const dataToSend = { ...formData };
        if (!dataToSend.password) delete dataToSend.password; // Don't send empty password on edit
        await api.put(`/admin/users/${initialData.id}`, dataToSend);
      } else {
        // Add
        if (!formData.password) {
          setError("Password is required for new users.");
          setLoading(false);
          return;
        }
        await api.post("/admin/users", formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
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
      <div className="glass-card" style={{ width: "400px", maxWidth: "95%", background: "var(--bg-card)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ margin: 0 }}>{initialData ? "Edit User" : "Add New User"}</h3>
          <button className="btn" style={{ background: "transparent", padding: 0 }} onClick={onClose}>✕</button>
        </div>

        {error && (
          <div style={{ padding: "0.75rem", background: "rgba(244, 67, 54, 0.1)", color: "var(--danger)", borderRadius: "var(--radius-sm)", marginBottom: "1rem", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="jane.doe@college.edu"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">
              Password {initialData && <span style={{ textTransform: "none", color: "var(--text-muted)", fontWeight: "normal" }}>(Leave blank to keep current)</span>}
            </label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required={!initialData} 
              placeholder="••••••••"
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserModal;
