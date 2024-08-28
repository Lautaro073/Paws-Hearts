import React, { useState } from 'react';
import { helpHttp } from '../../helpers/helpHttp';
import './sigIn.css'
const initialFormUser = {
  nombre: '',
  correo: '',
  contraseña: '',
  direccion: '',
  telefono: '',
  ciudad: '',
  pais: '',
  rol_id: 1, // Este valor se incluye siempre para el tipo de usuario
};

const initialFormRefugio = {
  nombre: '',
  correo: '',
  contraseña: '',
  nombre_refugio: '',
  descripcion_refugio: '',
  direccion: '',
  telefono: '',
  ciudad: '',
  pais: '',
};

const UserRegister = ({ setLoginUser, loginRefugio, setIsRegister }) => {
  const [registerForm, setRegisterForm] = useState(loginRefugio ? initialFormRefugio : initialFormUser);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    for (let key in registerForm) {
      if (!registerForm[key]) {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} es obligatorio`;
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const url = loginRefugio
        ? 'https://no-code-backend-sn9i.onrender.com/api/refugios/register_refugio'
        : 'https://no-code-backend-sn9i.onrender.com/api/users/register';
console.log(registerForm);
      helpHttp()
        .post(url, {
          body: registerForm,
          headers: {
            'Content-type': 'application/json',
            Accept: 'application/json',
          },
        })
        .then((response) => {
          if (!response.error) {
            setRegisterForm(loginRefugio ? initialFormRefugio : initialFormUser);
            setLoginUser(true);
          } else {
            console.log(response.status);
            console.log(response);
          }
        });
    }
  };

  return (
    <div className='register-container'>
      <form
        className='login__form-form flex-column-start'
        onSubmit={handleSubmit}
      >
        <h5>Registro {loginRefugio ? 'Refugio' : 'Usuario'}</h5>
        <div className='form__field flex-column-start'>
          <label>Nombre</label>
          <input
            name='nombre'
            value={registerForm.nombre}
            type='text'
            onChange={handleChange}
          />
          {formErrors.nombre && (
            <p className='form-error'>{formErrors.nombre}</p>
          )}
        </div>
        {loginRefugio && (
          <>
            <div className='form__field flex-column-start'>
              <label>Nombre del Refugio</label>
              <input
                name='nombre_refugio'
                value={registerForm.nombre_refugio}
                type='text'
                onChange={handleChange}
              />
              {formErrors.nombre_refugio && (
                <p className='form-error'>{formErrors.nombre_refugio}</p>
              )}
            </div>
            <div className='form__field flex-column-start'>
              <label>Descripción del Refugio</label>
              <input
                name='descripcion_refugio'
                value={registerForm.descripcion_refugio}
                type='text'
                onChange={handleChange}
              />
              {formErrors.descripcion_refugio && (
                <p className='form-error'>{formErrors.descripcion_refugio}</p>
              )}
            </div>
          </>
        )}
        <div className='form__field flex-column-start'>
          <label>Correo Electrónico</label>
          <input
            name='correo'
            type='email'
            value={registerForm.correo}
            onChange={handleChange}
          />
          {formErrors.correo && (
            <p className='form-error'>{formErrors.correo}</p>
          )}
        </div>
        <div className='form__field flex-column-start'>
          <label>Contraseña</label>
          <input
            name='contraseña'
            type='password'
            value={registerForm.contraseña}
            onChange={handleChange}
          />
          {formErrors.contraseña && (
            <p className='form-error'>{formErrors.contraseña}</p>
          )}
        </div>
        <div className='form__field flex-column-start'>
          <label>Dirección</label>
          <input
            name='direccion'
            value={registerForm.direccion}
            type='text'
            onChange={handleChange}
          />
          {formErrors.direccion && (
            <p className='form-error'>{formErrors.direccion}</p>
          )}
        </div>
        <div className='form__field flex-column-start'>
          <label>Teléfono</label>
          <input
            name='telefono'
            value={registerForm.telefono}
            type='text'
            onChange={handleChange}
          />
          {formErrors.telefono && (
            <p className='form-error'>{formErrors.telefono}</p>
          )}
        </div>
        <div className='form__field flex-column-start'>
          <label>Ciudad</label>
          <input
            name='ciudad'
            value={registerForm.ciudad}
            type='text'
            onChange={handleChange}
          />
          {formErrors.ciudad && (
            <p className='form-error'>{formErrors.ciudad}</p>
          )}
        </div>
        <div className='form__field flex-column-start'>
          <label>País</label>
          <input
            name='pais'
            value={registerForm.pais}
            type='text'
            onChange={handleChange}
          />
          {formErrors.pais && (
            <p className='form-error'>{formErrors.pais}</p>
          )}
        </div>
        <div className='form__btn-container flex-center'>
          <input
            type='submit'
            value='Registrar'
            className='secondary-btn'
          />
        </div>
      </form>
      <div className='login-redirect flex-column-start'>
        <p>{loginRefugio ? '¿Ya tienes una cuenta de refugio?' : '¿Ya tienes una cuenta?'}</p>
        <button
          className='secondary-btn'
          onClick={() => setIsRegister(true)}
        >
          Volver al login
        </button>
      </div>
    </div>
  );
};

export default UserRegister;
