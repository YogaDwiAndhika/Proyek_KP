import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Car, Receipt, FileText, Wrench, Settings } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Pelanggan from './pages/Pelanggan';
import Mobil from './pages/Mobil';
import Transaksi from './pages/Transaksi';
import Sparepart from './pages/Sparepart';
import Layanan from './pages/Layanan';

import Laporan from './pages/Laporan';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <Car size={32} color="var(--primary-color)" />
            <div className="sidebar-logo">Bengkel Auto</div>
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
            <NavLink to="/laporan" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <FileText size={20} />
              <span>Laporan</span>
            </NavLink>
          </nav>
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
