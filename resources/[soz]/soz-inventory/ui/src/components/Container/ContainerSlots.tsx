import { FunctionComponent, useCallback, useState } from 'react';
import style from './ContainerSlots.module.css';
import { InventoryItem } from '../../types/inventory';
import Draggable from '../Draggable/Draggable';
import { Droppable } from '../Droppable/Droppable';

type Props = {
    id: string;
    columns?: number;
    rows: number;
    money?: number;
    items: (InventoryItem & {id: number})[]
    action?: (action: string, item: InventoryItem, shortcut: number) => void;
}

export const ContainerSlots: FunctionComponent<Props> = ({id, columns = 5, rows, items, money, action}) => {
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
            <div
                className={style.Wrapper}
                style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gridTemplateRows: `repeat(${rows+1}, 1fr)`,
                }}
            >
                {money && (
                    <Draggable
                        id={`${null}_drag`}
                        containerName={"null"}
                        money={money}
                        interactAction={action}
                    />
                )}
                {[...Array((columns*(rows+1)) - (money ? 1 : 0))].map((_, i) => (
                    <Droppable key={i} id={`${id}_${i - 1}`} containerName={id}>
                        <Draggable
                            id={`${id}_drag`}
                            containerName={id}
                            key={i}
                            item={items.find(it => (it.slot -1) === i)}
                            setInContext={createInContext(i)}
                            interactAction={action}
                            onItemHover={setDescription}
                        />
                    </Droppable>
                ))}
            </div>
            {description && (
                <footer className={style.Description} dangerouslySetInnerHTML={{__html: description}} />
            )}
        </>
    )
}
