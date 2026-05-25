import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import CreatableSelect from 'react-select/creatable';
import api from '../utils/api';

export default function TransaksiFormModal({
  isEditing,
  formData,
  setFormData,
  mobils,
  sparepartsList,
  setSparepartsList,
  layanansList,
  setLayanansList,
  handleSubmit,
  closeModal,
  handleInputChange
}) {
  const [newSparepart, setNewSparepart] = useState({ isOpen: false, inputValue: '', index: null, merk: '', harga_satuan: '' });
  const [newLayanan, setNewLayanan] = useState({ isOpen: false, inputValue: '', index: null, biaya: '', keterangan: '' });

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

  const handleCreateSparepart = (inputValue, index) => {
    setNewSparepart({ isOpen: true, inputValue, index, merk: '', harga_satuan: '' });
  };

  const submitNewSparepart = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/sparepart', {
        nama_sparepart: newSparepart.inputValue,
        merk: newSparepart.merk,
        harga_satuan: parseFloat(newSparepart.harga_satuan)
      });
      const createdSp = res.data;
      setSparepartsList(prev => [...prev, createdSp]);
      handleSparepartChange(newSparepart.index, 'id_sparepart', createdSp.id_sparepart.toString());
      setNewSparepart({ isOpen: false, inputValue: '', index: null, merk: '', harga_satuan: '' });
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan sparepart baru.");
    }
  };

  const handleCreateLayanan = (inputValue, index) => {
    setNewLayanan({ isOpen: true, inputValue, index, biaya: '', keterangan: '' });
  };

  const submitNewLayanan = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/layanan', {
        jenis_layanan: newLayanan.inputValue,
        biaya: parseFloat(newLayanan.biaya),
        keterangan: newLayanan.keterangan || ''
      });
      const createdLay = res.data;
      setLayanansList(prev => [...prev, createdLay]);
      handleLayananChange(newLayanan.index, createdLay.id_layanan.toString());
      setNewLayanan({ isOpen: false, inputValue: '', index: null, biaya: '', keterangan: '' });
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan layanan baru.");
    }
  };

  const getSparepartOption = (id) => {
    if (!id) return null;
    const item = sparepartsList.find(s => s.id_sparepart.toString() === id.toString());
    if (!item) return null;
    return {
      value: item.id_sparepart.toString(),
      label: `${item.nama_sparepart} - Rp ${new Intl.NumberFormat('id-ID').format(item.harga_satuan)}`
    };
  };

  const getLayananOption = (id) => {
    if (!id) return null;
    const item = layanansList.find(l => l.id_layanan.toString() === id.toString());
    if (!item) return null;
    return {
      value: item.id_layanan.toString(),
      label: `${item.jenis_layanan} - Rp ${new Intl.NumberFormat('id-ID').format(item.biaya)}`
    };
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
                placeholder="Masukkan KM kendaraan (cth: 50000)"
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
                  <CreatableSelect
                    isClearable
                    options={sparepartsList.map(item => ({
                      value: item.id_sparepart.toString(),
                      label: `${item.nama_sparepart} - Rp ${new Intl.NumberFormat('id-ID').format(item.harga_satuan)}`
                    }))}
                    value={getSparepartOption(sp.id_sparepart)}
                    onChange={(selectedOption) => handleSparepartChange(index, 'id_sparepart', selectedOption ? selectedOption.value : '')}
                    onCreateOption={(inputValue) => handleCreateSparepart(inputValue, index)}
                    placeholder="-- Pilih atau Ketik Sparepart --"
                    formatCreateLabel={(inputValue) => `Buat sparepart "${inputValue}"`}
                    styles={{
                      container: (base) => ({ ...base, flex: 2 }),
                      control: (base) => ({ ...base, minHeight: '42px', borderRadius: '6px', borderColor: '#e5e7eb' })
                    }}
                  />
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
                  <CreatableSelect
                    isClearable
                    options={layanansList.map(item => ({
                      value: item.id_layanan.toString(),
                      label: `${item.jenis_layanan} - Rp ${new Intl.NumberFormat('id-ID').format(item.biaya)}`
                    }))}
                    value={getLayananOption(lay.id_layanan)}
                    onChange={(selectedOption) => handleLayananChange(index, selectedOption ? selectedOption.value : '')}
                    onCreateOption={(inputValue) => handleCreateLayanan(inputValue, index)}
                    placeholder="-- Pilih atau Ketik Layanan --"
                    formatCreateLabel={(inputValue) => `Buat layanan "${inputValue}"`}
                    styles={{
                      container: (base) => ({ ...base, flex: 1 }),
                      control: (base) => ({ ...base, minHeight: '42px', borderRadius: '6px', borderColor: '#e5e7eb' })
                    }}
                  />
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
                placeholder="Masukkan total harga atau klik hitung otomatis"
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

      {/* Sparepart Custom Modal */}
      {newSparepart.isOpen && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Buat Sparepart Baru</h2>
            </div>
            <form onSubmit={submitNewSparepart}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Sparepart</label>
                  <input type="text" className="form-input" value={newSparepart.inputValue} readOnly style={{ backgroundColor: '#f3f4f6' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Merk</label>
                  <input type="text" className="form-input" required 
                         value={newSparepart.merk} 
                         onChange={(e) => setNewSparepart({...newSparepart, merk: e.target.value})} 
                         autoFocus />
                </div>
                <div className="form-group">
                  <label className="form-label">Harga Satuan (Rp)</label>
                  <input type="number" className="form-input" required min="0"
                         value={newSparepart.harga_satuan} 
                         onChange={(e) => setNewSparepart({...newSparepart, harga_satuan: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setNewSparepart({ ...newSparepart, isOpen: false })}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Layanan Custom Modal */}
      {newLayanan.isOpen && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Buat Layanan Baru</h2>
            </div>
            <form onSubmit={submitNewLayanan}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Jenis Layanan</label>
                  <input type="text" className="form-input" value={newLayanan.inputValue} readOnly style={{ backgroundColor: '#f3f4f6' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Biaya (Rp)</label>
                  <input type="number" className="form-input" required min="0"
                         value={newLayanan.biaya} 
                         onChange={(e) => setNewLayanan({...newLayanan, biaya: e.target.value})} 
                         autoFocus />
                </div>
                <div className="form-group">
                  <label className="form-label">Keterangan (opsional)</label>
                  <textarea className="form-input" rows="2"
                         value={newLayanan.keterangan} 
                         onChange={(e) => setNewLayanan({...newLayanan, keterangan: e.target.value})}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setNewLayanan({ ...newLayanan, isOpen: false })}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
