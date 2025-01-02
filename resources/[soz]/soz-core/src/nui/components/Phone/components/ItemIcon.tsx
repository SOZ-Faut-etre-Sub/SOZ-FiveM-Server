import React, { ReactNode } from 'react';

export interface ItemIconProps {
    icon: ReactNode;
    color: string;
}

export const ItemIcon: React.FC<ItemIconProps> = ({ icon, color }) => {
    return <div className={`text-white ${color} size-8 p-1 rounded-md`}>{icon}</div>;
};
