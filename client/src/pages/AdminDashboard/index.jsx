import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './AdminDashboard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [refugios, setRefugios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRefugio, setSelectedRefugio] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [usersOpen, setUsersOpen] = useState(false); // Por defecto está oculto
  const [refugiosOpen, setRefugiosOpen] = useState(false); // Por defecto está oculto
  const [formOpen, setFormOpen] = useState(false); // Por defecto está oculto
  
  const modifySuccess = () => toast.success('Modificación exitosa');
  const modifyError = (message) => toast.error(`Error al modificar: ${message}`);    
  const deleteSuccess = () => toast.success('Eliminación exitosa');
  const deleteError = () => toast.error('Error al eliminar'); 

  useEffect(() => {
    fetchUsers();
    fetchRefugios();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://no-code-backend-sn9i.onrender.com/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRefugios = async () => {
    try {
      const response = await fetch('https://no-code-backend-sn9i.onrender.com/api/refugios');
      const data = await response.json();
      setRefugios(data);
    } catch (error) {
      console.error('Error fetching refugios:', error);
    }
  };

  const handleModify = async (type, id) => {
    try {
      const url = `https://no-code-backend-sn9i.onrender.com/api/${type}/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        await fetchUsers();
        await fetchRefugios();
        setFormData({});
        modifySuccess();
        setSelectedUser(null);
        setSelectedRefugio(null);
        setSelectedForm(null);
      } else {
        const errorData = await response.json();
        modifyError(errorData.message || 'Error al modificar');
      }
    } catch (error) {
      modifyError(error.message);
    }
  };

  const handleDelete = async (type, id) => {
    try {
      const url = `https://no-code-backend-sn9i.onrender.com/api/${type}/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchUsers();
        await fetchRefugios();
        deleteSuccess();
      } else {
        deleteError();
      }
    } catch (error) {
      deleteError();
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const renderFormFields = () => {
    return (
      <>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre || ''}
          onChange={handleFormChange}
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={formData.correo || ''}
          onChange={handleFormChange}
          autoComplete='off'
        />
        <input
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          value={formData.contraseña || ''}
          onChange={handleFormChange}
        />
        {selectedRefugio && (
          <>
            <input
              type="text"
              name="nombre_refugio"
              placeholder="Nombre del Refugio"
              value={formData.nombre_refugio || ''}
              onChange={handleFormChange}
            />
            <input
              type="text"
              name="descripcion_refugio"
              placeholder="Descripción del Refugio"
              value={formData.descripcion_refugio || ''}
              onChange={handleFormChange}
            />
          </>
        )}
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion || ''}
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono || ''}
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="ciudad"
          placeholder="Ciudad"
          value={formData.ciudad || ''}
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="pais"
          placeholder="País"
          value={formData.pais || ''}
          onChange={handleFormChange}
        />
      </>
    );
  };

  return (
    <>
      <Header />
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <div className="section">
          <h2 onClick={() => setUsersOpen(!usersOpen)} className="section-title">Usuarios</h2>
          {usersOpen && (
            <ul className="list">
              {users.map(user => (
                <li key={user.id}>
                  {user.nombre} 
                  <button onClick={() => { setSelectedUser(user); setFormData(user); setFormOpen(true); }}>Modificar</button>
                  <button onClick={() => handleDelete('users', user.id)}>Eliminar</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="section">
          <h2 onClick={() => setRefugiosOpen(!refugiosOpen)} className="section-title">Refugios</h2>
          {refugiosOpen && (
            <ul className="list">
              {refugios.map(refugio => (
                <li key={refugio.id}>
                  {refugio.nombre_refugio}
                  <button onClick={() => { setSelectedRefugio(refugio); setFormData(refugio); setFormOpen(true); }}>Modificar</button>
                  <button onClick={() => handleDelete('refugios', refugio.id)}>Eliminar</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className='section'>
          <h2 onClick={() => setFormOpen(!formOpen)} className='section-title'>Modificar Datos</h2>
          {formOpen && (
            <div className="modify-form">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (selectedUser) {
                    handleModify('users', selectedUser.id);
                  } else if (selectedRefugio) {
                    handleModify('refugios', selectedRefugio.id);
                  } else if (selectedForm) {
                    handleModify('formularios', selectedForm.id);
                  }
                }}
              >
                {renderFormFields()}
                <button type="submit">Guardar Cambios</button>
              </form>
            </div>
          )}
        </div>
      </div>
      <ToastContainer theme="dark" position="bottom-left" />
    </>
  );
};

export default AdminDashboard;
