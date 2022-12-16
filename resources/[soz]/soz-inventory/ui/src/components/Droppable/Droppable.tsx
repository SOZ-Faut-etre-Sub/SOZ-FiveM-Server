import React, { FunctionComponent, PropsWithChildren } from 'react';
import { useDroppable } from '@dnd-kit/core';
import style from './Droppable.module.css';
import { clsx } from 'clsx';

export const Droppable: FunctionComponent<PropsWithChildren<{ id: string; slot: number; containerName: string }>> = ({ id, slot, containerName, children }) => {
    const { isOver, setNodeRef } = useDroppable({
        id, data: { container: containerName, slot },
    });

    return (
        <div ref={setNodeRef} className={clsx(style.Card, {
            [style.CardHover]: isOver,
        })}>
            {children}
        </div>
    );
};
