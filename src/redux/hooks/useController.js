// src/redux/hooks/useController.js
// This file is included for structural completeness, but is not used in the Redux implementation
// since Redux hooks (useDispatch, useSelector) are used directly in the components instead.
import { useRef, useReducer } from 'react';

export function useController(Controller) {
    // This hook is not used in the Redux implementation
    console.warn('useController hook is not used in Redux implementation');
    
    const controllerRef = useRef();
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    if (!controllerRef.current) {
        controllerRef.current = new Controller();
        controllerRef.current.notify = () => forceUpdate();
    }

    return controllerRef.current;
}