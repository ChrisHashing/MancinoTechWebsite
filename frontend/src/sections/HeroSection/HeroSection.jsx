import React from 'react';
import styles from './HeroSection.module.css';
import phonesImage from '../../assets/hero.png';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { MdCheckCircle, MdStar, MdTrendingUp, MdRocketLaunch } from 'react-icons/md';

const HeroSection = () => {
    return (
        <motion.section
            className={styles.hero}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
            <div className={styles.container}>
                <div className={styles.textContent}>
                    <motion.div
                        className={styles.badge}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <MdRocketLaunch />
                        <span>Fastest Delivery in the Industry</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        Transform Your Business with
                        <span className={styles.highlight}> Professional Websites</span>
                        <br />
                        <span className={styles.price}>Starting at $199</span>
                    </motion.h1>

                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        Get a stunning, mobile-responsive website delivered in 24 hours.
                        Boost your online presence and start converting visitors into customers today.
                    </motion.p>

                    <motion.div
                        className={styles.features}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        <div className={styles.feature}>
                            <MdCheckCircle />
                            <span>24-Hour Delivery</span>
                        </div>
                        <div className={styles.feature}>
                            <MdCheckCircle />
                            <span>Mobile Responsive</span>
                        </div>
                        <div className={styles.feature}>
                            <MdCheckCircle />
                            <span>SEO Optimized</span>
                        </div>
                        <div className={styles.feature}>
                            <MdCheckCircle />
                            <span>Free Hosting</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className={styles.ctaSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                    >
                        <NavLink to="/contact" className={styles.contactLink}>
                            <button className={styles.primaryCTA}>
                                Get Your Website Now
                            </button>
                        </NavLink>
                    </motion.div>

                    <motion.div
                        className={styles.socialProof}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.7 }}
                    >
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>500+</span>
                                <span className={styles.statLabel}>Happy Clients</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>4.9</span>
                                <span className={styles.statLabel}>
                                    <MdStar />
                                    <MdStar />
                                    <MdStar />
                                    <MdStar />
                                    <MdStar />
                                </span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>24h</span>
                                <span className={styles.statLabel}>Delivery</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    className={styles.imageContainer}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
                >
                    <img
                        src={phonesImage}
                        alt="Professional Website Design"
                        className={styles.image}
                        loading="lazy"
                    />
                </motion.div>
            </div>
        </motion.section>
    );
};

export default HeroSection;
