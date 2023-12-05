import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import style from './ShopContainerSlots.module.css';
import { ShopItem } from '../../types/shop';
import Draggable from '../Draggable/Draggable';
import { Droppable } from '../Droppable/Droppable';

type Props = {
    id: string;
    columns?: number;
    rows: number;
    items: (ShopItem & {id: number})[]
    action?: (action: string, item: ShopItem, shortcut: number) => void;
}

export const ShopContainerSlots: FunctionComponent<Props> = ({id, columns = 5, rows, items, action}) => {
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

    useEffect(() => {
        setDescription(null);
    }, [items]);


    return (
        <>
            <div
                className={style.Wrapper}
                style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gridTemplateRows: `repeat(${rows+1}, 1fr)`,
                }}
            >
                {[...Array((columns*(rows+1)))].map((_, i) => (
                    <Droppable key={i} id={`${id}_${i - 1}`} containerName={id} slot={i+1}>
                        <Draggable
                            id={`${id}_drag`}
                            containerName={id}
                            key={i}
                            item={items.find(it => (it.slot -1) === i)}
                            setInContext={createInContext(i)}
                            interactAction={action}
                            onItemHover={setDescription}
                            price={items.find(it => (it.slot -1) === i)?.price}
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
