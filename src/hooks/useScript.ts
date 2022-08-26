import { useEffect } from 'react';

const useScript = (url: string, onLoad?: () => unknown): void => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;
    if (onLoad) {
      script.onload = onLoad;
    }

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [onLoad, url]);
};

export default useScript;
