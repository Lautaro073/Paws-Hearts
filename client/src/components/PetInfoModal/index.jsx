import React from 'react';
import './PetInfoModal.css';

const PetInfoModal = ({ isOpen, closeModal, pet, images = [], openAdoptModal }) => {
  if (!isOpen || !pet) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn2" onClick={closeModal}>
          &times;
        </button>
        <span>{pet.nombre}</span>
        <p><strong>Raza:</strong> {pet.raza}</p>
        <p><strong>Edad:</strong> {pet.edad} años</p>
        <p><strong>Descripción:</strong> {pet.descripcion}</p>
        <div className="pet-images">
          {images.length > 0 ? (
            images.map((img, index) => (
              <img key={index} src={img} alt={`${pet.nombre} ${index + 1}`} className="pet-image" />
            ))
          ) : (
            <p>No hay imágenes disponibles.</p>
          )}
        </div>
        <button className="secondary-btn" onClick={openAdoptModal}>
          Adoptar
        </button>
      </div>
    </div>
  );
};

export default PetInfoModal;
