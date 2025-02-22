// src/hooks/useController.js
import { useRef, useReducer } from 'react';

export function useController(Controller) {
    const controllerRef = useRef();
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    if (!controllerRef.current) {
        controllerRef.current = new Controller();
        controllerRef.current.notify = () => forceUpdate();
    }

    return controllerRef.current;
}
