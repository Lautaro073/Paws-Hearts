import React, { useState } from "react";
import { FaTimesCircle, FaUpload } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { helpHttp } from "../../helpers/helpHttp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialForm = {
  nombre: "",
  especie: "",
  raza: "",
  edad: "",
  descripcion: "",
  imagenes: [], // Aquí almacenaremos las imágenes en formato File
};


const RegisterPetForm = ({ isModalOpen, closeModal }) => {
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");

  const { isAuth } = useAuth();

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFileSelected(true);
      setFileName(event.target.files[0].name); // Guarda el nombre del archivo
      setForm({
        ...form,
        imagenes: Array.from(event.target.files), // Guarda los archivos seleccionados
      });
    } else {
      setFileSelected(false);
      setFileName(""); // Resetea el nombre del archivo
      setForm({
        ...form,
        imagenes: [], // Resetea los archivos seleccionados
      });
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!form.nombre) {
      errors.nombre = "El nombre de la mascota es obligatorio";
      isValid = false;
    }
    if (!form.especie) {
      errors.especie = "La especie de la mascota es obligatoria";
      isValid = false;
    }
    if (!form.raza) {
      errors.raza = "La raza de la mascota es obligatoria";
      isValid = false;
    }
    if (!form.edad) {
      errors.edad = "La edad de la mascota es obligatoria";
      isValid = false;
    }
    if (!form.descripcion) {
      errors.descripcion = "La descripción de la mascota es obligatoria";
      isValid = false;
    }
    if (form.imagenes.length === 0) {
      errors.imagenes = "Debe agregar al menos una imagen";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const registersuccess = () => toast.success("Mascota registrada correctamente");
  const registererror = () => toast.error("Error al registrar la mascota");
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Registrando mascota...");

      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("especie", form.especie);
      formData.append("raza", form.raza);
      formData.append("edad", form.edad);
      formData.append("descripcion", form.descripcion);

      const refugioId = localStorage.getItem("refugioId");
      if (refugioId) {
        formData.append("refugio_id", refugioId);
      } else {
        console.error("No se encontró el ID del refugio en localStorage");
        return;
      }

      form.imagenes.forEach((file) => {
        formData.append("imagenes", file);
      });

      helpHttp()
        .post(
          "https://no-code-backend-sn9i.onrender.com/api/pets/register_pet",
          {
            body: formData,
          }
        )
        .then((response) => {
          if (!response.error) {
            registersuccess();
            closeModal();
          } else {
            registererror();
          }
        })
        .catch((error) => {
          console.error("Error al enviar la solicitud:", error);
        });
    }
  };

  if (!isModalOpen) return null;

  if (!isAuth) {
    return (
      <div className="login__form-overlay flex-center">
        <article className="login__form-container flex-column">
          <FaTimesCircle className="close__btn2" onClick={closeModal} />
          <img src="./img/logo.png" alt="" className="login__form-img" />
          <p style={{ color: "#fff" }}>
            Por favor, inicie sesión como refugio para registrar una mascota.
          </p>
        </article>
      </div>
    );
  }

  return (
    <>
    
    <div className="login__form-overlay flex-center">
      <article className="login__form-container flex-column">
        <FaTimesCircle className="close__btn2" onClick={closeModal} />
        <img src="./img/logo.png" alt="" className="login__form-img" />
        <form
          className="login__form-form login flex-column-start"
          onSubmit={handleSubmit}
        >
          <h5>Registro de Mascota</h5>
          <div className="form__field flex-column-start">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre || ""}
              onChange={handleChange}
            />
            {formErrors.nombre && (
              <p className="form-error">{formErrors.nombre}</p>
            )}
          </div>
          <div className="form__field flex-column-start">
            <label>Especie</label>
            <input
              type="text"
              name="especie"
              value={form.especie || ""}
              onChange={handleChange}
            />
            {formErrors.especie && (
              <p className="form-error">{formErrors.especie}</p>
            )}
          </div>
          <div className="form__field flex-column-start">
            <label>Raza</label>
            <input
              type="text"
              name="raza"
              value={form.raza || ""}
              onChange={handleChange}
            />
            {formErrors.raza && <p className="form-error">{formErrors.raza}</p>}
          </div>
          <div className="form__field flex-column-start">
            <label>Edad</label>
            <input
              type="number"
              name="edad"
              value={form.edad || ""}
              onChange={handleChange}
            />
            {formErrors.edad && <p className="form-error">{formErrors.edad}</p>}
          </div>
          <div className="form__field flex-column-start">
            <label>Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={form.descripcion || ""}
              onChange={handleChange}
            />
            {formErrors.descripcion && (
              <p className="form-error">{formErrors.descripcion}</p>
            )}
          </div>
          <div className="file-input-container">
            <label
              className={`file-input-label ${fileSelected ? 'file-selected' : ''}`}
              htmlFor="file-upload"
            >
              <FaUpload style={{ marginRight: '0.5rem' }} />
              {fileName ? `Archivo: ${fileName}` : 'Seleccionar archivo'}
            </label>
            <input
              id="file-upload"
              type="file"
              className="file-input"
              onChange={handleFileChange}
              multiple
            />
            {formErrors.imagenes && (
              <p className="form-error">{formErrors.imagenes}</p>
            )}
          </div>

          <div className="form__btn-container flex-center">
            <input
              type="submit"
              value="Registrar Mascota"
              className="secondary-btn"
            />
          </div>
        </form>
      </article>
      
    </div>
    </>
  );
};

export default RegisterPetForm;
