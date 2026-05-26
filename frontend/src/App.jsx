import { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Car, Receipt, FileText, Wrench, Settings, ChevronDown, ChevronUp, UserCog, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Pelanggan from './pages/Pelanggan';
import Mobil from './pages/Mobil';
import Transaksi from './pages/Transaksi';
import Sparepart from './pages/Sparepart';
import Layanan from './pages/Layanan';
import Laporan from './pages/Laporan';
import Login from './pages/Login';
import ManajemenPengguna from './pages/ManajemenPengguna';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

function SidebarContent() {
  const [isLaporanOpen, setIsLaporanOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <div className="sidebar-header" style={{ justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
        <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ color: 'black' }}>Bengkel</span>
          <span style={{ color: 'red' }}>Auto</span>
          <span style={{ color: 'black' }}>60</span>
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          Login sebagai: <strong>{user?.username} ({user?.role})</strong>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        {user?.role !== 'owner' && (
          <>
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
          </>
        )}
        
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
              <NavLink 
                to="/laporan?tab=sparepart" 
                className={({ isActive }) => isActive && window.location.search.includes('tab=sparepart') ? "nav-item active" : "nav-item"}
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
              >
                Statistik Sparepart
              </NavLink>
              <NavLink 
                to="/laporan?tab=layanan" 
                className={({ isActive }) => isActive && window.location.search.includes('tab=layanan') ? "nav-item active" : "nav-item"}
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
              >
                Statistik Layanan
              </NavLink>
            </div>
          )}
        </div>

        {user?.role === 'owner' && (
          <NavLink to="/users" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} style={{ marginTop: '20px' }}>
            <UserCog size={20} />
            <span>Manajemen Pengguna</span>
          </NavLink>
        )}

        <div className="nav-item" onClick={logout} style={{ marginTop: 'auto', cursor: 'pointer', color: '#ef4444' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </nav>
    </>
  );
}

function MainLayout() {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <SidebarContent />
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transaksi" element={<ProtectedRoute requiredRole={['viewer', 'kasir']}><Transaksi /></ProtectedRoute>} />
            <Route path="/pelanggan" element={<ProtectedRoute requiredRole={['viewer', 'kasir']}><Pelanggan /></ProtectedRoute>} />
            <Route path="/mobil" element={<ProtectedRoute requiredRole={['viewer', 'kasir']}><Mobil /></ProtectedRoute>} />
            <Route path="/sparepart" element={<ProtectedRoute requiredRole={['viewer', 'kasir']}><Sparepart /></ProtectedRoute>} />
            <Route path="/layanan" element={<ProtectedRoute requiredRole={['viewer', 'kasir']}><Layanan /></ProtectedRoute>} />
            <Route path="/laporan" element={<Laporan />} />
            <Route path="/users" element={<ProtectedRoute requiredRole="owner"><ManajemenPengguna /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
