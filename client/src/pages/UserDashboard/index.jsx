import React, { useEffect, useState } from 'react';
import './UserDashboard.css';
import Header from '../../components/Header';

const UserDashboard = () => {
  const [formularios, setFormularios] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchFormularios = async () => {
      try {
        const response = await fetch(`https://no-code-backend-sn9i.onrender.com/api/formularios-adopcion/${userId}`);
        if (!response.ok) {
          throw new Error('Error al obtener los formularios de adopción');
        }
        const data = await response.json();
        setFormularios(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchFormularios();
  }, [userId]);

  useEffect(() => {
    const fetchMascotas = async (mascotaIds) => {
      try {
        const mascotasData = await Promise.all(mascotaIds.map(async (id) => {
          const response = await fetch(`https://no-code-backend-sn9i.onrender.com/api/pets/${id}`);
          if (!response.ok) {
            throw new Error('Error al obtener los detalles de las mascotas');
          }
          const mascota = await response.json();
          const imageResponse = await fetch(`https://no-code-backend-sn9i.onrender.com/api/pets/${id}/images`);
          if (!imageResponse.ok) {
            throw new Error('Error al obtener las imágenes de las mascotas');
          }
          const images = await imageResponse.json();
          const base64Image = images.length > 0 ? `data:${images[0].mime_type};base64,${images[0].contenido}` : null;
          return { ...mascota, foto: base64Image };
        }));
        setMascotas(mascotasData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (formularios.length > 0) {
      const mascotaIds = formularios.map(formulario => formulario.mascota_id);
      fetchMascotas(mascotaIds);
    }
  }, [formularios]);

  const getMascotaDetails = (id) => mascotas.find(mascota => mascota.id === id);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <>
      <Header />
      <section className='dashboard flex-center'>
        <div className='container flex-column'>
          <div className='text-container flex-column'>
            <h2>Bienvenido</h2>
            {formularios.length > 0 ? (
              <>
                <table className='formularios'>
                  <thead>
                    <tr>
                      <th>Foto</th>
                      <th>Nombre</th>
                      <th>Raza</th>
                      <th>Edad</th>
                      <th>Fecha de Solicitud</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formularios.map((formulario) => {
                      const mascota = getMascotaDetails(formulario.mascota_id);
                      return mascota ? (
                        <tr key={formulario.id}>
                          <td>
                            {mascota.foto ? (
                              <img src={mascota.foto} alt={mascota.nombre} className='mascota-foto' />
                            ) : (
                              <p>No hay foto</p>
                            )}
                          </td>
                          <td>{mascota.nombre}</td>
                          <td>{mascota.raza}</td>
                          <td>{mascota.edad}</td>
                          <td>{formatDate(formulario.fecha_solicitud)}</td>
                          <td>{formulario.estado_solicitud}</td>
                        </tr>
                      ) : null;
                    })}
                  </tbody>
                </table>
                <div className='pet-card-container'>
                  {formularios.map((formulario) => {
                    const mascota = getMascotaDetails(formulario.mascota_id);
                    return mascota ? (
                      <div className='pet-card' key={formulario.id}>
                        <img src={mascota.foto} alt={mascota.nombre} />
                        <p>Nombre: {mascota.nombre}</p>
                        <p>Raza: {mascota.raza}</p>
                        <p>Edad: {mascota.edad}</p>
                        <p>Fecha de Solicitud: {formatDate(formulario.fecha_solicitud)}</p>
                        <p>Estado: {formulario.estado_solicitud}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              </>
            ) : (
              <p>No tienes solicitudes de adopción.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default UserDashboard;
