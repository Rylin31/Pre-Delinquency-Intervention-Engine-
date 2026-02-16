"use client";

import { use, useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
    ArrowLeft, TrendingUp, AlertTriangle, Activity,
    Wallet, CreditCard, ShieldAlert, Zap
} from 'lucide-react';
import { API_ENDPOINTS } from '../../../config/api';
import Link from 'next/link';

const COLORS = ['#00AEEF', '#00395D', '#008A4B', '#FF9E1B', '#E20613', '#64748B', '#A0AEC0'];

export default function UserProfile({ params }) {
    const { id } = use(params);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [intervention, setIntervention] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/users/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("User not found");
                return res.json();
            })
            .then(data => {
                // Calculate Percentages for Frontend Dislay
                const total = data.total_spend || 1;
                data.expenditure_breakdown = data.expenditure_breakdown.map(item => ({
                    ...item,
                    percent: ((item.value / total) * 100).toFixed(1)
                }));
                setUser(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const triggerDiscovery = async (reason) => {
        const res = await fetch(API_ENDPOINTS.discovery, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: id, reason })
        });
        const data = await res.json();
        setIntervention(data.intervention);
    };

    if (loading) return <div className={styles.loading}>Loading Profile...</div>;
    if (!user) return <div className={styles.loading}>User Not Found</div>;

    return (
        <div className={styles.container}>
            {/* Minimal Header */}
            <header className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={18} /> <span>Back</span>
                </Link>
                <div className={styles.headerContent}>
                    <div>
                        <h1 className={styles.name}>{user.name}</h1>
                        <div className={styles.meta}>
                            <span className={styles.role}>{user.occupation}</span>
                            <span className={styles.dot}>•</span>
                            <span className={styles.id}>{user.id}</span>
                        </div>
                    </div>
                    <div className={`${styles.statusBadge} ${styles[user.status.toLowerCase()]}`}>
                        <span className={styles.statusDot}></span>
                        {user.status} Risk
                    </div>
                </div>
            </header>

            <div className={styles.grid}>
                {/* Left Column: Financials */}
                <div className={styles.mainCol}>

                    {/* Quick Stats Row */}
                    <div className={styles.statsRow}>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}><Wallet size={20} /></div>
                            <div>
                                <span className={styles.statLabel}>Monthly Income</span>
                                <div className={styles.statValue}>₹{(user.income / 1000).toFixed(1)}k</div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}><CreditCard size={20} /></div>
                            <div>
                                <span className={styles.statLabel}>Total Spend</span>
                                <div className={styles.statValue}>₹{(user.total_spend / 1000).toFixed(1)}k</div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}><ShieldAlert size={20} /></div>
                            <div>
                                <span className={styles.statLabel}>Risk Score</span>
                                <div className={styles.statValue} style={{ color: user.risk_score > 75 ? '#ef4444' : '#10b981' }}>
                                    {user.risk_score}<span className={styles.subScale}>/100</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expenditure Chart */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Expenditure Breakdown</h3>
                        <div className={styles.chartLayout}>
                            <div className={styles.chartWrapper}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={user.expenditure_breakdown}
                                            innerRadius={65}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {user.expenditure_breakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            itemStyle={{ color: '#333', fontSize: '12px' }}
                                            formatter={(value) => `₹${value.toLocaleString()}`}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className={styles.chartCenterText}>
                                    <span>Total</span>
                                    <strong>₹{(user.total_spend / 1000).toFixed(1)}k</strong>
                                </div>
                            </div>

                            <div className={styles.legend}>
                                {user.expenditure_breakdown.map((item, idx) => (
                                    <div key={idx} className={styles.legendItem}>
                                        <div className={styles.legendLeft}>
                                            <span className={styles.colorDot} style={{ background: COLORS[idx % COLORS.length] }}></span>
                                            <span className={styles.legendLabel}>{item.name}</span>
                                        </div>
                                        <div className={styles.legendRight}>
                                            <span className={styles.percent}>{item.percent}%</span>
                                            <span className={styles.amount}>₹{(item.value / 1000).toFixed(1)}k</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Loan Details */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Loan Obligations</h3>

                        {/* Summary Stats */}
                        <div className={styles.loanSummary}>
                            <div className={styles.loanStat}>
                                <span className={styles.loanStatLabel}>Total EMI</span>
                                <div className={styles.loanStatValue}>₹{(user.total_emi / 1000).toFixed(1)}k</div>
                            </div>
                            <div className={styles.loanStat}>
                                <span className={styles.loanStatLabel}>Disposable Income</span>
                                <div className={styles.loanStatValue} style={{
                                    color: user.can_repay ? '#10b981' : '#ef4444'
                                }}>
                                    ₹{(user.disposable_income / 1000).toFixed(1)}k
                                </div>
                            </div>
                            <div className={styles.loanStat}>
                                <span className={styles.loanStatLabel}>Repayment Status</span>
                                <div className={`${styles.repaymentBadge} ${user.can_repay ? styles.canRepay : styles.cannotRepay}`}>
                                    {user.can_repay ? '✓ Sustainable' : '⚠ At Risk'}
                                </div>
                            </div>
                        </div>

                        {/* Loan List */}
                        {user.loans && user.loans.length > 0 ? (
                            <div className={styles.loanList}>
                                {user.loans.map((loan, idx) => (
                                    <div key={idx} className={styles.loanItem}>
                                        <div className={styles.loanHeader}>
                                            <span className={styles.loanType}>{loan.type}</span>
                                            <span className={styles.loanEmi}>₹{(loan.emi / 1000).toFixed(1)}k/mo</span>
                                        </div>
                                        <div className={styles.loanDetails}>
                                            <div className={styles.loanDetailItem}>
                                                <span>Outstanding</span>
                                                <strong>₹{(loan.outstanding / 1000).toFixed(1)}k</strong>
                                            </div>
                                            <div className={styles.loanDetailItem}>
                                                <span>Interest</span>
                                                <strong>{loan.interest_rate}%</strong>
                                            </div>
                                            <div className={styles.loanDetailItem}>
                                                <span>Remaining</span>
                                                <strong>{loan.remaining_months} mo</strong>
                                            </div>
                                        </div>
                                        <div className={styles.loanProgress}>
                                            <div
                                                className={styles.loanProgressBar}
                                                style={{
                                                    width: `${((loan.principal - loan.outstanding) / loan.principal * 100).toFixed(0)}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.noLoans}>No active loans</div>
                        )}
                    </div>
                </div>

                {/* Right Column: Risk & Actions */}
                <div className={styles.sideCol}>

                    {/* Actions / Intervention */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Intervention Console</h3>
                        <div className={styles.actionGrid}>
                            <button onClick={() => triggerDiscovery('salary')} className={styles.actionBtn}>
                                <Activity size={16} /> Salary Impact
                            </button>
                            <button onClick={() => triggerDiscovery('job')} className={`${styles.actionBtn} ${styles.danger}`}>
                                <Zap size={16} /> Job Loss
                            </button>
                        </div>

                        {intervention && (
                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={styles.interventionBox}>
                                <div className={styles.interventionHeader}>
                                    <TrendingUp size={16} />
                                    <span>{intervention.action}</span>
                                </div>
                                <p>{intervention.message}</p>
                            </motion.div>
                        )}
                    </div>

                    {/* SHAP Indicators */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Distress Indicators</h3>
                        <ul className={styles.indicatorList}>
                            {user.shap_values.map((item, idx) => (
                                <li key={idx} className={styles.indicatorItem}>
                                    <div className={styles.indicatorHeader}>
                                        <span className={styles.indicatorName}>{item.feature}</span>
                                        <span className={styles.indicatorImpact} style={{ color: '#ef4444' }}>High Impact</span>
                                    </div>
                                    <p className={styles.indicatorDesc}>{item.desc}</p>
                                    <div className={styles.progressBar}>
                                        <div className={styles.progressFill} style={{ width: `${Math.min(item.impact * 3, 100)}%` }}></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
}
