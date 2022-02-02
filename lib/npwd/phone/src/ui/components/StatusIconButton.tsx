import React from 'react';

type StatusButtonStyleColor = 'success' | 'error' | 'warning' | 'info';

interface IStatusButtonStyleProps {
  color: StatusButtonStyleColor;
}

export const StatusIconButton = ({
  color = 'info',
  size,
  className,
  ...props
}: Omit<any, 'color'> & { color: StatusButtonStyleColor }) => {
  return <div {...props} />;
};
