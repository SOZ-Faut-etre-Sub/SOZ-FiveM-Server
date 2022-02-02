import React from 'react';

export interface ItemIconProps {
  icon: JSX.Element;
  color: string;
}

export const ItemIcon: React.FC<ItemIconProps> = ({
  icon,
  color
}) => {

  return (
      <div className={`${color} h-8 w-8 p-1 rounded-md`}>{icon}</div>
  );
};
