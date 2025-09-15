import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/admin/login', { replace: true });
    };

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <div className={styles.left}>
                    <Link to="/admin" className={styles.brand}>
                        Admin
                    </Link>
                    <nav className={styles.nav}>
                        <Link to="/admin" className={styles.navLink}>
                            Dashboard
                        </Link>
                    </nav>
                </div>
                <div className={styles.right}>
                    <span className={styles.userEmail}>{user?.email}</span>
                    <button onClick={onLogout} className={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </header>
            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
}
