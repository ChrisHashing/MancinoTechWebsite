import { useState } from 'react';
import styles from './LeadDetailsModal.module.css';

export default function LeadDetailsModal({ lead, isOpen, onClose, onUpdateStatus }) {
    const [selectedStatus, setSelectedStatus] = useState(lead?.status || 'new');
    const [isUpdating, setIsUpdating] = useState(false);

    if (!isOpen || !lead) return null;

    const statusOptions = [
        { value: 'new', label: 'New', color: '#007bff' },
        { value: 'contacted', label: 'Contacted', color: '#28a745' },
        { value: 'qualified', label: 'Qualified', color: '#ffc107' },
        { value: 'lost', label: 'Lost', color: '#dc3545' },
        { value: 'won', label: 'Won', color: '#6f42c1' }
    ];

    const handleStatusUpdate = async () => {
        if (selectedStatus === lead.status) return;

        setIsUpdating(true);
        try {
            await onUpdateStatus(lead._id, selectedStatus);
            onClose();
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const currentStatusOption = statusOptions.find(option => option.value === lead.status);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Lead Details</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.content}>
                    <div className={styles.section}>
                        <h3>Contact Information</h3>
                        <div className={styles.field}>
                            <label>Name:</label>
                            <span>{lead.name}</span>
                        </div>
                        <div className={styles.field}>
                            <label>Email:</label>
                            <span>{lead.email}</span>
                        </div>
                        <div className={styles.field}>
                            <label>Phone:</label>
                            <span>{lead.phone || 'Not provided'}</span>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3>Lead Information</h3>
                        <div className={styles.field}>
                            <label>Source:</label>
                            <span>{lead.source || 'Not specified'}</span>
                        </div>
                        <div className={styles.field}>
                            <label>Current Status:</label>
                            <span
                                className={styles.statusBadge}
                                style={{ backgroundColor: currentStatusOption?.color }}
                            >
                                {currentStatusOption?.label}
                            </span>
                        </div>
                        <div className={styles.field}>
                            <label>Created:</label>
                            <span>{new Date(lead.createdAt).toLocaleString()}</span>
                        </div>
                        <div className={styles.field}>
                            <label>Last Updated:</label>
                            <span>{new Date(lead.updatedAt).toLocaleString()}</span>
                        </div>
                    </div>

                    {lead.message && (
                        <div className={styles.section}>
                            <h3>Message</h3>
                            <div className={styles.message}>
                                {lead.message}
                            </div>
                        </div>
                    )}

                    {lead.meta && Object.keys(lead.meta).length > 0 && (
                        <div className={styles.section}>
                            <h3>Additional Information</h3>
                            <div className={styles.meta}>
                                {Object.entries(lead.meta).map(([key, value]) => (
                                    <div key={key} className={styles.field}>
                                        <label>{key}:</label>
                                        <span>{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={styles.section}>
                        <h3>Update Status</h3>
                        <div className={styles.statusUpdate}>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className={styles.statusSelect}
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <button
                                className={styles.updateButton}
                                onClick={handleStatusUpdate}
                                disabled={isUpdating || selectedStatus === lead.status}
                            >
                                {isUpdating ? 'Updating...' : 'Update Status'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
