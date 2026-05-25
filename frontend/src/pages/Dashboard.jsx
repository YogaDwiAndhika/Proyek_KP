import { useState, useEffect } from 'react';
import { Users, Car, Receipt, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import TransaksiDetailModal from '../components/TransaksiDetailModal';

function Dashboard() {
  const [stats, setStats] = useState({
    totalPelanggan: 0,
    totalMobil: 0,
    transaksiBulanIni: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [pelangganRes, mobilRes, transaksiRes] = await Promise.all([
          api.get('/pelanggan'),
          api.get('/mobil'),
          api.get('/transaksi')
        ]);
        
        const pelanggan = pelangganRes.data || [];
        const mobil = mobilRes.data || [];
        const transaksi = transaksiRes.data || [];
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const transBulanIni = transaksi.filter(t => {
          if(!t.tanggal_transaksi) return false;
          const d = new Date(t.tanggal_transaksi);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        }).length;
        
        setStats({
          totalPelanggan: pelanggan.length,
          totalMobil: mobil.length,
          transaksiBulanIni: transBulanIni
        });
        
        const sortedTransaksi = [...transaksi].sort((a, b) => new Date(b.tanggal_transaksi) - new Date(a.tanggal_transaksi));
        setRecentTransactions(sortedTransaksi.slice(0, 5));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
      setLoading(false);
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '50%', color: 'var(--primary-color)' }}>
            <Users size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Total Pelanggan</p>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{loading ? '...' : stats.totalPelanggan}</h2>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#ecfdf5', padding: '1rem', borderRadius: '50%', color: 'var(--success)' }}>
            <Car size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Total Mobil</p>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{loading ? '...' : stats.totalMobil}</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#fffbeb', padding: '1rem', borderRadius: '50%', color: 'var(--warning)' }}>
            <Receipt size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Transaksi Bulan Ini</p>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{loading ? '...' : stats.transaksiBulanIni}</h2>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Transaksi Terbaru</h3>
          <Link to="/transaksi" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Lihat Semua Transaksi <ArrowRight size={18} />
          </Link>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tanggal</th>
                <th>Mobil</th>
                <th>Pelanggan</th>
                <th>KM Kendaraan</th>
                <th>Total Harga (Rp)</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center' }}>Memuat...</td></tr>
              ) : recentTransactions.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center' }}>Tidak ada transaksi terbaru</td></tr>
              ) : (
                recentTransactions.map((item) => (
                  <tr key={item.id_transaksi}>
                    <td>{item.id_transaksi}</td>
                    <td>{item.tanggal_transaksi}</td>
                    <td>{item.mobil ? item.mobil.no_polisi : item.no_rangka}</td>
                    <td>{item.mobil && item.mobil.pelanggan ? item.mobil.pelanggan.nama_pelanggan : '-'}</td>
                    <td>{item.km_kendaraan}</td>
                    <td>{new Intl.NumberFormat('id-ID').format(item.total_harga)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-buttons" style={{ justifyContent: 'center' }}>
                        <button className="btn-icon" style={{ color: '#3b82f6' }} onClick={() => { setSelectedDetail(item); setShowDetailModal(true); }} title="Lihat Detail">
                          <FileText size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDetailModal && (
        <TransaksiDetailModal 
          selectedDetail={selectedDetail} 
          closeModal={() => setShowDetailModal(false)} 
        />
      )}
    </div>
  );
}

export default Dashboard;
