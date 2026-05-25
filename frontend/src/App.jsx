import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Car, Receipt, FileText, Wrench, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Pelanggan from './pages/Pelanggan';
import Mobil from './pages/Mobil';
import Transaksi from './pages/Transaksi';
import Sparepart from './pages/Sparepart';
import Layanan from './pages/Layanan';

import Laporan from './pages/Laporan';

function SidebarContent() {
  const [isLaporanOpen, setIsLaporanOpen] = useState(false);

  return (
    <>
      <div className="sidebar-header" style={{ justifyContent: 'center' }}>
        <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ color: 'black' }}>Bengkel</span>
          <span style={{ color: 'red' }}>Auto</span>
          <span style={{ color: 'black' }}>60</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/transaksi" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Receipt size={20} />
          <span>Transaksi</span>
        </NavLink>
        <NavLink to="/pelanggan" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Users size={20} />
          <span>Pelanggan</span>
        </NavLink>
        <NavLink to="/mobil" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Car size={20} />
          <span>Mobil</span>
        </NavLink>
        <NavLink to="/sparepart" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Settings size={20} />
          <span>Sparepart</span>
        </NavLink>
        <NavLink to="/layanan" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Wrench size={20} />
          <span>Layanan</span>
        </NavLink>
        
        {/* Laporan Dropdown */}
        <div className="nav-item-container">
          <div 
            className="nav-item" 
            onClick={() => setIsLaporanOpen(!isLaporanOpen)}
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={20} />
              <span>Laporan</span>
            </div>
            {isLaporanOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          
          {isLaporanOpen && (
            <div style={{ paddingLeft: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
              <NavLink 
                to="/laporan?tab=riwayat_kendaraan" 
                className={({ isActive }) => isActive && (!window.location.search || window.location.search.includes('tab=riwayat_kendaraan')) ? "nav-item active" : "nav-item"}
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
              >
                Riwayat Kendaraan
              </NavLink>
              <NavLink 
                to="/laporan?tab=pendapatan" 
                className={({ isActive }) => isActive && window.location.search.includes('tab=pendapatan') ? "nav-item active" : "nav-item"}
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
              >
                Laporan Pendapatan
              </NavLink>
              <NavLink 
                to="/laporan?tab=pelanggan" 
                className={({ isActive }) => isActive && window.location.search.includes('tab=pelanggan') ? "nav-item active" : "nav-item"}
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
              >
                Pelanggan Teraktif
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transaksi" element={<Transaksi />} />
            <Route path="/pelanggan" element={<Pelanggan />} />
            <Route path="/mobil" element={<Mobil />} />
            <Route path="/sparepart" element={<Sparepart />} />
            <Route path="/layanan" element={<Layanan />} />
            <Route path="/laporan" element={<Laporan />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
