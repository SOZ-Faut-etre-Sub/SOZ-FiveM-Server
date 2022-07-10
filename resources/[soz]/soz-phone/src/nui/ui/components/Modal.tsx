import React from 'react';

import { Button } from './Button';

interface ModalProps {
    handleClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, handleClose }) => {
    return (
        <div className={'showHideClassName'}>
            <div>
                <Button onClick={handleClose}></Button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
