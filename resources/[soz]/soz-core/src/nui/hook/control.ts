import { useEffect } from 'react';

import { useMenuNuiEvent } from '../components/Nui/hooks/useNuiEvent';

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
    useMenuNuiEvent('Backspace', onKeyPress);
    useKeyPress('Backspace', onKeyPress);
};

export const useArrowDown = (onKeyPress: () => void) => {
    useMenuNuiEvent('ArrowDown', onKeyPress);
    useKeyPress('ArrowDown', onKeyPress);
};

export const useArrowUp = (onKeyPress: () => void) => {
    useMenuNuiEvent('ArrowUp', onKeyPress);
    useKeyPress('ArrowUp', onKeyPress);
};

export const useArrowRight = (onKeyPress: () => void) => {
    useMenuNuiEvent('ArrowRight', onKeyPress);
    useKeyPress('ArrowRight', onKeyPress);
};

export const useArrowLeft = (onKeyPress: () => void) => {
    useMenuNuiEvent('ArrowLeft', onKeyPress);
    useKeyPress('ArrowLeft', onKeyPress);
};

export const useEnter = (onKeyPress?: () => void) => {
    useMenuNuiEvent('Enter', onKeyPress);
    useKeyPress('Enter', onKeyPress);
};
