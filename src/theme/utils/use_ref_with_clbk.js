import * as React from 'react';


const useRefWithCallback = (onMount, onUnmount) => {
    const nodeRef = React.useRef(null);

    const setRef = React.useCallback(node => {
        if (nodeRef.current) {
            onUnmount(nodeRef.current);
        }

        nodeRef.current = node;

        if (nodeRef.current) {
            onMount(nodeRef.current);
        }
    }, [onMount, onUnmount]);

    return setRef;
}

export { useRefWithCallback }