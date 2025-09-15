import React, { useEffect, useState } from 'react';
import styles from './Contact.module.css';
import { FaWhatsapp, FaEnvelope, FaDiscord } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../auth/AuthContext';

function Contact() {
  const { API_BASE } = useAuth();
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    logo: '',
    budget: '',
    deliveryDate: '',
    style: '',
    purpose: '',
  });
  const [status, setStatus] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      const messageParts = [
        form.logo ? `Logo: ${form.logo}` : null,
        form.budget ? `Budget: ${form.budget}` : null,
        form.deliveryDate ? `Delivery Date: ${form.deliveryDate}` : null,
        form.style ? `Style: ${form.style}` : null,
        form.purpose ? `Purpose: ${form.purpose}` : null,
      ].filter(Boolean);

      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          logo: form.logo,
          budget: form.budget,
          deliveryDate: form.deliveryDate,
          style: form.style,
          purpose: form.purpose,
          message: messageParts.join('\n'),
          source: 'contact-form',
        }),
      });
      if (res.ok) {
        setStatus('success');
        setShowSuccessModal(true);
        setForm({ name: '', email: '', phone: '', logo: '', budget: '', deliveryDate: '', style: '', purpose: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <motion.div transition={{ duration: 0.7, ease: 'easeOut' }}>
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className={styles.footer}>
          <div className={styles.topSection}>
            <div className={styles.subtitle}>GET IN TOUCH</div>
            <h1 className={styles.title}>Tell us more about your business</h1>
            <div className={styles.description}>
              Help us understand your needs better so we can create the perfect solution for your business.
            </div>

            <form onSubmit={handleSubmit}>
              {/* Name - required */}
              <div className={styles.block}>
                <label htmlFor="name" className={styles.question}>Your Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.7rem 1rem', fontSize: '1rem', borderRadius: '7px', border: '1.5px solid #E5E7EB', marginTop: '0.5rem', marginBottom: '1.5rem' }}
                />
              </div>
              {/* Email Address - first field */}
              <div className={styles.block}>
                <label htmlFor="email" className={styles.question}>Your Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.7rem 1rem', fontSize: '1rem', borderRadius: '7px', border: '1.5px solid #E5E7EB', marginTop: '0.5rem', marginBottom: '1.5rem' }}
                />
              </div>
              {/* Phone - optional */}
              <div className={styles.block}>
                <label htmlFor="phone" className={styles.question}>Phone (optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+1 555 123 4567"
                  value={form.phone}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.7rem 1rem', fontSize: '1rem', borderRadius: '7px', border: '1.5px solid #E5E7EB', marginTop: '0.5rem', marginBottom: '1.5rem' }}
                />
              </div>
              {/* Logo Question */}
              <div className={styles.block}>
                <p className={styles.question}>Do you have a logo?</p>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="logo"
                      value="yes"
                      required
                      checked={form.logo === 'yes'}
                      onChange={handleChange}
                    />
                    <span className={styles.radioText}>Yes</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="logo"
                      value="needs-update"
                      checked={form.logo === 'needs-update'}
                      onChange={handleChange}
                    />
                    <span className={styles.radioText}>Yes, but needs update</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="logo"
                      value="no"
                      checked={form.logo === 'no'}
                      onChange={handleChange}
                    />
                    <span className={styles.radioText}>No</span>
                  </label>
                </div>
              </div>

              {/* Budget Dropdown */}
              <div className={styles.block}>
                <label htmlFor="budget" className={styles.question}>What is your budget?</label>
                <select
                  id="budget"
                  name="budget"
                  required
                  value={form.budget}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.7rem 1rem', fontSize: '1rem', borderRadius: '7px', border: '1.5px solid #E5E7EB', marginTop: '0.5rem', marginBottom: '1.5rem' }}
                >
                  <option value="" disabled>Select your budget</option>
                  <option value="under-500">Under $500</option>
                  <option value="500-1000">$500 - $1000</option>
                  <option value="1000-2500">$1000 - $2500</option>
                  <option value="2500-plus">$2500+</option>
                </select>
              </div>

              {/* Expected Delivery Date */}
              <div className={styles.block}>
                <label htmlFor="deliveryDate" className={styles.question}>Expected delivery date?</label>
                <input
                  type="date"
                  id="deliveryDate"
                  name="deliveryDate"
                  required
                  value={form.deliveryDate}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.7rem 1rem', fontSize: '1rem', borderRadius: '7px', border: '1.5px solid #E5E7EB', marginTop: '0.5rem', marginBottom: '1.5rem' }}
                />
              </div>

              {/* Style Preference */}
              <div className={styles.block}>
                <p className={styles.question}>Which style looks best to you?</p>
                <div className={styles.styleGrid}>
                  <label className={styles.card}>
                    <input type="radio" name="style" value="classic" required checked={form.style === 'classic'} onChange={handleChange} /> Classic
                  </label>
                  <label className={styles.card}>
                    <input type="radio" name="style" value="retro" checked={form.style === 'retro'} onChange={handleChange} /> Retro
                  </label>
                  <label className={styles.card}>
                    <input type="radio" name="style" value="pro" checked={form.style === 'pro'} onChange={handleChange} /> Pro
                  </label>
                  <label className={styles.card}>
                    <input type="radio" name="style" value="simple" checked={form.style === 'simple'} onChange={handleChange} /> Simple
                  </label>
                </div>
              </div>

              {/* Purpose */}
              <div className={styles.block}>
                <p className={styles.question}>What's the main purpose of your website?</p>
                <div className={styles.purposeGrid}>
                  <label className={styles.purpose}>
                    <input type="radio" name="purpose" value="web-presence" required checked={form.purpose === 'web-presence'} onChange={handleChange} /> Web Presence
                  </label>
                  <label className={styles.purpose}>
                    <input type="radio" name="purpose" value="sales-funnel" checked={form.purpose === 'sales-funnel'} onChange={handleChange} /> Sales Funnel
                  </label>
                  <label className={styles.purpose}>
                    <input type="radio" name="purpose" value="educate-clients" checked={form.purpose === 'educate-clients'} onChange={handleChange} /> Educate Clients
                  </label>
                  <label className={styles.purpose}>
                    <input type="radio" name="purpose" value="sell-products-online" checked={form.purpose === 'sell-products-online'} onChange={handleChange} /> Sell Products Online
                  </label>
                </div>
              </div>

              <button type="submit" className={styles.button}>
                Submit
              </button>
              {status === 'error' && <div style={{ color: 'red', marginTop: 12 }}>There was an error submitting the form.</div>}
            </form>

            <div className={styles.copy}>
              We'll get back to you within 24 hours
            </div>
            <div className={styles.right}>
              <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp />
              </a>
              <a href="mailto:your@email.com">
                <FaEnvelope />
              </a>
              <a href="#discord">
                <FaDiscord />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className={styles.bottomSection}>



          </div>
        </div>

        {showSuccessModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', borderRadius: 8, padding: '1.5rem', maxWidth: 420, width: '90%', textAlign: 'center' }}>
              <h3 style={{ margin: 0, marginBottom: 8 }}>Thank you!</h3>
              <p style={{ margin: 0, marginBottom: 16 }}>Your request has been submitted successfully. We will contact you soon.</p>
              <button className={styles.button} onClick={() => setShowSuccessModal(false)}>Close</button>
            </div>
          </div>
        )}
      </motion.section>
    </motion.div>

  );
}

export default Contact;