import React, { useState } from 'react';
import { Element } from 'react-scroll';
import RegisterPetForm from '../RegisterPetForm/index'; 
import './Adoptions.css';

const Adoptions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <section className='flex-center adoptions'>
      <Element name='adoptions' className='container flex-column'>
        <div className='text-container flex-column'>
          <div className='text-content flex-column'>
            <h6 className='section-subtitle'>Dar en Adopción</h6>
            <h2>Dale a tu mascota una segunda oportunidad.</h2>
          </div>
          <button className='secondary-btn' onClick={openModal}>
            Reubicación Responsable
          </button>
        </div>
        <div className='img-container flex-center'>
          <img src='./img/adoptions-img.png' alt='' />
        </div>
      </Element>

      
      <RegisterPetForm isModalOpen={isModalOpen} closeModal={closeModal} />
    </section>
  );
};

export default Adoptions;

