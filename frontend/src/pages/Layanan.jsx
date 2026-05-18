import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../utils/api';
import useTable from '../hooks/useTable';
import { TableFilter, TablePagination } from '../components/TablePagination';

export default function Layanan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id_layanan: '', jenis_layanan: '', biaya: '', keterangan: '' });
  const [isEditing, setIsEditing] = useState(false);

  const table = useTable(data, 10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/layanan');
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
        await api.put(`/layanan/${formData.id_layanan}`, formData);
      } else {
        await api.post('/layanan', formData);
      }
      setShowModal(false);
      fetchData();
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
        await api.delete(`/layanan/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }
  };

  const openNewModal = () => {
    setFormData({ id_layanan: '', jenis_layanan: '', biaya: '', keterangan: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Data Layanan</h1>
        <button className="btn btn-primary" onClick={openNewModal}>
          <Plus size={18} /> Tambah Layanan
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
                <th onClick={() => table.handleSort('id_layanan')} style={{ cursor: 'pointer' }}>ID {table.sortConfig.key === 'id_layanan' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => table.handleSort('jenis_layanan')} style={{ cursor: 'pointer' }}>Jenis Layanan {table.sortConfig.key === 'jenis_layanan' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => table.handleSort('biaya')} style={{ cursor: 'pointer' }}>Biaya {table.sortConfig.key === 'biaya' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => table.handleSort('keterangan')} style={{ cursor: 'pointer' }}>Keterangan {table.sortConfig.key === 'keterangan' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
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
                  <tr key={item.id_layanan}>
                    <td>{item.id_layanan}</td>
                    <td>{item.jenis_layanan}</td>
                    <td>Rp {new Intl.NumberFormat('id-ID').format(item.biaya)}</td>
                    <td>{item.keterangan || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" onClick={() => handleEdit(item)}>
                          <Edit2 size={18} />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDelete(item.id_layanan)}>
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
              <h2 className="modal-title">{isEditing ? 'Edit Layanan' : 'Tambah Layanan Baru'}</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Jenis Layanan</label>
                  <input
                    type="text"
                    className="form-input"
                    name="jenis_layanan"
                    value={formData.jenis_layanan}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Biaya</label>
                  <input
                    type="number"
                    className="form-input"
                    name="biaya"
                    value={formData.biaya}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Keterangan</label>
                  <textarea
                    className="form-input"
                    name="keterangan"
                    value={formData.keterangan || ''}
                    onChange={handleInputChange}
                    rows="3"
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
