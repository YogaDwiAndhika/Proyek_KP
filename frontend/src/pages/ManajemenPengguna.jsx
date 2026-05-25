import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';

export default function ManajemenPengguna() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ id_user: '', username: '', email: '', password: '', role: 'viewer' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/users/${formData.id_user}`, formData);
      } else {
        await api.post('/users', formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (e) {
      alert("Gagal menyimpan pengguna: " + (e.response?.data?.message || 'Error'));
    }
  };

  const handleEdit = (user) => {
    setFormData({ ...user, password: '' });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus pengguna ini?")) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (e) {
        alert("Gagal menghapus pengguna");
      }
    }
  };

  const openNewModal = () => {
    setFormData({ id_user: '', username: '', email: '', password: '', role: 'viewer' });
    setIsEditing(false);
    setShowPassword(false);
    setShowModal(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manajemen Pengguna</h1>
        <button className="btn btn-primary" onClick={openNewModal}>
          <Plus size={18} /> Tambah Pengguna
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Memuat...</td></tr>
              ) : users.map(user => (
                <tr key={user.id_user}>
                  <td>{user.id_user}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td><span style={{ textTransform: 'capitalize' }}>{user.role}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleEdit(user)}>
                        <Edit2 size={18} />
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(user.id_user)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2 className="modal-title">{isEditing ? 'Edit Pengguna' : 'Tambah Pengguna'}</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input type="text" name="username" className="form-input" value={formData.username} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-input" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Password {isEditing && '(kosongkan jika tidak diubah)'}</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPassword ? "text" : "password"} name="password" className="form-input" style={{ paddingRight: '2.5rem' }} value={formData.password} onChange={handleInputChange} required={!isEditing} minLength={6} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select name="role" className="form-input" value={formData.role} onChange={handleInputChange} required>
                    <option value="viewer">Viewer</option>
                    <option value="kasir">Kasir</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
