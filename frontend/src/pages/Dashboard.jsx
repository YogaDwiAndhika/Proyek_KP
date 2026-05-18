import { Users, Car, Receipt, TrendingUp } from 'lucide-react';

function Dashboard() {
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
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>120</h2>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#ecfdf5', padding: '1rem', borderRadius: '50%', color: 'var(--success)' }}>
            <Car size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Total Mobil</p>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>145</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#fffbeb', padding: '1rem', borderRadius: '50%', color: 'var(--warning)' }}>
            <Receipt size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Transaksi Bulan Ini</p>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>48</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '50%', color: 'var(--danger)' }}>
            <TrendingUp size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Pendapatan</p>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Rp 12M</h2>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Transaksi Terbaru</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Kode Transaksi</th>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Mobil</th>
                <th>Jumlah</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Memuat data...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
