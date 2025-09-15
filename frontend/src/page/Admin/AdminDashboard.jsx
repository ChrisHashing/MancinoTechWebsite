import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import LeadDetailsModal from '../../components/LeadDetailsModal/LeadDetailsModal';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
    const { token, user, API_BASE, logout } = useAuth();
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedLead, setSelectedLead] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

    const fetchLeads = async (pageNum = page) => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams({ page: String(pageNum), limit: String(limit) });
            if (q) params.set('q', q);
            const res = await fetch(`${API_BASE}/api/leads?${params.toString()}`, { headers });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to load');
            setItems(data.items);
            setTotal(data.total);
            setPage(data.page);
            setLimit(data.limit);
        } catch (err) {
            setError(err.message || 'Failed to load');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    const handleRowClick = async (leadId) => {
        try {
            const res = await fetch(`${API_BASE}/api/leads/${leadId}`, { headers });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to load lead details');
            setSelectedLead(data);
            setIsModalOpen(true);
        } catch (err) {
            setError(err.message || 'Failed to load lead details');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedLead(null);
    };

    const handleUpdateStatus = async (leadId, newStatus) => {
        try {
            const res = await fetch(`${API_BASE}/api/leads/${leadId}`, {
                method: 'PUT',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update status');

            setItems(items.map(item =>
                item._id === leadId ? { ...item, status: newStatus } : item
            ));

            if (selectedLead && selectedLead._id === leadId) {
                setSelectedLead({ ...selectedLead, status: newStatus });
            }

            setSuccessMessage('Lead status updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);

            return data;
        } catch (err) {
            throw new Error(err.message || 'Failed to update lead status');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            new: '#007bff',
            contacted: '#28a745',
            qualified: '#ffc107',
            lost: '#dc3545',
            won: '#6f42c1'
        };
        return colors[status] || '#6c757d';
    };

    return (
        <div className={styles.container}>
           

            <div className={styles.searchRow}>
                <input
                    className={styles.searchInput}
                    placeholder="Search name/email/phone"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <button className={styles.btn} onClick={() => fetchLeads(1)}>Search</button>
            </div>

            {successMessage && (
                <div className={styles.success}>{successMessage}</div>
            )}

            {loading ? (
                <div className={styles.loading}>Loading...</div>
            ) : error ? (
                <div className={styles.error}>{error}</div>
            ) : (
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Name</th>
                                <th className={styles.th}>Email</th>
                                <th className={styles.th}>Phone</th>
                                <th className={styles.th}>Budget</th>
                                <th className={styles.th}>Style</th>
                                <th className={styles.th}>Purpose</th>
                                <th className={styles.th}>Source</th>
                                <th className={styles.th}>Status</th>
                                <th className={styles.th}>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((l) => (
                                <tr
                                    key={l._id}
                                    className={styles.clickableRow}
                                    onClick={() => handleRowClick(l._id)}
                                >
                                    <td className={styles.td}>{l.name}</td>
                                    <td className={styles.td}>{l.email}</td>
                                    <td className={styles.td}>{l.phone || '-'}</td>
                                    <td className={styles.td}>{l.budget || '-'}</td>
                                    <td className={styles.td}>{l.style || '-'}</td>
                                    <td className={styles.td}>{l.purpose || '-'}</td>
                                    <td className={styles.td}>{l.source || '-'}</td>
                                    <td className={styles.td}>
                                        <span
                                            className={styles.statusBadge}
                                            style={{ backgroundColor: getStatusColor(l.status) }}
                                        >
                                            {l.status}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        {new Date(l.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.pager}>
                        <div className={styles.count}>
                            Page {page} of {totalPages} • {total} total
                        </div>
                        <div className={styles.actions}>
                            <button
                                className={styles.btn}
                                onClick={() => fetchLeads(Math.max(1, page - 1))}
                                disabled={page <= 1}
                            >
                                Prev
                            </button>
                            <button
                                className={styles.btn}
                                onClick={() => fetchLeads(Math.min(totalPages, page + 1))}
                                disabled={page >= totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <LeadDetailsModal
                lead={selectedLead}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUpdateStatus={handleUpdateStatus}
            />
        </div>
    );
}
