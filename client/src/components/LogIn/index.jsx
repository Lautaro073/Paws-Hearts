import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { helpHttp } from '../../helpers/helpHttp';
import UserRegister from '../SignIn';
import { FaTimesCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const initialForm = {
  correo: '',
  contraseña: '',
};

const LogIn = ({ isModalOpen, closeModal }) => {
  const [loginUser, setLoginUser] = useState(true); 
  const [loginRefugio, setLoginRefugio] = useState(false);
  const [loginForm, setLoginForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [isRegister, setIsRegister] = useState(true);
  const { login } = useAuth();

  const loginsuccess = () => toast.success("Inicio de sesión exitoso");
  const loginerror = () =>toast.error("Error al iniciar sesión");
 

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    for (let key in loginForm) {
      if (!loginForm[key]) {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} es obligatorio`;
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const url = loginRefugio
        ? 'https://no-code-backend-sn9i.onrender.com/api/refugios/login_refugios'
        : 'https://no-code-backend-sn9i.onrender.com/api/users/login';

      helpHttp()
        .post(url, {
          body: loginForm,
          headers: {
            'Content-type': 'application/json',
            Accept: 'application/json',
          },
        })
        .then((response) => {
          if (response.token && (response.userId || response.refugioId)) {
            
            login(response.token, response.userId, response.rol|| response.refugioId, loginRefugio ? 'refugioId' : 'userId');
            loginsuccess();
            closeModal();
          } else {
            loginerror();
          }
        })
        .catch((error) => {
          console.error('Error en la solicitud:', error);
          alert('Error en la solicitud');
        });
    }
  };

  const registerForm = () => {
    setIsRegister(false); 
  };
  
  const handleToggleLoginType = () => {
    setLoginRefugio(!loginRefugio);
  };

  return (
    <>
    <ToastContainer theme="dark" position="bottom-left" />
      {isModalOpen && (
        <div className='login__form-overlay flex-center'>
          <article className='login__form-container flex-column'>
            <FaTimesCircle className='close__btn' onClick={closeModal} />
            <img src='./img/logo.png' alt='' className='login__form-img' />
            {isRegister ? (
              <form
                className='login__form-form login flex-column-start'
                onSubmit={handleSubmit}
              >
                <h5>Iniciar Sesión {loginRefugio ? 'Refugio' : 'Usuario'}</h5>
                <div className='form__field flex-column-start'>
                  <label>Correo Electrónico</label>
                  <input
                    type='email'
                    name='correo'
                    value={loginForm.correo}
                    onChange={handleChange}
                  />
                  {formErrors.correo && (
                    <p className='form-error'>{formErrors.correo}</p>
                  )}
                </div>
                <div className='form__field flex-column-start'>
                  <label>Contraseña</label>
                  <input
                    type='password'
                    name='contraseña'
                    value={loginForm.contraseña}
                    onChange={handleChange}
                  />
                  {formErrors.contraseña && (
                    <p className='form-error'>{formErrors.contraseña}</p>
                  )}
                </div>
                <div className='form__btn-container flex-center'>
                  <input
                    type='submit'
                    value='Iniciar Sesión'
                    className='secondary-btn'
                  />
                </div>
                <p>
                  ¿No tienes una cuenta?
                  <span onClick={registerForm}> Inscribirte</span>
                </p>
                <p>
                  {loginRefugio ? (
                    <>
                      ¿Eres un usuario?
                      <span onClick={handleToggleLoginType}>
                        {' Ingresar Aquí'}
                      </span>
                    </>
                  ) : (
                    <>
                      ¿Eres un refugio?
                      <span onClick={handleToggleLoginType}>
                        {' Ingresar Aquí'}
                      </span>
                    </>
                  )}
                </p>
              </form>
            ) : (
              <UserRegister
                setLoginUser={setLoginUser}
                loginRefugio={loginRefugio}
                setIsRegister={setIsRegister} 
              />
            )}
          </article>
        </div>
      )}
    </>
  );
}

export default LogIn;
