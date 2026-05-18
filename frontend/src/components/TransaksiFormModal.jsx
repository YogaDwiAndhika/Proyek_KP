import { Plus, X } from 'lucide-react';

export default function TransaksiFormModal({
  isEditing,
  formData,
  setFormData,
  mobils,
  sparepartsList,
  layanansList,
  handleSubmit,
  closeModal,
  handleInputChange
}) {
  const addSparepart = () => {
    setFormData(prev => ({
      ...prev,
      spareparts: [...prev.spareparts, { id_sparepart: '', quantity: 1 }]
    }));
  };

  const removeSparepart = (index) => {
    setFormData(prev => {
      const newSp = [...prev.spareparts];
      newSp.splice(index, 1);
      return { ...prev, spareparts: newSp };
    });
  };

  const handleSparepartChange = (index, field, value) => {
    setFormData(prev => {
      const newSp = [...prev.spareparts];
      newSp[index][field] = value;
      return { ...prev, spareparts: newSp };
    });
  };

  const addLayanan = () => {
    setFormData(prev => ({
      ...prev,
      layanans: [...prev.layanans, { id_layanan: '' }]
    }));
  };

  const removeLayanan = (index) => {
    setFormData(prev => {
      const newLay = [...prev.layanans];
      newLay.splice(index, 1);
      return { ...prev, layanans: newLay };
    });
  };

  const handleLayananChange = (index, value) => {
    setFormData(prev => {
      const newLay = [...prev.layanans];
      newLay[index].id_layanan = value;
      return { ...prev, layanans: newLay };
    });
  };

  const calculateTotal = () => {
    let total = 0;
    formData.spareparts.forEach(sp => {
      if (sp.id_sparepart) {
        const item = sparepartsList.find(s => s.id_sparepart.toString() === sp.id_sparepart.toString());
        if (item) total += (parseFloat(item.harga_satuan) * parseInt(sp.quantity || 0));
      }
    });
    formData.layanans.forEach(lay => {
      if (lay.id_layanan) {
        const item = layanansList.find(l => l.id_layanan.toString() === lay.id_layanan.toString());
        if (item) total += parseFloat(item.biaya);
      }
    });
    setFormData(prev => ({ ...prev, total_harga: total }));
  };

  return (
    <div className="modal-overlay" style={{ overflowY: 'auto', padding: '2rem 0' }}>
      <div className="modal-content" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Tanggal Transaksi</label>
              <input
                type="date"
                className="form-input"
                name="tanggal_transaksi"
                value={formData.tanggal_transaksi}
                onChange={handleInputChange}
                readOnly
                style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Mobil</label>
              <select
                className="form-input"
                name="no_rangka"
                value={formData.no_rangka}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Pilih Mobil --</option>
                {mobils.map(m => (
                  <option key={m.no_rangka} value={m.no_rangka}>
                    {m.no_polisi} - {m.merk_mobil}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">KM Kendaraan</label>
              <input
                type="number"
                className="form-input"
                name="km_kendaraan"
                value={formData.km_kendaraan}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>

            {/* Sparepart Section */}
            <div className="form-group" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label className="form-label" style={{ margin: 0 }}>Sparepart Digunakan</label>
                <button type="button" className="btn btn-secondary" onClick={addSparepart} style={{ padding: '5px 10px', fontSize: '12px' }}>
                  <Plus size={14} /> Tambah Sparepart
                </button>
              </div>
              
              {formData.spareparts.map((sp, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <select
                    className="form-input"
                    value={sp.id_sparepart}
                    onChange={(e) => handleSparepartChange(index, 'id_sparepart', e.target.value)}
                    required
                    style={{ flex: 2 }}
                  >
                    <option value="">-- Pilih Sparepart --</option>
                    {sparepartsList.map(item => (
                      <option key={item.id_sparepart} value={item.id_sparepart}>
                        {item.nama_sparepart} - Rp {new Intl.NumberFormat('id-ID').format(item.harga_satuan)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Qty"
                    value={sp.quantity}
                    onChange={(e) => handleSparepartChange(index, 'quantity', e.target.value)}
                    required
                    min="1"
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="btn-icon delete" onClick={() => removeSparepart(index)}>
                    <X size={18} />
                  </button>
                </div>
              ))}
              {formData.spareparts.length === 0 && <p style={{ fontSize: '12px', color: '#666' }}>Tidak ada sparepart.</p>}
            </div>

            {/* Layanan Section */}
            <div className="form-group" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label className="form-label" style={{ margin: 0 }}>Layanan Diberikan</label>
                <button type="button" className="btn btn-secondary" onClick={addLayanan} style={{ padding: '5px 10px', fontSize: '12px' }}>
                  <Plus size={14} /> Tambah Layanan
                </button>
              </div>
              
              {formData.layanans.map((lay, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <select
                    className="form-input"
                    value={lay.id_layanan}
                    onChange={(e) => handleLayananChange(index, e.target.value)}
                    required
                    style={{ flex: 1 }}
                  >
                    <option value="">-- Pilih Layanan --</option>
                    {layanansList.map(item => (
                      <option key={item.id_layanan} value={item.id_layanan}>
                        {item.jenis_layanan} - Rp {new Intl.NumberFormat('id-ID').format(item.biaya)}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="btn-icon delete" onClick={() => removeLayanan(index)}>
                    <X size={18} />
                  </button>
                </div>
              ))}
              {formData.layanans.length === 0 && <p style={{ fontSize: '12px', color: '#666' }}>Tidak ada layanan.</p>}
            </div>

            <div className="form-group" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ margin: 0 }}>Total Harga (Rp)</label>
                <button type="button" className="btn btn-secondary" onClick={calculateTotal} style={{ padding: '5px 10px', fontSize: '12px' }}>
                  Hitung Total Otomatis
                </button>
              </div>
              <input
                type="number"
                className="form-input"
                name="total_harga"
                value={formData.total_harga}
                onChange={handleInputChange}
                required
                style={{ marginTop: '10px' }}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
