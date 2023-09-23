import { useEffect } from "react";

const InfiniteScroll = ({ onEnd, children }) => {
    useEffect(() => {
        const scrollHandler = () => {
            clearTimeout(window.scrollEndTimer);
            window.scrollEndTimer = setTimeout(() => {
                const element = document.documentElement;
                if (Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < 1) {
                    onEnd();
                }
            }, 100);
        };

        document.addEventListener('scroll', scrollHandler)
        return () => document.removeEventListener('scroll', scrollHandler);
    }, [onEnd]);

    return <>{children}</>;
};

export default InfiniteScroll;