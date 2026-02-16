"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  TrendingUp,
  Users,
  Activity,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { API_ENDPOINTS } from '../../config/api';
import StatCard from '../../components/StatCard';
import RiskTracker from '../../components/RiskTracker';
import styles from './page.module.css';

export default function Dashboard() {
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [stats, setStats] = useState({
    exposure: "Loading...",
    atRisk: "...",
    successRate: "...",
    recoveries: "..."
  });

  useEffect(() => {
    fetch(API_ENDPOINTS.users)
      .then(res => res.json())
      .then(data => {
        const totalExposure = data.reduce((acc, u) => acc + (u.exposure || 0), 0);
        const atRiskCount = data.filter(u => u.score > 50).length;
        const recoveryCount = data.filter(u => u.status === 'Warning').length;
        const safeCount = data.filter(u => u.status !== 'Critical').length;
        const successRateVal = ((safeCount / data.length) * 100).toFixed(1);

        setStats({
          exposure: `₹${(totalExposure / 10000000).toFixed(2)} Cr`,
          atRisk: atRiskCount,
          successRate: `${successRateVal}%`,
          recoveries: recoveryCount
        });
      })
      .catch(err => console.error("Stats fetch failed", err));
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const generateReport = async () => {
    setLoadingReport(true);
    try {
      const res = await fetch(API_ENDPOINTS.users);
      const users = await res.json();

      // Aggregate Risk Factors
      const factors = {};
      let totalHighRisk = 0;

      users.forEach(u => {
        if (u.score > 50) {
          totalHighRisk++;
          const factor = u.volatility || "Unknown";
          factors[factor] = (factors[factor] || 0) + 1;
        }
      });

      // Sort factors
      const sortedFactors = Object.entries(factors)
        .sort(([, a], [, b]) => b - a)
        .map(([key, count]) => ({
          name: key,
          count,
          percent: ((count / totalHighRisk) * 100).toFixed(1)
        }));

      setReportData({ total: totalHighRisk, factors: sortedFactors });
      setShowReport(true);
    } catch (e) {
      console.error("Report generation failed", e);
    } finally {
      setLoadingReport(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportData) return;

    // Dynamic import to avoid SSR issues with jspdf
    const { jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 44, 52);
    doc.text("Pre-Delinquency Intervention Report", 14, 22);

    // Meta-data
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total High-Risk Profiles Analyzed: ${reportData.total}`, 14, 36);

    // Table
    const tableData = reportData.factors.map(f => [
      f.name,
      `${f.percent}%`,
      f.count
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['Risk Factor / Distress Indicator', 'Impact (%)', 'Users Affected']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 40, halign: 'center' },
        2: { cellWidth: 40, halign: 'center' }
      }
    });

    // Footer
    const finalY = doc.lastAutoTable.finalY || 50;
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Confidential - Internal Use Only", 14, finalY + 10);

    doc.save("risk_intervention_report.pdf");
  };

  return (
    <main className={styles.main}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        <header className={styles.sectionHeader} style={{ marginBottom: '2rem' }}>
          <div>
            <h1 className={styles.title}>SentinelIQ</h1>
            <p style={{ color: '#E2E8F0' }}>Real-time financial risk monitoring by 8 Bit Thugs</p>
          </div>
          <Link href="/discovery">
            <button className="btn btn-primary flex-center" style={{ gap: '0.5rem' }}>
              Launch Discovery Flow <ArrowRight size={18} />
            </button>
          </Link>
        </header>

        <section className={styles.grid}>
          <Link href="/metrics/exposure" style={{ textDecoration: 'none' }}>
            <motion.div variants={item} style={{ cursor: 'pointer' }}>
              <StatCard
                title="Portfolio Exposure"
                value={stats.exposure}
                change="2.1%"
                isPositive={false}
                icon={TrendingUp}
              />
            </motion.div>
          </Link>
          <Link href="/metrics/risk" style={{ textDecoration: 'none' }}>
            <motion.div variants={item} style={{ cursor: 'pointer' }}>
              <StatCard
                title="At-Risk Users (50-85%)"
                value={stats.atRisk}
                change="12"
                isPositive={false}
                icon={AlertTriangle}
              />
            </motion.div>
          </Link>
          <Link href="/metrics/success" style={{ textDecoration: 'none' }}>
            <motion.div variants={item} style={{ cursor: 'pointer' }}>
              <StatCard
                title="Intervention Success"
                value={stats.successRate}
                change="5.3%"
                isPositive={true}
                icon={ShieldCheck}
              />
            </motion.div>
          </Link>
          <Link href="/metrics/recovery" style={{ textDecoration: 'none' }}>
            <motion.div variants={item} style={{ cursor: 'pointer' }}>
              <StatCard
                title="Active Recoveries"
                value={stats.recoveries}
                change="8.2%"
                isPositive={true}
                icon={Activity}
              />
            </motion.div>
          </Link>
        </section>

        <motion.section variants={item} className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>High-Risk Detection Queue</h2>
            <button
              className="btn btn-outline"
              onClick={generateReport}
              disabled={loadingReport}
            >
              {loadingReport ? 'Analyzing...' : 'Generate SHAP Report'}
            </button>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Users flagged by Gate 3 (Persistence & Volatility Calibration) logic.
          </p>
          <RiskTracker />
        </motion.section>
      </motion.div>

      {/* SHAP Report Modal */}
      {showReport && reportData && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'white',
              width: '500px',
              maxWidth: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* Fixed Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0
            }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                  Aggregate SHAP Analysis
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem', margin: 0 }}>
                  Analyzed <strong>{reportData.total}</strong> High-Risk Profiles
                </p>
              </div>
              <button
                onClick={() => setShowReport(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.5rem', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div style={{
              padding: '1.5rem',
              overflowY: 'auto',
              flex: 1
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reportData.factors.map((f, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem', color: '#334155' }}>
                      <span style={{ fontWeight: 500 }}>{f.name}</span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{f.percent}% <span style={{ color: '#94a3b8', fontWeight: 400 }}>({f.count})</span></span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${f.percent}%` }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        style={{ background: '#ef4444', height: '100%', borderRadius: '4px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fixed Footer */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '1rem',
              flexShrink: 0
            }}>
              <button
                onClick={() => setShowReport(false)}
                style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: 'white', color: '#475569', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}
              >
                Close
              </button>
              <button className="btn btn-primary" onClick={downloadPDF} style={{ fontSize: '0.875rem' }}>
                Export Executive PDF
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
