import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../utils/api';
import useTable from '../hooks/useTable';
import { TableFilter, TablePagination } from '../components/TablePagination';

export default function Sparepart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id_sparepart: '', nama_sparepart: '', merk: '', harga_satuan: '' });
  const [isEditing, setIsEditing] = useState(false);

  const table = useTable(data, 10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sparepart');
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
        await api.put(`/sparepart/${formData.id_sparepart}`, formData);
      } else {
        await api.post('/sparepart', formData);
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
        await api.delete(`/sparepart/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }
  };

  const openNewModal = () => {
    setFormData({ id_sparepart: '', nama_sparepart: '', merk: '', harga_satuan: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Data Sparepart</h1>
        <button className="btn btn-primary" onClick={openNewModal}>
          <Plus size={18} /> Tambah Sparepart
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
                <th onClick={() => table.handleSort('id_sparepart')} style={{ cursor: 'pointer' }}>ID {table.sortConfig.key === 'id_sparepart' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => table.handleSort('nama_sparepart')} style={{ cursor: 'pointer' }}>Nama Sparepart {table.sortConfig.key === 'nama_sparepart' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => table.handleSort('merk')} style={{ cursor: 'pointer' }}>Merk {table.sortConfig.key === 'merk' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => table.handleSort('harga_satuan')} style={{ cursor: 'pointer' }}>Harga Satuan {table.sortConfig.key === 'harga_satuan' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
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
                  <tr key={item.id_sparepart}>
                    <td>{item.id_sparepart}</td>
                    <td>{item.nama_sparepart}</td>
                    <td>{item.merk}</td>
                    <td>Rp {new Intl.NumberFormat('id-ID').format(item.harga_satuan)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" onClick={() => handleEdit(item)}>
                          <Edit2 size={18} />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDelete(item.id_sparepart)}>
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
              <h2 className="modal-title">{isEditing ? 'Edit Sparepart' : 'Tambah Sparepart Baru'}</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Sparepart</label>
                  <input
                    type="text"
                    className="form-input"
                    name="nama_sparepart"
                    value={formData.nama_sparepart}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Merk</label>
                  <input
                    type="text"
                    className="form-input"
                    name="merk"
                    value={formData.merk}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Harga Satuan</label>
                  <input
                    type="number"
                    className="form-input"
                    name="harga_satuan"
                    value={formData.harga_satuan}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
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
