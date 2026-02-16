"use client";

import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, BarChart3, Database, Lock, Globe, Code, Terminal, Cpu, Cloud, Activity, Box, Server } from 'lucide-react';
import Link from 'next/link';
import styles from './Landing.module.css';

export default function LandingPage() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.glow} />
                <div className={styles.gridBg} />

                <motion.div
                    className={styles.heroContent}
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.h1 className={styles.title} variants={fadeInUp}>
                        SentinelIQ <br /> by Team 8 Bit Thugs
                    </motion.h1>
                    <motion.p className={styles.subtitle} variants={fadeInUp}>
                        Empowering banks to detect early signs of financial stress and offer empathetic,
                        proactive support before customers miss a payment.
                    </motion.p>
                    <motion.div className={styles.ctaGroup} variants={fadeInUp}>
                        <Link href="/dashboard" className={styles.primaryBtn}>
                            Launch Dashboard
                        </Link>
                        <Link href="/discovery" className={styles.secondaryBtn}>
                            Run Discovery
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Problem Statement */}
            <section className={styles.section}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className={styles.sectionTitle}>The <span className={styles.highlight}>Challenge</span></h2>
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <div className={styles.iconWrapper}><Lock size={24} /></div>
                            <h3 className={styles.cardTitle}>Reactive Systems</h3>
                            <p className={styles.cardText}>
                                Most institutions intervene only after a missed payment, when recovery rates drop
                                sharply and relationships are already strained.
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.iconWrapper}><Database size={24} /></div>
                            <h3 className={styles.cardTitle}>Fragmented Data</h3>
                            <p className={styles.cardText}>
                                Early distress signals are subtle and scattered across product silos (salary delays,
                                utility lags), making them invisible to traditional models.
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.iconWrapper}><Globe size={24} /></div>
                            <h3 className={styles.cardTitle}>Generic Outreach</h3>
                            <p className={styles.cardText}>
                                One-size-fits-all collections calls damage trust. Banks need tailored, empathetic
                                interventions like payment holidays or restructuring.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Solution / Novelties */}
            <section className={styles.section} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', margin: '2rem auto' }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className={styles.sectionTitle}>Our <span className={styles.highlight}>Solution</span></h2>
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>Predictive Intelligence</h3>
                            <p className={styles.cardText}>
                                Uses ML (XGBoost, LightGBM) to forecast risk 2-4 weeks ahead by analyzing
                                behavioral cash-flow patterns and spending velocity.
                            </p>
                        </div>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>Real-Time Ingestion</h3>
                            <p className={styles.cardText}>
                                Stream processing via Apache Kafka and AWS Kinesis allows immediate detection
                                of critical triggers like failed auto-debits.
                            </p>
                        </div>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>Empathetic Actions</h3>
                            <p className={styles.cardText}>
                                Automated orchestration (Apache Airflow) triggers channel-agnostic, supportive
                                outreach instead of aggressive collections.
                            </p>
                        </div>

                    </div>
                </motion.div>
            </section>

            {/* Tech Stack */}
            <div className={styles.techSection}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Technology <span className={styles.highlight}>Stack</span></h2>
                    <motion.div
                        className={styles.techGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {['Next.js', 'React', 'FastAPI', 'Python', 'PostgreSQL', 'XGBoost', 'LightGBM', 'AWS SageMaker', 'Apache Kafka', 'Docker', 'Kubernetes'].map((tech) => {
                            const iconMap = {
                                'Next.js': Globe,
                                'React': Code,
                                'FastAPI': Zap,
                                'Python': Terminal,
                                'PostgreSQL': Database,
                                'XGBoost': Cpu,
                                'LightGBM': BarChart3,
                                'AWS SageMaker': Cloud,
                                'Apache Kafka': Activity,
                                'Docker': Box,
                                'Kubernetes': Server
                            };
                            const TechIcon = iconMap[tech] || Zap;
                            return (
                                <motion.span key={tech} className={styles.techTag} variants={fadeInUp}>
                                    <TechIcon size={14} color="#00AEEF" /> {tech}
                                </motion.span>
                            );
                        })}
                    </motion.div>
                </div>
            </div>

            {/* Benefits */}
            <section className={styles.section}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className={styles.sectionTitle}>Key <span className={styles.highlight}>Benefits</span></h2>
                    <table className={styles.comparisonTable}>
                        <thead>
                            <tr>
                                <th>Impact Area</th>
                                <th>Outcome</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>📉 Reduced Losses</td>
                                <td>Prevent write-offs by intervening weeks before default.</td>
                            </tr>
                            <tr>
                                <td>💰 Lower Costs</td>
                                <td>Avoid expensive (15-20%) post-delinquency collection agencies.</td>
                            </tr>
                            <tr>
                                <td>🤝 Customer Trust</td>
                                <td>Preserve relationships through supportive, non-intrusive engagement.</td>
                            </tr>
                            <tr>
                                <td>⚖️ Compliance</td>
                                <td>Ensure fair, unbiased treatment with explainable risk models.</td>
                            </tr>
                        </tbody>
                    </table>
                </motion.div>
            </section>

            {/* Footer */}
            <footer style={{ textAlign: 'center', padding: '4rem', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#64748B' }}>
                <p>© 2026 Barclays Hack-o-Hire Team : 8 Bit Thugs. Built with ❤️ and Code.</p>
            </footer>
        </div>
    );
}
