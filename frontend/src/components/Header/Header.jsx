import React, { useState } from 'react';
import styles from './Header.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <motion.header
            className={styles.header}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className={styles.headerContent}>
                <NavLink to="/" className={styles.logo} style={{ textDecoration: 'none' }}>
                    <img 
                        src="/mtlogo.png" 
                        alt="Mancino Logo" 
                        className={styles.logoImage}
                    />
                </NavLink>

                {/* Desktop Navigation */}
                <nav className={styles.desktopNav}>
                    <ul className={styles.navList}>
                        <NavLink to="/" style={{ textDecoration: 'none', color: "gray" }} onClick={toggleMenu}>
                            <li>Home</li>
                        </NavLink>
                        <li>Web Presence</li>
                        <li>API Integration</li>
                        <li>Crypto</li>
                        <li>Web3</li>
                        <li>App Development</li>
                    </ul>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className={styles.mobileMenuButton}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <div className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </button>
                <NavLink to="/contact" className={styles.contactLink}>
                    <button
                        className={styles.getStartedButton}
                        aria-label="WhatsApp"
                    >
                        Get Started
                    </button>
                </NavLink>

            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.nav
                        className={styles.mobileNav}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <ul className={styles.mobileNavList}>
                            <NavLink to="/" style={{ textDecoration: 'none', color: "gray" }} onClick={toggleMenu}>
                                <li>Home</li>
                            </NavLink>
                            <li>Web Presence</li>
                            <li>API Integration</li>
                            <li>Content</li>
                            <li>E‑commerce</li>
                            <li>App Development</li>
                            <NavLink to="/contact" className={styles.contactLink}>
                                <button
                                    className={styles.getStartedButton_mobile}
                                    aria-label="WhatsApp"
                                >
                                    Get Started
                                </button>
                            </NavLink>
                        </ul>
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.header >
    );
}

export default Header;