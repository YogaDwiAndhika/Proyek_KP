import { useState, useEffect, useContext } from 'react';
import { Plus, Edit2, Trash2, FileText } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../utils/api';
import useTable from '../hooks/useTable';
import { TableFilter, TablePagination } from '../components/TablePagination';
import TransaksiFormModal from '../components/TransaksiFormModal';
import TransaksiDetailModal from '../components/TransaksiDetailModal';

export default function Transaksi() {
  const [data, setData] = useState([]);
  const [mobils, setMobils] = useState([]);
  const [sparepartsList, setSparepartsList] = useState([]);
  const [layanansList, setLayanansList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  
  const [formData, setFormData] = useState({ 
    id_transaksi: '', 
    id_user: null, // Default to null for now since auth isn't built
    no_rangka: '', 
    tanggal_transaksi: new Date().toISOString().split('T')[0],
    km_kendaraan: '',
    total_harga: '',
    spareparts: [],
    layanans: []
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useContext(AuthContext);

  const table = useTable(data, 10);




  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transaksi');
      setData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const fetchRelatedData = async () => {
    try {
      const mRes = await api.get('/mobil');
      const spRes = await api.get('/sparepart');
      const layRes = await api.get('/layanan');
      setMobils(mRes.data || []);
      setSparepartsList(spRes.data || []);
      setLayanansList(layRes.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRelatedData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // The rest of logic moved inside TransaksiFormModal but we keep state here

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/transaksi/${formData.id_transaksi}`, formData);
      } else {
        await api.post('/transaksi', formData);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Gagal menyimpan data: ' + (error.response?.data?.message || 'Terjadi kesalahan pada server'));
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id_transaksi: item.id_transaksi,
      id_user: item.id_user,
      no_rangka: item.no_rangka,
      tanggal_transaksi: item.tanggal_transaksi,
      km_kendaraan: item.km_kendaraan,
      total_harga: item.total_harga,
      spareparts: item.detail_spareparts ? item.detail_spareparts.map(sp => ({ id_sparepart: sp.id_sparepart, quantity: sp.quantity, record_harga_satuan: sp.record_harga_satuan })) : [],
      layanans: item.detail_layanans ? item.detail_layanans.map(lay => ({ id_layanan: lay.id_layanan, record_biaya: lay.record_biaya })) : []
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleViewDetail = (item) => {
    setSelectedDetail(item);
    setShowDetailModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus transaksi ini?')) {
      try {
        await api.delete(`/transaksi/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }
  };

  const openNewModal = () => {
    setFormData({ 
      id_transaksi: '', 
      id_user: null, 
      no_rangka: '', 
      tanggal_transaksi: new Date().toISOString().split('T')[0],
      km_kendaraan: '',
      total_harga: '',
      spareparts: [],
      layanans: []
    });
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Data Transaksi</h1>
        {user?.role !== 'viewer' && (
          <button className="btn btn-primary" onClick={openNewModal}>
            <Plus size={18} /> Tambah Transaksi
          </button>
        )}
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
                <th onClick={() => table.handleSort('id_transaksi')} style={{ cursor: 'pointer' }}>ID {table.sortConfig.key === 'id_transaksi' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => table.handleSort('tanggal_transaksi')} style={{ cursor: 'pointer' }}>Tanggal {table.sortConfig.key === 'tanggal_transaksi' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => table.handleSort('no_rangka')} style={{ cursor: 'pointer' }}>Mobil {table.sortConfig.key === 'no_rangka' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th>Pelanggan</th>
                <th onClick={() => table.handleSort('km_kendaraan')} style={{ cursor: 'pointer' }}>KM Kendaraan {table.sortConfig.key === 'km_kendaraan' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => table.handleSort('total_harga')} style={{ cursor: 'pointer' }}>Total Harga (Rp) {table.sortConfig.key === 'total_harga' ? (table.sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th style={{ width: '140px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center' }}>Memuat...</td></tr>
              ) : table.paginatedData.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center' }}>Tidak ada data</td></tr>
              ) : (
                table.paginatedData.map((item) => (
                  <tr key={item.id_transaksi}>
                    <td>{item.id_transaksi}</td>
                    <td>{item.tanggal_transaksi}</td>
                    <td>{item.mobil ? item.mobil.no_polisi : item.no_rangka}</td>
                    <td>{item.mobil && item.mobil.pelanggan ? item.mobil.pelanggan.nama_pelanggan : '-'}</td>
                    <td>{item.km_kendaraan}</td>
                    <td>{new Intl.NumberFormat('id-ID').format(item.total_harga)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" style={{ color: '#3b82f6' }} onClick={() => handleViewDetail(item)} title="Lihat Detail">
                          <FileText size={18} />
                        </button>
                        {user?.role !== 'viewer' && (
                          <>
                            <button className="btn-icon" onClick={() => handleEdit(item)} title="Edit">
                              <Edit2 size={18} />
                            </button>
                            <button className="btn-icon delete" onClick={() => handleDelete(item.id_transaksi)} title="Hapus">
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
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
        <TransaksiFormModal 
          isEditing={isEditing}
          formData={formData}
          setFormData={setFormData}
          mobils={mobils}
          sparepartsList={sparepartsList}
          setSparepartsList={setSparepartsList}
          layanansList={layanansList}
          setLayanansList={setLayanansList}
          handleSubmit={handleSubmit}
          closeModal={() => setShowModal(false)}
          handleInputChange={handleInputChange}
        />
      )}

      {showDetailModal && (
        <TransaksiDetailModal 
          selectedDetail={selectedDetail} 
          closeModal={() => setShowDetailModal(false)} 
        />
      )}
    </div>
  );
}
