import { useEffect } from 'react';

import { useSozCoreNuiEvent } from '../components/Nui/hooks/useNuiEvent';

export const useKeyPress = (targetKey: string, onKeyPress?: () => void) => {
    useEffect(() => {
        const downHandler = (event: KeyboardEvent) => {
            if (event.key === targetKey) {
                onKeyPress && onKeyPress();
            }
        };

        window.addEventListener('keydown', downHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
        };
    }, [targetKey, onKeyPress]);
};

export const useBackspace = (onKeyPress?: () => void) => {
    useSozCoreNuiEvent('Backspace', onKeyPress);
    useKeyPress('Backspace', onKeyPress);
};

export const useArrowDown = (onKeyPress: () => void) => {
    useSozCoreNuiEvent('ArrowDown', onKeyPress);
    useKeyPress('ArrowDown', onKeyPress);
};

export const useArrowUp = (onKeyPress: () => void) => {
    useSozCoreNuiEvent('ArrowUp', onKeyPress);
    useKeyPress('ArrowUp', onKeyPress);
};

export const useArrowRight = (onKeyPress: () => void) => {
    useSozCoreNuiEvent('ArrowRight', onKeyPress);
    useKeyPress('ArrowRight', onKeyPress);
};

export const useArrowLeft = (onKeyPress: () => void) => {
    useSozCoreNuiEvent('ArrowLeft', onKeyPress);
    useKeyPress('ArrowLeft', onKeyPress);
};

export const useEnter = (onKeyPress?: () => void) => {
    useSozCoreNuiEvent('Enter', onKeyPress);
    useKeyPress('Enter', onKeyPress);
};
