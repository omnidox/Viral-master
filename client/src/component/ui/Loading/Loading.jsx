import styles from './Loading.module.css';

const Loading = ({ className }) => (
    <div className={`d-flex flex-grow-1 align-items-center justify-content-center ${styles.loading} ${className}`}>
        <div className={styles.ring}>
            <div className={styles.ringPortion}></div>
            <div className={styles.ringPortion}></div>
            <div className={styles.ringPortion}></div>
        </div>
    </div>
)

export default Loading;
