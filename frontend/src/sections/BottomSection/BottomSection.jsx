import React from 'react';
import styles from './BottomSection.module.css';
import { MdBolt, MdSecurity, MdSupportAgent, MdStar, MdRocketLaunch } from 'react-icons/md';
import { NavLink } from 'react-router-dom';

const features = [
    {
        icon: <MdBolt />, title: 'Lightning Fast', desc: 'Websites delivered in 24 hours. No delays, just results.'
    },
    {
        icon: <MdSecurity />, title: 'Secure & Reliable', desc: 'Top-tier security and 99.9% uptime for your peace of mind.'
    },
    {
        icon: <MdSupportAgent />, title: '24/7 Support', desc: 'We’re here for you anytime, with real human support.'
    },
    {
        icon: <MdRocketLaunch />, title: 'Growth Focused', desc: 'SEO, analytics, and marketing tools to help you scale.'
    }
];

const testimonials = [
    {
        name: 'Priya S.',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        quote: 'Mancino delivered my website in less than a day! The process was smooth and the result was stunning.'
    },
    {
        name: 'Rahul M.',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        quote: 'The support team is amazing. They answered all my questions and made sure my site was perfect.'
    },
    {
        name: 'Ayesha K.',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        quote: 'I saw a boost in my business after launching my new site. Highly recommended!'
    }
];

export default function BottomSection() {
    return (
        <section className={styles.bottomSection}>
            {/* Why Choose Us */}
            <div className={styles.whyChooseUs}>
                <h2>Why Choose <span className={styles.brand}>Mancino?</span></h2>
                <div className={styles.featuresGrid}>
                    {features.map((f, i) => (
                        <div className={styles.featureCard} key={i}>
                            <div className={styles.icon}>{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials */}
            <div className={styles.testimonials}>
                <h2>What Our Customers Say</h2>
                <div className={styles.testimonialGrid}>
                    {testimonials.map((t, i) => (
                        <div className={styles.testimonialCard} key={i}>
                            <img src={t.avatar} alt={t.name} className={styles.avatar} />
                            <div className={styles.stars}>
                                {[...Array(5)].map((_, j) => <MdStar key={j} />)}
                            </div>
                            <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
                            <div className={styles.name}>{t.name}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Final CTA */}
            <div className={styles.finalCTA}>
                <div className={styles.ctaText}>
                    Ready to grow your business? Get your website today!
                </div>
                <NavLink to="/contact" className={styles.ctaButton}>
                    Get Started
                </NavLink>
            </div>
        </section>
    );
} 