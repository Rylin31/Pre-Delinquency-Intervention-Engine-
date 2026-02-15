import Link from 'next/link';
import { API_ENDPOINTS } from '../config/api';
import styles from './RiskTracker.module.css';

import { useState, useEffect } from 'react';

export default function RiskTracker() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(API_ENDPOINTS.users)
            .then(res => res.json())
            .then(data => {
                // Sort users by risk score (highest first)
                const sortedUsers = data.sort((a, b) => b.score - a.score);
                setUsers(sortedUsers);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch users:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading Risk Data...</div>;


    const getStatusClass = (status) => {
        switch (status) {
            case 'Critical': return styles.statusCritical;
            case 'Warning': return styles.statusWarning;
            default: return styles.statusClean;
        }
    };

    const getRiskColor = (score) => {
        if (score >= 80) return '#ef4444';
        if (score >= 50) return '#f59e0b';
        return '#10b981';
    };

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.thead}>
                        <th className={styles.th}>User ID</th>
                        <th className={styles.th}>Name</th>
                        <th className={styles.th}>Risk Score</th>
                        <th className={styles.th}>Volatility</th>
                        <th className={styles.th}>Status</th>
                        <th className={styles.th}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className={styles.tr}>
                            <td className={styles.td}>
                                <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{user.id}</span>
                            </td>
                            <td className={styles.td}>
                                <div className={styles.user}>
                                    <div className={styles.avatar}>{user.name.charAt(0)}</div>
                                    <span>{user.name}</span>
                                </div>
                            </td>
                            <td className={styles.td}>
                                <div className={styles.riskContainer}>
                                    <span style={{ fontWeight: 700, minWidth: '30px', color: getRiskColor(user.score) }}>{user.score}%</span>
                                    <div className={styles.riskTrack}>
                                        <div
                                            className={styles.riskFill}
                                            style={{ width: `${user.score}%`, background: getRiskColor(user.score) }}
                                        />
                                    </div>
                                </div>
                            </td>
                            <td className={styles.td}>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                    {user.volatility}
                                </span>
                            </td>
                            <td className={styles.td}>
                                <span className={`${styles.status} ${getStatusClass(user.status)}`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className={styles.td}>
                                <Link href={`/profile/${user.id}`}>
                                    <button className={styles.actionBtn}>View Profile</button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
