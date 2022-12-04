import { forwardRef, FunctionComponent, useCallback, useEffect, useState } from 'react';
import style from './ContainerSlots.module.css';
import { InventoryItem } from '../../types/inventory';
import Draggable from '../Draggable';
import { ReactSortable } from 'react-sortablejs';
import { SortableContainer } from '../InventoryItem';

type Props = {
    columns?: number;
    rows: number;
    items: (InventoryItem & {id: number})[]
    setItems?: any;
    useSlot0?: boolean
}

export const ContainerSlots: FunctionComponent<Props> = ({columns = 5, rows, items, setItems, useSlot0 = true}) => {
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

    const SortableContainer = forwardRef<HTMLDivElement, any>((props, ref) => {
        return <div
            ref={ref}
            data-inventory={props.id}
            className={style.Wrapper}
            style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: `repeat(${rows+1}, 1fr)`,
            }}
        >
            {props.children}
        </div>;
    });

    return (
        <>
            {/* @ts-ignore */}
            <ReactSortable
                forceFallback={true}
                tag={SortableContainer}
                // id={playerInventory.id}
                list={items}
                setList={setItems}
                sort={true}
                animation={150}
                // onEnd={transfertItem}
            >
                {[...Array(columns*(rows+1))].map((_, i) => (
                    <Draggable
                        key={i}
                        item={items.find(it => (useSlot0 ? it.slot -1 : it.slot) === i)}
                        setInContext={createInContext(i)}
                        onItemHover={setDescription}
                    />
                ))}
            </ReactSortable>
            {description && (
                <footer className={style.Description} dangerouslySetInnerHTML={{__html: description}} />
            )}
        </>
    )
}
