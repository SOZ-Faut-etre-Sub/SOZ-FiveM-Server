import React from 'react';
import { AppWrapperTypes } from '../interface/InterfaceUI';

export const AppWrapper: React.FC<AppWrapperTypes> = ({
  children,
  style,
  handleClickAway,
  ...props
}) => {
  return (
    <div
      {...props}
      style={{
        padding: 0,
        margin: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        minHeight: '720px',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
