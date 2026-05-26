export default function TransaksiDetailModal({ selectedDetail, closeModal }) {
  if (!selectedDetail) return null;

  return (
    <div className="modal-overlay" style={{ overflowY: 'auto', padding: '2rem 0' }}>
      <div className="modal-content" style={{ maxWidth: '800px', backgroundColor: '#fff', color: '#000', padding: '2rem', fontFamily: 'serif' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '3px double #000', paddingBottom: '10px', marginBottom: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: 'red' }}>Auto</span>
            <span style={{ color: 'black' }}>60</span>
          </h2>
          <h3 style={{ margin: 0, fontSize: '18px' }}>Bukti Pembayaran</h3>
        </div>

        {/* Row 1 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '10px' }}>
          <div>
            <strong>Kode Transaksi</strong>
            <p style={{ margin: '5px 0 0 0' }}>{selectedDetail.id_transaksi}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <strong>Tanggal Transaksi</strong>
            <p style={{ margin: '5px 0 0 0' }}>{selectedDetail.tanggal_transaksi}</p>
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', border: 'none', textAlign: 'left' }}>
              <tbody>
                <tr><td style={{ padding: '4px 0', fontWeight: 'bold', width: '150px' }}>Kode Pelanggan</td><td>{selectedDetail.mobil?.pelanggan?.id_pelanggan || '-'}</td></tr>
                <tr><td style={{ padding: '4px 0', fontWeight: 'bold' }}>Nama Pelanggan</td><td>{selectedDetail.mobil?.pelanggan?.nama_pelanggan || '-'}</td></tr>
                <tr><td style={{ padding: '4px 0', fontWeight: 'bold' }}>No telp Pelanggan</td><td>{selectedDetail.mobil?.pelanggan?.nomor_telp || '-'}</td></tr>
                <tr><td style={{ padding: '4px 0', fontWeight: 'bold' }}>Alamat Pelanggan</td><td>{selectedDetail.mobil?.pelanggan?.alamat || '-'}</td></tr>
              </tbody>
            </table>
          </div>
          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', border: 'none', textAlign: 'left' }}>
              <tbody>
                <tr><td style={{ padding: '4px 0', fontWeight: 'bold', width: '150px' }}>Merk Mobil</td><td>{selectedDetail.mobil?.merk_mobil || '-'}</td></tr>
                <tr><td style={{ padding: '4px 0', fontWeight: 'bold' }}>No.Rangka</td><td>{selectedDetail.no_rangka || '-'}</td></tr>
                <tr><td style={{ padding: '4px 0', fontWeight: 'bold' }}>No.Polisi</td><td>{selectedDetail.mobil?.no_polisi || '-'}</td></tr>
                <tr><td style={{ padding: '4px 0', fontWeight: 'bold' }}>KM kendaraan</td><td>{selectedDetail.km_kendaraan} KM</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #000' }}>
              <th style={{ textAlign: 'left', padding: '8px 0' }}>Jenis Layanan/Suku cadang</th>
              <th style={{ textAlign: 'left', padding: '8px 0' }}>Keterangan</th>
              <th style={{ textAlign: 'right', padding: '8px 0' }}>Biaya</th>
            </tr>
          </thead>
          <tbody>
            {selectedDetail.detail_layanans?.map((dl, i) => (
              <tr key={`l-${i}`}>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{dl.layanan?.jenis_layanan}</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{dl.layanan?.keterangan || '-'}</td>
                <td style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  {new Intl.NumberFormat('id-ID').format(dl.biaya_dikenakan || dl.layanan?.biaya || 0)}
                </td>
              </tr>
            ))}
            {selectedDetail.detail_spareparts?.map((ds, i) => (
              <tr key={`s-${i}`}>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{ds.sparepart?.nama_sparepart}</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>Merk: {ds.sparepart?.merk} (Qty: {ds.quantity})</td>
                <td style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  {new Intl.NumberFormat('id-ID').format((ds.harga_jual || ds.sparepart?.harga_satuan || 0) * ds.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px double #000', paddingTop: '10px', marginBottom: '40px' }}>
          <strong style={{ marginRight: '20px' }}>Total:</strong>
          <strong>{new Intl.NumberFormat('id-ID').format(selectedDetail.total_harga)}</strong>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <p style={{ margin: 0 }}>Palembang, {selectedDetail.tanggal_transaksi}</p>
          <br /><br /><br />
          <p style={{ fontWeight: 'bold', margin: 0 }}>Admin</p>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '40px', textAlign: 'center', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
          <button type="button" className="btn btn-secondary" onClick={closeModal}>
            Tutup
          </button>
          <button type="button" className="btn btn-primary" style={{ marginLeft: '10px' }} onClick={() => window.print()}>
            Cetak / Print
          </button>
        </div>
      </div>
    </div>
  );
}
