import React from 'react';
import { Button } from './Button';

interface DialogFormProps {
  children: React.ReactNode;
  open: boolean;
  handleClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; // No idea what those types are
  onSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title: string;
  content: string;
}

const DialogForm: React.FC<DialogFormProps> = ({
  children,
  open,
  handleClose,
  onSubmit,
  title,
  content,
}) => {

  const showHideClassName = open ? 'classes.displayBlock' : 'classes.displayNone';

  return (
    <div className={showHideClassName}>
      <div >
        <div id="form-dialog-title">{title}</div>
        <div>
          <div>{content}</div>
          {children}
        </div>
        <div>
          <Button color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={onSubmit}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DialogForm;
