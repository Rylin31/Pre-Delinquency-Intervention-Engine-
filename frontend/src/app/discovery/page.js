"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MessageSquare, ArrowRight, CheckCircle, AlertTriangle, Briefcase, CalendarClock, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import styles from './Discovery.module.css';

export default function DiscoveryFlow() {
    const [step, setStep] = useState(0);
    const [reason, setReason] = useState(null);

    const messages = [
        { type: 'bot', text: 'Hi Arjun. We noticed a potential liquidity gap in your upcoming cycle. Are you expecting any changes to your income this month?' },
        { type: 'bot', text: 'Please select the situation that best applies to you so we can customize your repayment options.' },
    ];

    const handleSelect = (selectedReason) => {
        setReason(selectedReason);
        setTimeout(() => setStep(step + 1), 600);
    };

    const reasons = [
        { id: 'salary', label: 'Salary Delay / Timing Mismatch', icon: CalendarClock },
        { id: 'job', label: 'Job Loss / Income Stopped', icon: Briefcase },
        { id: 'medical', label: 'Medical Emergency', icon: HeartPulse },
        { id: 'other', label: 'Other Financial Strain', icon: AlertTriangle },
    ];

    return (
        <div className={styles.container}>
            <motion.div
                className={`${styles.card} glass`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.header}>
                    <h1 className={styles.title}>Financial Wellness Check</h1>
                    <p className={styles.subtitle}>Confidential & Secure</p>
                </div>

                <div className={styles.chat}>
                    <div className={`${styles.bubble} ${styles.bot}`}>
                        {messages[0].text}
                    </div>

                    {step >= 1 && (
                        <motion.div
                            className={`${styles.bubble} ${styles.user}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            Yes, I'm facing a temporary issue.
                        </motion.div>
                    )}

                    {step >= 1 && (
                        <motion.div
                            className={`${styles.bubble} ${styles.bot}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            {messages[1].text}
                        </motion.div>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-center"
                        >
                            <button
                                className="btn btn-primary"
                                onClick={() => setStep(1)}
                            >
                                Start Check-In
                            </button>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            className={styles.options}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {reasons.map((r) => {
                                const Icon = r.icon;
                                return (
                                    <div
                                        key={r.id}
                                        className={`${styles.option} ${reason === r.id ? styles.selected : ''}`}
                                        onClick={() => handleSelect(r.id)}
                                    >
                                        <Icon size={20} className={reason === r.id ? 'text-indigo-400' : 'text-slate-400'} />
                                        {r.label}
                                        {reason === r.id && <CheckCircle size={16} className="text-emerald-400 ml-auto" />}
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <div className="mb-4">
                                <CheckCircle size={48} className="mx-auto text-emerald-400 mb-2" />
                                <h3 className="text-xl font-bold">Thank You</h3>
                                <p className="text-secondary text-sm mt-2">
                                    Based on your input ({reasons.find(r => r.id === reason)?.label}),
                                    we have paused late fees for 14 days.
                                </p>
                            </div>
                            <Link href="/">
                                <button className="btn btn-outline w-full">Return to Dashboard</button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
