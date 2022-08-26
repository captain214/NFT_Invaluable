import { MutableRefObject, useEffect, useRef } from 'react';

const DEFAULT_EVENTS = ['mousedown', 'touchstart'];

/**
 * @see https://mantine.dev/hooks/use-click-outside/
 */
export function useClickOutside<T extends HTMLElement = any>(
  handler: () => void,
  events?: string[] | null,
  nodes?: HTMLElement[]
): MutableRefObject<T | undefined> {
  const ref = useRef<T>();

  useEffect(() => {
    const listener = (event: any) => {
      if (Array.isArray(nodes)) {
        const shouldTrigger = nodes.every((node) => !!node && !node.contains(event.target));
        // eslint-disable-next-line
        shouldTrigger && handler();
      } else if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    (events || DEFAULT_EVENTS).forEach((fn) => document.addEventListener(fn, listener));

    return () => {
      (events || DEFAULT_EVENTS).forEach((fn) => document.removeEventListener(fn, listener));
    };
  }, [ref, handler, nodes]);

  return ref;
}
