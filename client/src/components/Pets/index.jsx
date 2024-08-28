import React, { useState, useEffect } from 'react';
import { Element } from 'react-scroll';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './Pets.css';
import AdoptPetForm from '../AdoptPetForm';
import LogIn from '../LogIn'; 
import PetInfoModal from '../PetInfoModal';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Pets = ({ pets }) => {
  const [images, setImages] = useState({});
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isLogInOpen, setIsLogInOpen] = useState(false);
  const { isAuth } = useAuth();

  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};
      for (const pet of pets) {
        const response = await fetch(`https://no-code-backend-sn9i.onrender.com/api/pets/${pet.id}/images`);
        const data = await response.json();
        if (data.length > 0) {
          const base64Images = data.map(img => `data:${img.mime_type};base64,${img.contenido}`);
          newImages[pet.id] = base64Images;
        }
      }
      setImages(newImages);
    };

    fetchImages();
  }, [pets]);

  const openInfoModal = (pet) => {
    setSelectedPet(pet);
    setIsInfoModalOpen(true);
  };

  const closeModals = () => {
    setIsInfoModalOpen(false);
    setIsAdoptModalOpen(false);
    setIsLogInOpen(false);
    setSelectedPet(null);
  };

  const openAdoptModal = () => {
    if (isAuth) {
      setIsInfoModalOpen(false);
      setIsAdoptModalOpen(true);
    } else {
      setIsLogInOpen(true);
    }
  };

  const petsToShow = pets.slice(0, 6);

  return (
    <section className="pets">
      <Element name="pets" className="container flex-column">
        <div className="text-container flex-column">
          <h6 className="section-subtitle">Mascotas en Adopción</h6>
          <h2>
            Te guiamos en cada paso del proceso de adopción para encontrar el
            compañero perfecto.
          </h2>
        </div>
        <div className="pets__card-container flex-center">
          {petsToShow.map((pet) => (
            <figure className="flex-column pet__card" key={pet.id}>
              {!images[pet.id] ? (
                <Skeleton width={200} height={200} />
              ) : (
                <img src={images[pet.id][0]} alt={pet.nombre} className="pet__card-img" />
              )}
              <figcaption className="flex-column pet__card-details">
                <div className="flex-between pet__card-text">
                  <h6>{pet.nombre}</h6>
                  <span>{pet.raza}</span>
                </div>
                <a className="secondary-btn" onClick={() => openInfoModal(pet)}>
                  Adóptame
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="flex-center">
          <Link to="/all-pets" className="secondary-btn">
            Ver más
          </Link>
        </div>
      </Element>

      {isInfoModalOpen && (
        <PetInfoModal
          isOpen={isInfoModalOpen}
          closeModal={closeModals}
          pet={selectedPet}
          images={images[selectedPet.id]} // Passing the array of images here
          openAdoptModal={openAdoptModal}
        />
      )}

      {isAdoptModalOpen && (
        <AdoptPetForm
          isModalOpen={isAdoptModalOpen}
          closeModal={closeModals}
          selectedPetId={selectedPet.id}
        />
      )}

      {isLogInOpen && (
        <LogIn
          isModalOpen={isLogInOpen}
          closeModal={closeModals}
        />
      )}
    </section>
  );
};

export default Pets;
