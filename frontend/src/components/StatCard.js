import styles from './StatCard.module.css';

export default function StatCard({ title, value, change, isPositive, icon }) {
    const IconComponent = icon;

    return (
        <div className={`glass ${styles.card}`}>
            <div className={styles.header}>
                <span className={styles.title}>{title}</span>
                {icon && (
                    <div className={styles.icon}>
                        <IconComponent size={20} />
                    </div>
                )}
            </div>
            <div className={styles.value}>{value}</div>
            {change && (
                <div className={`${styles.meta} ${isPositive ? styles.positive : styles.negative}`}>
                    <span>{isPositive ? "↑" : "↓"} {change}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>vs last month</span>
                </div>
            )}
        </div>
    );
}
