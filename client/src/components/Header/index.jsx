import React, { useState } from 'react';
import { Link as ScrollLink, scroller } from 'react-scroll';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { FaUserCircle, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Header = ({ openModal }) => {
  const [clickMenu, setClickMenu] = useState(false);
  const { isAuth,role, logout, refugioId } = useAuth(); 
  const navigate = useNavigate(); 
  const location = useLocation();

  const handleClick = () => {
    setClickMenu(!clickMenu);
  };
  
  const handleUserIconClick = () => {
    if (isAuth&&role===1) {
      navigate('/user-dashboard');
    }
    if (isAuth&&role===2) {
      navigate('/admin-dashboard');
      
    }
    if (isAuth&&refugioId) {
      navigate('/refugio-dashboard');
    }
    else {
      openModal(); 
    }
  };

  const handleNavLinkClick = (sectionId) => {
    if (location.pathname === '/') {
      scroller.scrollTo(sectionId, {
        smooth: true,
        offset: -70,
        duration: 200,
      });
      setClickMenu(false);
    } else {
      navigate('/');
      setTimeout(() => {
        scroller.scrollTo(sectionId, {
          smooth: true,
          offset: -70,
          duration: 200,
        });
        setClickMenu(false);
      }, 100); // Ajusta el tiempo de espera si es necesario
    }
  };

  const isHomePage = location.pathname === '/';
  const isAllPetsPage = location.pathname === '/all-pets';
  const showLogoutLink = !isHomePage && !isAllPetsPage;

  return (
    <header>
      <article className='container flex-between'>
        <img className='site__logo' src='./img/logo.png' alt='paws & hearts' />
        <div className='menu__button' onClick={handleClick}>
          <img src='./img/menu-icon.svg' alt='icono de menu' />
        </div>
        <nav className={`navbar ${clickMenu ? 'open' : ''}`}>
          {isHomePage ? (
            <>
              <ScrollLink
                className='navbar__link'
                to='hero'
                smooth={true}
                offset={-70}
                duration={200}
                onClick={handleClick}
              >
                Inicio
              </ScrollLink>
              <ScrollLink
                className='navbar__link'
                to='about'
                smooth={true}
                offset={-70}
                duration={200}
                onClick={handleClick}
              >
                Sobre Nosotros
              </ScrollLink>
              <ScrollLink
                className='navbar__link'
                to='pets'
                smooth={true}
                offset={-70}
                duration={200}
                onClick={handleClick}
              >
                Adoptar
              </ScrollLink>
              <ScrollLink
                to='adoptions'
                className='navbar__link'
                smooth={true}
                offset={-70}
                duration={200}
                onClick={handleClick}
              >
                Dar en Adopción
              </ScrollLink>
              <ScrollLink
                to='testimonials'
                className='navbar__link'
                smooth={true}
                offset={-70}
                duration={200}
                onClick={handleClick}
              >
                Testimonios
              </ScrollLink>
            </>
          ) : (
            <>
              <Link className='navbar__link' to='/' onClick={() => handleNavLinkClick('hero')}>
                Inicio
              </Link>
              <Link className='navbar__link' to='/' onClick={() => handleNavLinkClick('about')}>
                Sobre Nosotros
              </Link>
              <Link className='navbar__link' to='/' onClick={() => handleNavLinkClick('pets')}>
                Adoptar
              </Link>
              <Link className='navbar__link' to='/' onClick={() => handleNavLinkClick('adoptions')}>
                Dar en Adopción
              </Link>
              <Link className='navbar__link' to='/' onClick={() => handleNavLinkClick('testimonials')}>
                Testimonios
              </Link>
            </>
          )}
          {showLogoutLink && (
            <Link className='navbar__link' to='/' onClick={logout}>
              Cerrar Sesión
            </Link>
          )}
          <div className='close__button' onClick={() => setClickMenu(false)}>
            <FaTimes />
          </div>
        </nav>
        <div className='flex-center user__icon-container' onClick={handleUserIconClick}>
          <FaUserCircle className='user__icon' />
        </div>
      </article>
    </header>
  );
};

export default Header;
