import React from 'react';

interface IProps {
  target: React.RefObject<HTMLElement>;
  onIntersect: () => void;
  root?: React.RefObject<HTMLElement> | null;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export default function useIntersectionObserver({
  root = null,
  target,
  onIntersect = () => {},
  threshold = 1.0,
  rootMargin = '0px',
  enabled = true
}: IProps): void {
  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && onIntersect()),
      {
        root: root?.current,
        rootMargin,
        threshold
      }
    );

    const el = target && target.current;

    if (!el) {
      return;
    }

    observer.observe(el);

    // eslint-disable-next-line consistent-return
    return () => {
      observer.unobserve(el);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.current, enabled]);
}
