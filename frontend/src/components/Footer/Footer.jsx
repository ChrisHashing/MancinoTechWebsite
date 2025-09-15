import React from 'react';
import styles from './Footer.module.css';
import { FaWhatsapp, FaEnvelope, FaDiscord } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.left}>
          <NavLink to="/" className={styles.logo} style={{ textDecoration: 'none' }}>mancino</NavLink>
        </div>
        <div className={styles.center}>
          <NavLink to="/" className={styles.link}>Home</NavLink>
          <NavLink to="/" className={styles.link}>Services</NavLink>
          <NavLink to="/contact" className={styles.link}>Contact</NavLink>
        </div>
        <div className={styles.right}>
          <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer" className={styles.icon}><FaWhatsapp /></a>
          <a href="mailto:your@email.com" className={styles.icon}><FaEnvelope /></a>
          <a href="#discord" className={styles.icon}><FaDiscord /></a>
        </div>
      </div>
      <div className={styles.copyright}>
        &copy; {currentYear} Mancino — Business Website Experts
      </div>
    </footer>
  );
}

export default Footer;
