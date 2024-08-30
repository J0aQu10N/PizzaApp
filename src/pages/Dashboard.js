import React, { useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardProducts from './DashboardProducts';
import DashboardUsers from './DashboardUsers';
import DashboardCarts from './DashboardCarts';
import '../Dashboard.css';

function Dashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Dashboard montado. isAdmin:", isAdmin);
    if (!isAdmin) {
      console.log("El usuario no es admin, redirigiendo...");
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return <div>No tienes permiso para acceder a esta página. Redirigiendo...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Panel de Administración</h1>
      <nav className="dashboard-menu">
        <ul>
          <li><Link to="/dashboard/products">Gestionar Productos</Link></li>
          <li><Link to="/dashboard/users">Gestionar Usuarios</Link></li>
          <li><Link to="/dashboard/carts">Ver Carritos</Link></li>
        </ul>
      </nav>
      <div className="dashboard-content">
        <Routes>
          <Route path="products" element={<DashboardProducts />} />
          <Route path="users" element={<DashboardUsers />} />
          <Route path="carts" element={<DashboardCarts />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;