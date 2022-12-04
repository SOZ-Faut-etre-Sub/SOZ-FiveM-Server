import { forwardRef, FunctionComponent, useCallback, useEffect, useState } from 'react';
import style from './ContainerSlots.module.css';
import { InventoryItem } from '../../types/inventory';
import Draggable from '../Draggable';
import { Droppable } from '../Droppable';
import { DndContext } from '@dnd-kit/core';

type Props = {
    columns?: number;
    rows: number;
    items: (InventoryItem & {id: number})[]
    setItems: (items: (InventoryItem & {id: number})[]) => void;
    useSlot0?: boolean
}

export const ContainerSlots: FunctionComponent<Props> = ({columns = 5, rows, items, setItems}) => {
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
            <DndContext onDragEnd={event => {
                // setItems(s => s.map((it, i) => {
                //         return { ...it, slot: Number(event.active.id) === i ? Number(event.over?.id) : item.slot }
                //     })
                //     // items.map((item, i) => {
                //     //     console.log({ ...item, slot: Number(event.active.id) === i ? Number(event.over?.id) : item.slot })
                //     //     return { ...item, slot: Number(event.active.id) === i ? Number(event.over?.id) : item.slot }
                //      )

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
