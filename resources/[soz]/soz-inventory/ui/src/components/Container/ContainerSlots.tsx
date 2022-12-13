import { FunctionComponent, useCallback, useState } from 'react';
import style from './ContainerSlots.module.css';
import { InventoryItem } from '../../types/inventory';
import Draggable from '../Draggable';
import { Droppable } from '../Droppable';
import { DndContext, rectIntersection } from '@dnd-kit/core';

type Props = {
    columns?: number;
    rows: number;
    money?: number;
    items: (InventoryItem & {id: number})[]
    setItems: (items: (InventoryItem & {id: number})[]) => void;
    action?: (action: string, item: InventoryItem) => void;
}

export const ContainerSlots: FunctionComponent<Props> = ({columns = 5, rows, items, action}) => {
    const [description, setDescription] = useState<string|null>('');
    const [inContextMenu, setInContextMenu] = useState<Record<string, boolean>>({});

    const createInContext = useCallback(
        (id: string | number) => {
            return (inContext: boolean) =>
                setInContextMenu((contextMenu) => {
                    return { ...contextMenu, [id]: inContext };
                });
        },
        [setInContextMenu]
    );

    return (
        <>
            <DndContext
                autoScroll={{
                    enabled: false
                }}
                collisionDetection={rectIntersection}
                onDragEnd={event => {
                    console.log(event);
            }
            }>
                <div
                    className={style.Wrapper}
                    style={{
                        gridTemplateColumns: `repeat(${columns}, 1fr)`,
                        gridTemplateRows: `repeat(${rows+1}, 1fr)`,
                    }}
                >
                    {[...Array(columns*(rows+1))].map((_, i) => (
                        <Droppable key={i} id={(i - 1).toString()}>
                            <Draggable
                                key={i}
                                item={items.find(it => (it.slot -1) === i)}
                                setInContext={createInContext(i)}
                                interactAction={action}
                                onItemHover={setDescription}
                            />
                        </Droppable>
                    ))}
                </div>
            </DndContext>
            {description && (
                <footer className={style.Description} dangerouslySetInnerHTML={{__html: description}} />
            )}
        </>
    )
}
