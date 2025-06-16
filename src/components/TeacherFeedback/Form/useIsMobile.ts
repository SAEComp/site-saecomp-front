import { useState, useEffect } from "react";


const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');

        const handleMediaChange = () => setIsMobile(mediaQuery.matches);

        handleMediaChange();
        mediaQuery.addEventListener('change', handleMediaChange);

        return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }, []);

    return isMobile;
}

export default useIsMobile