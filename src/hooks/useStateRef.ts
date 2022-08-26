import { MutableRefObject, useRef, useState } from 'react';

export default function useStateRef<T>(
  initialValue?: T
): [T, (val: T) => void, MutableRefObject<T>] {
  const valueRef = useRef<T>(initialValue as T);
  const [state, setState] = useState<T>(initialValue as T);
  const setStateWrapper = (value: T) => {
    valueRef.current = value;
    setState(value);
  };
  return [state, setStateWrapper, valueRef];
}
