import { useState, useEffect } from 'react';
import { Search, Calendar, Package, Wrench, Users, FileText } from 'lucide-react';
import api from '../utils/api';

export default function Laporan() {
  const [mobils, setMobils] = useState([]);
  const [transaksis, setTransaksis] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('riwayat_kendaraan');
  
  // State for Riwayat Kendaraan
  const [selectedNoRangka, setSelectedNoRangka] = useState('');
  
  // State for Pendapatan
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const mRes = await api.get('/mobil');
      const tRes = await api.get('/transaksi');
      setMobils(mRes.data || []);
      setTransaksis(tRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  // 1. Riwayat Kendaraan
  const selectedMobil = mobils.find(m => m.no_rangka === selectedNoRangka);
  const historyTransaksi = transaksis
    .filter(t => t.no_rangka === selectedNoRangka)
    .sort((a, b) => new Date(b.tanggal_transaksi) - new Date(a.tanggal_transaksi));

  // 2. Laporan Pendapatan
  const pendapatanTransaksi = transaksis.filter(t => {
    if (!startDate && !endDate) return true;
    const tDate = new Date(t.tanggal_transaksi);
    const sDate = startDate ? new Date(startDate) : new Date('2000-01-01');
    const eDate = endDate ? new Date(endDate) : new Date('2100-01-01');
    return tDate >= sDate && tDate <= eDate;
  }).sort((a, b) => new Date(b.tanggal_transaksi) - new Date(a.tanggal_transaksi));
  const totalPendapatan = pendapatanTransaksi.reduce((sum, t) => sum + parseFloat(t.total_harga), 0);

  // 3. Laporan Sparepart
  const getSparepartStats = () => {
    const stats = {};
    transaksis.forEach(t => {
      t.detail_spareparts?.forEach(ds => {
        if (!stats[ds.id_sparepart]) {
          stats[ds.id_sparepart] = { nama: ds.sparepart?.nama_sparepart, merk: ds.sparepart?.merk, qty: 0, revenue: 0 };
        }
        stats[ds.id_sparepart].qty += ds.quantity;
        stats[ds.id_sparepart].revenue += parseFloat(ds.record_harga_satuan || ds.sparepart?.harga_satuan || 0) * ds.quantity;
      });
    });
    return Object.values(stats).sort((a, b) => b.qty - a.qty);
  };

  // 4. Laporan Layanan
  const getLayananStats = () => {
    const stats = {};
    transaksis.forEach(t => {
      t.detail_layanans?.forEach(dl => {
        if (!stats[dl.id_layanan]) {
          stats[dl.id_layanan] = { nama: dl.layanan?.jenis_layanan, count: 0, revenue: 0 };
        }
        stats[dl.id_layanan].count += 1;
        stats[dl.id_layanan].revenue += parseFloat(dl.record_biaya || dl.layanan?.biaya || 0);
      });
    });
    return Object.values(stats).sort((a, b) => b.count - a.count);
  };

  // 5. Laporan Pelanggan
  const getPelangganStats = () => {
    const stats = {};
    transaksis.forEach(t => {
      const p = t.mobil?.pelanggan;
      if (p) {
        if (!stats[p.id_pelanggan]) {
          stats[p.id_pelanggan] = { nama: p.nama_pelanggan, telp: p.nomor_telp, count: 0, spend: 0 };
        }
        stats[p.id_pelanggan].count += 1;
        stats[p.id_pelanggan].spend += parseFloat(t.total_harga);
      }
    });
    return Object.values(stats).sort((a, b) => b.spend - a.spend);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Laporan Bengkel</h1>
      </div>

      <div className="card" style={{ marginBottom: '20px', padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <button 
            onClick={() => setActiveTab('riwayat_kendaraan')}
            style={{ flex: 1, padding: '15px', border: 'none', background: activeTab === 'riwayat_kendaraan' ? '#fff' : 'transparent', borderBottom: activeTab === 'riwayat_kendaraan' ? '2px solid #3b82f6' : 'none', cursor: 'pointer', fontWeight: activeTab === 'riwayat_kendaraan' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: activeTab === 'riwayat_kendaraan' ? '#3b82f6' : '#64748b' }}
          >
            <Search size={18} /> Riwayat Kendaraan
          </button>
          <button 
            onClick={() => setActiveTab('pendapatan')}
            style={{ flex: 1, padding: '15px', border: 'none', background: activeTab === 'pendapatan' ? '#fff' : 'transparent', borderBottom: activeTab === 'pendapatan' ? '2px solid #3b82f6' : 'none', cursor: 'pointer', fontWeight: activeTab === 'pendapatan' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: activeTab === 'pendapatan' ? '#3b82f6' : '#64748b' }}
          >
            <Calendar size={18} /> Laporan Pendapatan
          </button>
          <button 
            onClick={() => setActiveTab('sparepart')}
            style={{ flex: 1, padding: '15px', border: 'none', background: activeTab === 'sparepart' ? '#fff' : 'transparent', borderBottom: activeTab === 'sparepart' ? '2px solid #3b82f6' : 'none', cursor: 'pointer', fontWeight: activeTab === 'sparepart' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: activeTab === 'sparepart' ? '#3b82f6' : '#64748b' }}
          >
            <Package size={18} /> Statistik Sparepart
          </button>
          <button 
            onClick={() => setActiveTab('layanan')}
            style={{ flex: 1, padding: '15px', border: 'none', background: activeTab === 'layanan' ? '#fff' : 'transparent', borderBottom: activeTab === 'layanan' ? '2px solid #3b82f6' : 'none', cursor: 'pointer', fontWeight: activeTab === 'layanan' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: activeTab === 'layanan' ? '#3b82f6' : '#64748b' }}
          >
            <Wrench size={18} /> Statistik Layanan
          </button>
          <button 
            onClick={() => setActiveTab('pelanggan')}
            style={{ flex: 1, padding: '15px', border: 'none', background: activeTab === 'pelanggan' ? '#fff' : 'transparent', borderBottom: activeTab === 'pelanggan' ? '2px solid #3b82f6' : 'none', cursor: 'pointer', fontWeight: activeTab === 'pelanggan' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: activeTab === 'pelanggan' ? '#3b82f6' : '#64748b' }}
          >
            <Users size={18} /> Pelanggan Teraktif
          </button>
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Memuat data laporan...</div>}

      {!loading && activeTab === 'riwayat_kendaraan' && (
        <>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div className="form-group" style={{ flex: 1, margin: 0 }}>
                <label className="form-label">Pilih Kendaraan Berdasarkan Nomor Rangka</label>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} />
                  <select
                    className="form-input"
                    style={{ paddingLeft: '35px' }}
                    value={selectedNoRangka}
                    onChange={(e) => setSelectedNoRangka(e.target.value)}
                  >
                    <option value="">-- Pilih Kendaraan (No Rangka) --</option>
                    {mobils.map(m => (
                      <option key={m.no_rangka} value={m.no_rangka}>
                        {m.no_rangka} - {m.no_polisi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedMobil && (
                <div style={{ flex: 1, backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>Informasi Kendaraan</h3>
                  <table style={{ width: '100%', fontSize: '14px' }}>
                    <tbody>
                      <tr><td style={{ padding: '4px 0', fontWeight: 'bold', width: '120px' }}>No Polisi</td><td>: {selectedMobil.no_polisi}</td></tr>
                      <tr><td style={{ padding: '4px 0', fontWeight: 'bold' }}>Merk Mobil</td><td>: {selectedMobil.merk_mobil}</td></tr>
                      <tr><td style={{ padding: '4px 0', fontWeight: 'bold' }}>Pemilik</td><td>: {selectedMobil.pelanggan?.nama_pelanggan || '-'}</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {selectedNoRangka && (
            <div className="card">
              <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Riwayat Perbaikan / Service</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Kode Transaksi</th>
                      <th>KM Kendaraan</th>
                      <th>Sparepart Digunakan</th>
                      <th>Layanan Diberikan</th>
                      <th style={{ textAlign: 'right' }}>Total Biaya</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyTransaksi.length === 0 ? (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px 0', color: '#666' }}>Belum ada riwayat perbaikan untuk kendaraan ini.</td></tr>
                    ) : (
                      historyTransaksi.map((item) => (
                        <tr key={item.id_transaksi}>
                          <td style={{ whiteSpace: 'nowrap' }}>{item.tanggal_transaksi}</td>
                          <td>{item.id_transaksi}</td>
                          <td>{item.km_kendaraan} KM</td>
                          <td>
                            {item.detail_spareparts && item.detail_spareparts.length > 0 ? (
                              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                                {item.detail_spareparts.map((ds, i) => (
                                  <li key={i}>{ds.sparepart?.nama_sparepart} ({ds.quantity}x)</li>
                                ))}
                              </ul>
                            ) : <span>-</span>}
                          </td>
                          <td>
                            {item.detail_layanans && item.detail_layanans.length > 0 ? (
                              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                                {item.detail_layanans.map((dl, i) => (
                                  <li key={i}>{dl.layanan?.jenis_layanan}</li>
                                ))}
                              </ul>
                            ) : <span>-</span>}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 'bold' }}>Rp {new Intl.NumberFormat('id-ID').format(item.total_harga)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {!loading && activeTab === 'pendapatan' && (
        <div className="card">
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Dari Tanggal</label>
              <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Sampai Tanggal</label>
              <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <button className="btn btn-secondary" onClick={() => { setStartDate(''); setEndDate(''); }}>Reset Filter</button>
          </div>

          <div style={{ backgroundColor: '#eff6ff', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #bfdbfe' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#1e40af', fontSize: '14px' }}>Total Pendapatan (Sesuai Filter)</h3>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1d4ed8' }}>Rp {new Intl.NumberFormat('id-ID').format(totalPendapatan)}</p>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Kode Transaksi</th>
                  <th>Tanggal</th>
                  <th>No Polisi Mobil</th>
                  <th>Pelanggan</th>
                  <th style={{ textAlign: 'right' }}>Total Harga</th>
                </tr>
              </thead>
              <tbody>
                {pendapatanTransaksi.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Tidak ada transaksi pada periode ini.</td></tr>
                ) : (
                  pendapatanTransaksi.map(t => (
                    <tr key={t.id_transaksi}>
                      <td>{t.id_transaksi}</td>
                      <td>{t.tanggal_transaksi}</td>
                      <td>{t.mobil?.no_polisi || '-'}</td>
                      <td>{t.mobil?.pelanggan?.nama_pelanggan || '-'}</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>Rp {new Intl.NumberFormat('id-ID').format(t.total_harga)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && activeTab === 'sparepart' && (
        <div className="card">
          <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Laporan Sparepart Paling Banyak Digunakan</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Peringkat</th>
                  <th>Nama Sparepart</th>
                  <th>Merk</th>
                  <th style={{ textAlign: 'center' }}>Total Terjual (Qty)</th>
                  <th style={{ textAlign: 'right' }}>Estimasi Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                {getSparepartStats().length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>Belum ada data.</td></tr>
                ) : (
                  getSparepartStats().map((sp, idx) => (
                    <tr key={idx}>
                      <td style={{ textAlign: 'center' }}>#{idx + 1}</td>
                      <td>{sp.nama || 'Sparepart Dihapus'}</td>
                      <td>{sp.merk || '-'}</td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{sp.qty}</td>
                      <td style={{ textAlign: 'right' }}>Rp {new Intl.NumberFormat('id-ID').format(sp.revenue)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && activeTab === 'layanan' && (
        <div className="card">
          <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Laporan Layanan Paling Sering Dipesan</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Peringkat</th>
                  <th>Jenis Layanan</th>
                  <th style={{ textAlign: 'center' }}>Total Dipesan</th>
                  <th style={{ textAlign: 'right' }}>Estimasi Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                {getLayananStats().length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center' }}>Belum ada data.</td></tr>
                ) : (
                  getLayananStats().map((lay, idx) => (
                    <tr key={idx}>
                      <td style={{ textAlign: 'center' }}>#{idx + 1}</td>
                      <td>{lay.nama || 'Layanan Dihapus'}</td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{lay.count} kali</td>
                      <td style={{ textAlign: 'right' }}>Rp {new Intl.NumberFormat('id-ID').format(lay.revenue)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && activeTab === 'pelanggan' && (
        <div className="card">
          <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Laporan Pelanggan Paling Menguntungkan (Top Spender)</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Peringkat</th>
                  <th>Nama Pelanggan</th>
                  <th>No Telp</th>
                  <th style={{ textAlign: 'center' }}>Total Kunjungan</th>
                  <th style={{ textAlign: 'right' }}>Total Transaksi (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {getPelangganStats().length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>Belum ada data.</td></tr>
                ) : (
                  getPelangganStats().map((p, idx) => (
                    <tr key={idx}>
                      <td style={{ textAlign: 'center' }}>#{idx + 1}</td>
                      <td>{p.nama}</td>
                      <td>{p.telp}</td>
                      <td style={{ textAlign: 'center' }}>{p.count} kali</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#16a34a' }}>Rp {new Intl.NumberFormat('id-ID').format(p.spend)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
