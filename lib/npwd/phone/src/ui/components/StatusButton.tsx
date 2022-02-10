import React from 'react';
import { Button } from './Button';

type StatusButtonStyleColor = 'success' | 'error' | 'warning' | 'info';

interface IStatusButtonStyleProps {
  color: StatusButtonStyleColor;
}


export const StatusButton: React.FC<
  Omit<any, 'color'> & { color: StatusButtonStyleColor }
> = ({ color = 'info', variant, className, ...props }) => {
  return (
    <Button
      variant={variant}
      {...props}
    />
  );
};
