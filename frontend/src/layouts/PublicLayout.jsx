import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

export default function PublicLayout() {
    return (
        <div className='wrapper'>
            <Header />
            <motion.div transition={{ duration: 0.7, ease: 'easeOut' }}>
                <Outlet />
            </motion.div>
            <Footer />
        </div>
    );
}


