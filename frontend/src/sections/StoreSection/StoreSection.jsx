import styles from './StoreSection.module.css';
import { motion } from 'framer-motion';
import { MdPersonOutline, MdLocationOn, MdWeb, MdPhoneIphone, MdCloud, MdBrush, MdSettings, MdMemory, MdApi, MdShoppingCart, MdBusiness, MdSecurity, MdContentPaste, MdBuild, MdSupportAgent } from 'react-icons/md';
import { AiOutlineRobot } from 'react-icons/ai';

const storeItems = [
    { name: 'Web Application Development', icon: <MdWeb /> },
    { name: 'Mobile App Development', icon: <MdPhoneIphone /> },
    { name: 'Progressive Web Apps', icon: <MdWeb /> },
    { name: 'Cloud Hosting', icon: <MdCloud /> },
    { name: 'UI/UX Design', icon: <MdBrush /> },
    { name: 'Custom Software Solutions', icon: <MdSettings /> },
    { name: 'AI & GPT Integration', icon: <AiOutlineRobot /> },
    { name: 'API Development', icon: <MdApi /> },
    { name: 'E-commerce Solutions', icon: <MdShoppingCart /> },
    { name: 'IT Consulting', icon: <MdBusiness /> },
    { name: 'DevOps Services', icon: <MdMemory /> },
    { name: 'Cybersecurity', icon: <MdSecurity /> },
    { name: 'Content Management Systems', icon: <MdContentPaste /> },
    { name: 'Website Maintenance', icon: <MdBuild /> },
    { name: 'Technical Support', icon: <MdSupportAgent /> }
];

const StoreSection = () => {


    return (
        <section className={styles.store}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h2 className={styles.title}>Service We Offer</h2>
                    <p className={styles.subtitle}>Empowering your business with expert web and IT services.</p>
                </div>
            </div>

            <div className={styles.marqueeContainer}>
                <motion.div
                    className={styles.marquee}
                    animate={{
                        x: [0, -100 * storeItems.length]
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 60,
                            ease: "linear",
                        },
                    }}
                >
                    {/* First set of items */}
                    {storeItems.map((item, index) => (
                        <div key={index} className={styles.item}>
                            <div className={styles.icon}>{item.icon}</div>
                            {/* removed image */}
                            <p className={styles.label}>{item.name}</p>
                        </div>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {storeItems.map((item, index) => (
                        <div key={`duplicate-${index}`} className={styles.item}>
                            <div className={styles.icon}>{item.icon}</div>
                            {/* removed image */}
                            <p className={styles.label}>{item.name}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default StoreSection;