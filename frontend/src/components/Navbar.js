"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, LayoutDashboard, Users, BarChart3, Settings } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    const navItems = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/discovery', label: 'Discovery', icon: Users },
        { href: '/metrics/exposure', label: 'Metrics', icon: BarChart3 },
    ];

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <div className={styles.logoIcon}>T</div>
                    <span className={styles.logoText}>Tent</span>
                    <span className={styles.logoBadge}>Pre-Delinquency</span>
                </Link>

                {/* Navigation Links */}
                <div className={styles.navLinks}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right Section */}
                <div className={styles.rightSection}>
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={styles.themeToggle}
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    {/* Settings */}
                    <button className={styles.iconButton} aria-label="Settings">
                        <Settings size={18} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
