/*// src/pages/DashboardUsers.js
import React from 'react';

function DashboardUsers() {
  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      {}
    </div>
  );
}

export default DashboardUsers; */

import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import '../DashboardUsers.css';

function DashboardUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  const handleToggleAdmin = async (id, currentAdminStatus) => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, { isAdmin: !currentAdminStatus });
    // Actualiza el estado local
    setUsers(users.map(user => user.id === id ? { ...user, isAdmin: !currentAdminStatus } : user));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'users', id));
    // Elimina el usuario del estado local
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="users-dash">
      <h2>Gestión de Usuarios</h2>
      {users.map(user => (
        <div key={user.id}>
          <h3>{user.email}</h3>
          <p>Admin: {user.isAdmin ? 'Sí' : 'No'}</p>
          <button onClick={() => handleToggleAdmin(user.id, user.isAdmin)}>
            Cambiar estado de admin
          </button>
          <button onClick={() => handleDelete(user.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}

export default DashboardUsers;