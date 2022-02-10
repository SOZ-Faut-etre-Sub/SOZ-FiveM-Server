import React from 'react';

export const Button: React.FC<any> = ({ ...props }) => (
  <button aria-label="button" {...props}>
    {props.children}
  </button>
);
