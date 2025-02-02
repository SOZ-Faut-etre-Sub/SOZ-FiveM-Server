import { isImage } from './image';
import { isPosition } from './position';

export const formatMessage = (message?: string): string => {
    if (isImage(message)) {
        return 'Vous avez reçu une image';
    }

    if (isPosition(message)) {
        return 'Vous avez reçu une position';
    }

    return message;
};
