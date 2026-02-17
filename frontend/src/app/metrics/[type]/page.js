"use client";

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useTheme } from '../../../contexts/ThemeContext';
import { API_ENDPOINTS } from '../../../config/api';
import styles from './metrics.module.css';

export default function MetricDetail({ params }) {
    const { type } = use(params);
    const { theme } = useTheme();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});

    useEffect(() => {
        fetch(API_ENDPOINTS.users)
            .then(res => res.json())
            .then(allUsers => {
                setUsers(allUsers);
                processData(type, allUsers);
                setLoading(false);
            });
    }, [type]);

    const processData = (metricType, allUsers) => {
        let processed = [];
        let summary = {};

        if (metricType === 'exposure') {
            // Top Exposures
            processed = allUsers
                .map(u => ({ name: u.name, value: u.exposure || 0, score: u.score }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 10);
            summary = { title: "Top Portfolio Exposures", desc: "Users with highest calculated loan exposure." };
        } else if (metricType === 'risk') {
            // Risk Distribution
            const high = allUsers.filter(u => u.score > 75).length;
            const med = allUsers.filter(u => u.score > 50 && u.score <= 75).length;
            const low = allUsers.filter(u => u.score <= 50).length;

            processed = [
                { name: 'Critical (>75)', value: high, color: '#DC2626' },
                { name: 'At Risk (50-75)', value: med, color: '#F59E0B' },
                { name: 'Safe (<50)', value: low, color: '#16A34A' }
            ];
            summary = { title: "Risk Profile Distribution", desc: "Breakdown of user base by risk category." };
        } else if (metricType === 'success') {
            // Intervention Success
            const safe = allUsers.filter(u => u.status === 'Safe').length;
            const total = allUsers.length;
            processed = [
                { name: 'Safe / Low Risk', value: safe, color: '#16A34A' },
                { name: 'At Risk', value: total - safe, color: '#94A3B8' }
            ];
            summary = { title: "Intervention Efficacy", desc: "Percentage of users effectively managed." };
        } else if (metricType === 'recovery') {
            // Recoveries
            processed = allUsers
                .filter(u => u.status === 'Warning')
                .map(u => ({ name: u.name, value: u.score, status: 'Recovering' }));
            summary = { title: "Active Recovery Queue", desc: "Users currently being monitored for improvement." };
        }
        setData(processed);
        setStats(summary);
    };

    const COLORS = ['#00AEEF', '#0A3D5C', '#60A5FA', '#3B82F6'];

    // Format currency for Y-axis
    const formatCurrency = (value) => {
        if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
        if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
        if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
        return `₹${value}`;
    };

    // Format currency for tooltip
    const formatTooltipCurrency = (value) => {
        if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
        if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
        return `₹${value.toLocaleString()}`;
    };

    if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Loading Analysis...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <Link href="/dashboard" className={styles.backLink}>
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Link>
                    <h1 className={styles.title}>{stats.title}</h1>
                    <p className={styles.subtitle}>{stats.desc}</p>
                </div>
            </header>

            <main className={styles.content}>
                {/* Chart Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={styles.chartCard}>
                    <h3>Visual Breakdown</h3>
                    <div style={{ width: '100%', height: 500 }}>
                        {type === 'exposure' ? (
                            <ResponsiveContainer>
                                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 85 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: '#F8FAFC', fontSize: 10 }}
                                        stroke="#334155"
                                        angle={-35}
                                        textAnchor="end"
                                        height={100}
                                        interval={0}
                                    />
                                    <YAxis
                                        tick={{ fill: '#F8FAFC', fontSize: 11 }}
                                        stroke="#334155"
                                        tickFormatter={formatCurrency}
                                        width={85}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#1E2433',
                                            border: '1px solid #2D3748',
                                            borderRadius: '6px',
                                            color: '#f8fafcb4'
                                        }}
                                        formatter={formatTooltipCurrency}
                                    />
                                    <Bar dataKey="value" fill="#00AEEF" name="Exposure" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (type === 'risk' || type === 'success') ? (
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={3}
                                        dataKey="value"
                                        label={({ name, value, percent }) => `${value} (${(percent * 100).toFixed(0)}%)`}
                                        labelLine={{ stroke: '#F8FAFC', strokeWidth: 1 }}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: theme === 'dark' ? '#1E2433' : '#FFFFFF',
                                            border: `1px solid ${theme === 'dark' ? '#2D3748' : '#E5E7EB'}`,
                                            borderRadius: '6px',
                                            color: theme === 'dark' ? '#E5E7EB' : '#1A2332'
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={50}
                                        wrapperStyle={{ color: theme === 'dark' ? '#E5E7EB' : '#1A2332' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : type === 'recovery' ? (
                            <div className="flex-center" style={{ height: '100%', flexDirection: 'column', gap: '1rem' }}>
                                <ResponsiveContainer width="100%" height={500}>
                                    <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                        <XAxis type="number" domain={[0, 100]} stroke="#F8FAFC" />
                                        <YAxis dataKey="name" type="category" width={100} stroke="#F8FAFC" />
                                        <Tooltip
                                            contentStyle={{
                                                background: '#1E2433',
                                                border: '1px solid #2D3748',
                                                borderRadius: '6px',
                                                color: '#F8FAFC'
                                            }}
                                        />
                                        <Bar dataKey="value" name="Recovery Score" fill="#00AEEF" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Higher score indicates better recovery progress.</p>
                            </div>
                        ) : (
                            <div className="flex-center" style={{ height: '100%', color: '#E2E8F0' }}>
                                Table View Only
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* List/Table Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={styles.listCard}>
                    <h3>Detailed Records</h3>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Metric Value</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {type === 'exposure' && data.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.name}</td>
                                        <td>₹{(item.value).toLocaleString()}</td>
                                        <td><span className={styles.badge}>{item.score > 50 ? 'High Risk' : 'Standard'}</span></td>
                                    </tr>
                                ))}
                                {type === 'risk' && users.filter(u => u.score > 50).sort((a, b) => b.score - a.score).map((u, i) => (
                                    <tr key={i}>
                                        <td>{u.name}</td>
                                        <td>Risk Score: {u.score}</td>
                                        <td>{u.volatility}</td>
                                    </tr>
                                ))}
                                {type === 'success' && users.map((u, i) => (
                                    <tr key={i}>
                                        <td>{u.name}</td>
                                        <td>{u.status}</td>
                                        <td style={{ color: u.status === 'Safe' ? '#10b981' : '#f59e0b' }}>{u.status === 'Safe' ? 'Protected' : 'At Risk'}</td>
                                    </tr>
                                )).slice(0, 20)}
                                {type === 'recovery' && data.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.name}</td>
                                        <td>Score: {item.value}</td>
                                        <td>Recovering</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
