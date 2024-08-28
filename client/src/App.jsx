import React, { useEffect, useState } from 'react';
import { helpHttp } from './helpers/helpHttp';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Dashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RefugioDashboard from './pages/RefugioDashboard';
import { AuthProvider } from './context/AuthContext';
import AllPets from './components/AllPets'; 
import './index.css';

function App() {
  const [pets, setPets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  let petsUrl = 'https://no-code-backend-sn9i.onrender.com/api/pets';

  useEffect(() => {
    helpHttp()
      .get(petsUrl)
      .then((resp) => {
        if (!resp.error) {
          setPets(resp);
        } else {
          setPets([]);
        }
      });
  }, []);

  // Abrir el modal del Login
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Cerrar el modal del Login
  const closeModal = () => {
    setIsModalOpen(false);
  };
 /* function hacerSolicitud() {
    fetch('https://no-code-backend-sn9i.onrender.com/api/pets')
    .then(response => response.json())
    .then(data => console.log("get realizado"))
    .catch(error => console.error('Error:', error))

    console.log('Realizando la solicitud GET...');
  }
  
  setInterval(hacerSolicitud, 60000);
  */
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <Home
                pets={pets}
                isModalOpen={isModalOpen}
                openModal={openModal}
                closeModal={closeModal}
              />
            }
          />
          <Route
            path='/all-pets'
            element={
              <AllPets
                pets={pets}
                isModalOpen={isModalOpen}
                openModal={openModal}
                closeModal={closeModal}
              />
            }
          />
          <Route
            path='/user-dashboard'
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
          path='/admin-dashboard'
          element={
            <PrivateRoute>
             <AdminDashboard />
            </PrivateRoute>
          }
          />
          <Route
          path='/refugio-dashboard'
          element={
            <PrivateRoute>
             <RefugioDashboard />
            </PrivateRoute>
          }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
