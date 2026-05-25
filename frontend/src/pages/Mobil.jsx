import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../utils/api';
import useTable from '../hooks/useTable';
import { TableFilter, TablePagination } from '../components/TablePagination';

export default function Mobil() {
  const [data, setData] = useState([]);
  const [pelanggans, setPelanggans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ original_no_rangka: '', no_rangka: '', id_pelanggan: '', no_polisi: '', merk_mobil: '' });
  const [isEditing, setIsEditing] = useState(false);

  const table = useTable(data, 10);




  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/mobil');
      setData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const fetchPelanggans = async () => {
    try {
      const res = await api.get('/pelanggan');
      setPelanggans(res.data);
    } catch (error) {
      console.error('Error fetching pelanggans:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPelanggans();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/mobil/${formData.original_no_rangka}`, formData);
      } else {
        await api.post('/mobil', formData);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData({ ...item, original_no_rangka: item.no_rangka });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      try {
        await api.delete(`/mobil/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }
  };

  const openNewModal = () => {
    setFormData({ original_no_rangka: '', no_rangka: '', id_pelanggan: '', no_polisi: '', merk_mobil: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const getPelangganName = (id_pelanggan) => {
    const p = pelanggans.find(x => x.id_pelanggan === id_pelanggan || x.id_pelanggan === parseInt(id_pelanggan));
    return p ? p.nama_pelanggan : id_pelanggan;
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Data Mobil</h1>
        <button className="btn btn-primary" onClick={openNewModal}>
          <Plus size={18} /> Tambah Mobil
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
                <th onClick={() => table.handleSort('no_rangka')} style={{ cursor: 'pointer' }}>No Rangka {table.sortConfig.key === 'no_rangka' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => table.handleSort('id_pelanggan')} style={{ cursor: 'pointer' }}>Pelanggan {table.sortConfig.key === 'id_pelanggan' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => table.handleSort('no_polisi')} style={{ cursor: 'pointer' }}>No Polisi {table.sortConfig.key === 'no_polisi' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => table.handleSort('merk_mobil')} style={{ cursor: 'pointer' }}>Merk Mobil {table.sortConfig.key === 'merk_mobil' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
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
                  <tr key={item.no_rangka}>
                    <td>{item.no_rangka}</td>
                    <td>{item.pelanggan ? item.pelanggan.nama_pelanggan : getPelangganName(item.id_pelanggan)}</td>
                    <td>{item.no_polisi}</td>
                    <td>{item.merk_mobil}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" onClick={() => handleEdit(item)}>
                          <Edit2 size={18} />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDelete(item.no_rangka)}>
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
              <h2 className="modal-title">{isEditing ? 'Edit Mobil' : 'Tambah Mobil Baru'}</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">No Rangka</label>
                  <input
                    type="text"
                    className="form-input"
                    name="no_rangka"
                    placeholder="Masukkan nomor rangka mobil"
                    value={formData.no_rangka}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pelanggan</label>
                  <select
                    className="form-input"
                    name="id_pelanggan"
                    value={formData.id_pelanggan}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Pilih Pelanggan --</option>
                    {pelanggans.map(p => (
                      <option key={p.id_pelanggan} value={p.id_pelanggan}>
                        {p.id_pelanggan} - {p.nama_pelanggan} - {truncateText(p.nomor_telp, 15)} - {truncateText(p.alamat, 20)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">No Polisi</label>
                  <input
                    type="text"
                    className="form-input"
                    name="no_polisi"
                    placeholder="Masukkan nomor polisi (cth: BG1234AB)"
                    value={formData.no_polisi}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\s+/g, '').toUpperCase();
                      handleInputChange({ target: { name: 'no_polisi', value: val } });
                    }}
                    pattern="[A-Za-z]{1,2}[0-9]{1,4}[A-Za-z]{1,3}"
                    maxLength="9"
                    title="Format tanpa spasi: 1-2 Huruf, 1-4 Angka, 1-3 Huruf (Contoh: B1234ABC)"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Merk Mobil</label>
                  <input
                    type="text"
                    className="form-input"
                    name="merk_mobil"
                    placeholder="Masukkan merk mobil (cth: Toyota Avanza)"
                    value={formData.merk_mobil}
                    onChange={handleInputChange}
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
