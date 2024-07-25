/*
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardProducts from './DashboardProducts';
import DashboardUsers from './DashboardUsers';
import DashboardCarts from './DashboardCarts';
import '../Dashboard.css';

function Dashboard() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <div>No tienes permiso para acceder a esta página.</div>;
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
          <Route index element={<h2>Selecciona una opción del menú</h2>} />
        </Routes>
      </div>
    </div>
  );
}
export default Dashboard;
*/

import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardProducts from './DashboardProducts';
import DashboardUsers from './DashboardUsers';
import DashboardCarts from './DashboardCarts';
import '../Dashboard.css';

function Dashboard() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <div>No tienes permiso para acceder a esta página.</div>;
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
         {/* <Route index element={<h2>Selecciona una opción del menú</h2>} /> */}
          <Route path="products" element={<DashboardProducts />} />
          <Route path="users" element={<DashboardUsers />} />
          <Route path="carts" element={<DashboardCarts />} />
          
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;