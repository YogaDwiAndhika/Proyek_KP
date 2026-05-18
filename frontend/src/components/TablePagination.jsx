export function TableFilter({ limit, setLimit, searchTerm, setSearchTerm, setCurrentPage }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '14px' }}>Tampilkan</span>
        <select 
          className="form-input" 
          style={{ width: '80px', padding: '5px' }} 
          value={limit} 
          onChange={(e) => { setLimit(Number(e.target.value)); setCurrentPage(1); }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={10000}>Semua</option>
        </select>
        <span style={{ fontSize: '14px' }}>data</span>
      </div>
      <div>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Cari data..." 
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          style={{ padding: '5px 10px', width: '250px' }}
        />
      </div>
    </div>
  );
}

export function TablePagination({ currentPage, setCurrentPage, totalPages, totalData }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
      <div style={{ fontSize: '14px', color: '#666' }}>
        Halaman {currentPage} dari {totalPages} (Total: {totalData} data)
      </div>
      <div style={{ display: 'flex', gap: '5px' }}>
        <button 
          type="button"
          className="btn btn-secondary" 
          style={{ padding: '5px 10px', fontSize: '12px' }}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        >
          Sebelumnya
        </button>
        <button 
          type="button"
          className="btn btn-secondary" 
          style={{ padding: '5px 10px', fontSize: '12px' }}
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
