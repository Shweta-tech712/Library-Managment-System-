import React, { useState, useEffect } from "react";
import api from "./api";
import { Search, Plus, Edit2, Trash2, User as UserIcon, BookOpen } from "lucide-react";
import UserModal from "./UserModal";
import UserIssuesModal from "./UserIssuesModal";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  
  const [showUserModal, setShowUserModal] = useState(false);
  const [showIssuesModal, setShowIssuesModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUserForIssues, setSelectedUserForIssues] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || "Error deleting user");
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleViewIssues = (user) => {
    setSelectedUserForIssues(user);
    setShowIssuesModal(true);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "1.875rem" }}>User Directory</h2>
          <p style={{ color: "var(--text-secondary)" }}>Manage students, faculty, and administrators.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingUser(null); setShowUserModal(true); }}>
          <Plus size={20} />
          Add User
        </button>
      </div>

      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "40px" }}
          />
        </div>
        <div style={{ minWidth: "200px" }}>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="faculty">Faculty</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User Info</th>
              <th>Role</th>
              <th>Active Issues</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "3rem" }}>Loading users...</td>
              </tr>
            ) : filteredUsers.length > 0 ? filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ background: "rgba(255,75,75,0.1)", padding: "10px", borderRadius: "12px" }}>
                      <UserIcon size={20} color="var(--primary)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{user.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${user.role === 'admin' ? 'badge-danger' : user.role === 'faculty' ? 'badge-info' : 'badge-success'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: user.active_issues > 0 ? "var(--warning)" : "var(--text-secondary)" }}>
                    {user.active_issues || 0} books
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: "0.5rem 0.75rem", fontSize: "0.75rem" }} 
                      onClick={() => handleViewIssues(user)}
                    >
                      <BookOpen size={14} />
                      Issues
                    </button>
                    <button className="btn btn-secondary" style={{ padding: "0.5rem" }} onClick={() => handleEdit(user)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn btn-danger" style={{ padding: "0.5rem" }} onClick={() => handleDelete(user.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showUserModal && (
        <UserModal 
          initialData={editingUser} 
          onClose={() => setShowUserModal(false)}
          onSuccess={() => { setShowUserModal(false); fetchUsers(); }} 
        />
      )}

      {showIssuesModal && (
        <UserIssuesModal 
          user={selectedUserForIssues} 
          onClose={() => setShowIssuesModal(false)} 
        />
      )}
    </div>
  );
}

export default UsersList;
