import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import '../DashboardUsers.css';

function DashboardUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = `${API_URL}/users`;
      console.log("Fetching users from:", url);
      console.log("Token:", token);
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Users fetched:", response.data);
      setUsers(response.data);
      setError(null);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error.response || error);
      setError("No se pudieron cargar los usuarios. Por favor, intente de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (id, currentAdminStatus) => {
    try {
      const token = localStorage.getItem('token');
      console.log(`Toggling admin status for user ${id}`);
      const url = `${API_URL}/users/${id}`;
      console.log("PUT request to:", url);
      
      const response = await axios.put(url, 
        { isAdmin: !currentAdminStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("User updated:", response.data);
      setUsers(users.map(user => user.id === id ? response.data : user));
    } catch (error) {
      console.error("Error al cambiar el estado de admin:", error.response || error);
      alert("No se pudo cambiar el estado de administrador. Por favor, intente de nuevo.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este usuario?")) return;

    try {
      const token = localStorage.getItem('token');
      console.log(`Deleting user ${id}`);
      const url = `${API_URL}/users/${id}`;
      console.log("DELETE request to:", url);
      
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(`User ${id} deleted successfully`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error("Error al eliminar el usuario:", error.response || error);
      alert("No se pudo eliminar el usuario. Por favor, intente de nuevo.");
    }
  };

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="users-dash">
      <h2>Gestión de Usuarios</h2>
      {users.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        users.map(user => (
          <div key={user.id} className="user-item">
            <h3>{user.email}</h3>
            <p>Admin: {user.isAdmin ? 'Sí' : 'No'}</p>
            <button onClick={() => handleToggleAdmin(user.id, user.isAdmin)}>
              {user.isAdmin ? 'Quitar admin' : 'Hacer admin'}
            </button>
            <button onClick={() => handleDelete(user.id)}>Eliminar</button>
          </div>
        ))
      )}
    </div>
  );
}

export default DashboardUsers;