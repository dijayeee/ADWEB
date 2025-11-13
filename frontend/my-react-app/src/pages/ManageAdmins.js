import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './ManageAdmins.css';

export default function ManageAdmins() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user?.role !== 'admin') {
    return (
      <div className="manage-container">
        <p className="error">Access Denied: Admin only</p>
        <a href="/books">← Back to Books</a>
      </div>
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/api/admin/users');
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const { data } = await API.post('/api/admin/create-admin', { name, email, password });
      setSuccess('Admin created successfully!');
      setName('');
      setEmail('');
      setPassword('');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin');
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    try {
      const { data } = await API.put(`/api/admin/users/${userId}/role`, { role: 'admin' });
      setSuccess('User promoted to admin!');
      fetchUsers();
    } catch (err) {
      setError('Failed to promote user');
    }
  };

  const handleDemoteToUser = async (userId) => {
    try {
      const { data } = await API.put(`/api/admin/users/${userId}/role`, { role: 'user' });
      setSuccess('Admin demoted to user!');
      fetchUsers();
    } catch (err) {
      setError('Failed to demote admin');
    }
  };

  return (
    <div className="manage-container">
      <h2>👥 Manage Admins</h2>
      
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className="create-admin-section">
        <h3>Create New Admin</h3>
        <form onSubmit={handleCreateAdmin} className="admin-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Create Admin</button>
        </form>
      </div>

      <div className="users-section">
        <h3>All Users</h3>
        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge role-${u.role}`}>{u.role}</span>
                  </td>
                  <td>
                    {u.role === 'user' ? (
                      <button
                        onClick={() => handlePromoteToAdmin(u._id)}
                        className="btn-promote"
                      >
                        Promote to Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDemoteToUser(u._id)}
                        className="btn-demote"
                      >
                        Demote to User
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <a href="/books" className="btn-back">← Back to Books</a>
    </div>
  );
}
