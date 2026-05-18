import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../utils/api';
import useTable from '../hooks/useTable';
import { TableFilter, TablePagination } from '../components/TablePagination';

export default function Pelanggan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id_pelanggan: '', nama_pelanggan: '', nomor_telp: '', alamat: '' });
  const [isEditing, setIsEditing] = useState(false);

  const table = useTable(data, 10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pelanggan');
      setData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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
        await api.put(`/pelanggan/${formData.id_pelanggan}`, formData);
      } else {
        await api.post('/pelanggan', formData);
      }
      setShowModal(false);
      fetchData(); // reload data
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      try {
        await api.delete(`/pelanggan/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }
  };

  const openNewModal = () => {
    setFormData({ id_pelanggan: '', nama_pelanggan: '', nomor_telp: '', alamat: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Data Pelanggan</h1>
        <button className="btn btn-primary" onClick={openNewModal}>
          <Plus size={18} /> Tambah Pelanggan
        </button>
      </div>

      <div className="card">
        <TableFilter 
          limit={table.limit} setLimit={table.setLimit}
          searchTerm={table.searchTerm} setSearchTerm={table.setSearchTerm}
          setCurrentPage={table.setCurrentPage}
        />
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => table.handleSort('id_pelanggan')} style={{ cursor: 'pointer' }}>ID {table.sortConfig.key === 'id_pelanggan' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => table.handleSort('nama_pelanggan')} style={{ cursor: 'pointer' }}>Nama Pelanggan {table.sortConfig.key === 'nama_pelanggan' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => table.handleSort('nomor_telp')} style={{ cursor: 'pointer' }}>Nomor Telepon {table.sortConfig.key === 'nomor_telp' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => table.handleSort('alamat')} style={{ cursor: 'pointer' }}>Alamat {table.sortConfig.key === 'alamat' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th style={{ width: '100px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Memuat...</td></tr>
              ) : table.paginatedData.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Tidak ada data</td></tr>
              ) : (
                table.paginatedData.map((item) => (
                  <tr key={item.id_pelanggan}>
                    <td>{item.id_pelanggan}</td>
                    <td>{item.nama_pelanggan}</td>
                    <td>{item.nomor_telp}</td>
                    <td>{item.alamat}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" onClick={() => handleEdit(item)}>
                          <Edit2 size={18} />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDelete(item.id_pelanggan)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <TablePagination 
          currentPage={table.currentPage} setCurrentPage={table.setCurrentPage}
          totalPages={table.totalPages} totalData={table.processedData.length}
        />
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{isEditing ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Pelanggan</label>
                  <input
                    type="text"
                    className="form-input"
                    name="nama_pelanggan"
                    value={formData.nama_pelanggan}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nomor Telepon</label>
                  <input
                    type="text"
                    className="form-input"
                    name="nomor_telp"
                    value={formData.nomor_telp}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Alamat</label>
                  <textarea
                    className="form-input"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
