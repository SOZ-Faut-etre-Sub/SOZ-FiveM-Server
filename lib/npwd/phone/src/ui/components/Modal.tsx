import React from 'react';
import { Button } from './Button';

interface ModalProps {
  visible?: boolean;
  handleClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, visible, handleClose }) => {

  const showHideClassName = visible ? 'classes.displayBlock' : 'classes.displayNone';

  return (
    <div className={showHideClassName}>
      <div >
        <Button onClick={handleClose} >
          {/*<CloseIcon />*/}
        </Button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
