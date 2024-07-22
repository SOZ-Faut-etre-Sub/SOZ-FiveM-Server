import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    MouseSensor,
    rectIntersection,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { FunctionComponent, useState } from 'react';
import { createPortal } from 'react-dom';

import { NuiEvent } from '../../../shared/event/nui';
import { InventoryCard } from '../../../shared/inventory';
import { fetchNui } from '../../fetch';
import { useKeyPress } from '../../hook/control';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { InventoryDiv } from './Inventory';
import { getItemSlotClassnames } from './ItemSlot';

export const WalletApp: FunctionComponent = () => {
    const [cards, setCards] = useState<InventoryCard[]>(null);
    const [currentCard, setCurrentCard] = useState<InventoryCard>(null);
    const open = cards !== null;

    useNuiEvent('inventory', 'OpenWallet', ({ cards }) => {
        setCards(cards);
    });

    useNuiEvent('inventory', 'CloseWallet', () => {
        setCards(null);
    });

    useNuiFocus(open, open, false);

    useKeyPress('Escape', () => {
        setCards(null);
    });

    useKeyPress('Backspace', () => {
        fetchNui(NuiEvent.InventoryGoBackPlayerInventory);
        setCards(null);
    });

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });

    const sensors = useSensors(mouseSensor);

    if (!open) {
        return null;
    }

    return (
        <DndContext
            sensors={sensors}
            autoScroll={{
                enabled: false,
            }}
            collisionDetection={rectIntersection}
            onDragEnd={(event: DragEndEvent) => {
                if (!event.active.data.current) {
                    return;
                }

                const card = event.active.data.current as InventoryCard;

                fetchNui(NuiEvent.InventoryActionShowCard, {
                    card,
                    mode: 'screen',
                });
            }}
        >
            <div className="absolute h-full w-full">
                <main className="m-8 h-[45vh] w-[36vh] xl:ml-[94vh]">
                    <InventoryDiv banner="/public/images/inventory/banner/wallet_banner.webp">
                        {cards.map((card, index) => (
                            <CardItem key={index} index={index} card={card} setCurrentCard={setCurrentCard} />
                        ))}
                    </InventoryDiv>
                    {currentCard && (
                        <div className="p-2 mt-2 rounded text-gray-100 bg-black/60 w-full">
                            <div className="flex justify-between align-items-center w-full">
                                <strong>{currentCard.label}</strong>
                                <div>
                                    {currentCard.iban && (
                                        <span>[ IBAN : {currentCard.iban.replace(/.{4}/g, '$& ')}]</span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-2 flex justify-between align-items-center w-full">
                                <span>{currentCard.description}</span>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </DndContext>
    );
};

const CardItem: FunctionComponent<{
    card: InventoryCard;
    index: number;
    setCurrentCard: (card: InventoryCard) => void;
}> = ({ card, index, setCurrentCard }) => {
    const { setNodeRef: setDroppableNodeRef } = useDroppable({
        id: `droppable_card_${index}`,
        data: card,
    });
    const [contextData, setContextData] = useState({ visible: false, posX: 0, posY: 0 });

    const {
        attributes,
        listeners,
        setNodeRef: setDraggableNodeRef,
        isDragging,
    } = useDraggable({
        id: `draggable_card_${index}`,
        data: card,
    });

    let imgSrc = null;

    if (card.type === 'health') {
        imgSrc = `https://cfx-nui-soz-core/public/images/inventory/icon/health.webp`;
    }

    if (card.type === 'license') {
        imgSrc = `https://cfx-nui-soz-core/public/images/inventory/icon/license.webp`;
    }

    if (card.type === 'identity') {
        imgSrc = `https://cfx-nui-soz-core/public/images/inventory/icon/identity.webp`;
    }

    if (card.type === 'bank') {
        imgSrc = `https://cfx-nui-soz-core/public/images/inventory/icon/bank.webp`;
    }

    return (
        <>
            <div
                onContextMenu={event => {
                    setContextData({
                        visible: true,
                        posX: event.clientX,
                        posY: event.clientY,
                    });
                }}
                ref={setDroppableNodeRef}
                className={getItemSlotClassnames(false)}
                onMouseEnter={() => setCurrentCard(card)}
                onMouseLeave={() => {
                    setCurrentCard(null);
                    setContextData({ visible: false, posX: 0, posY: 0 });
                }}
            >
                <div ref={setDraggableNodeRef} {...listeners} {...attributes}>
                    <div className="relative">
                        <img className="h-full w-full" src={imgSrc} alt={card.type} />
                    </div>
                </div>
                <div
                    className="fixed rounded p-2 h-auto w-fit flex flex-col justify-center items-center bg-black/80"
                    style={{
                        left: contextData.posX,
                        top: contextData.posY,
                        zIndex: 1000,
                        display: contextData.visible ? 'block' : 'none',
                    }}
                >
                    <div
                        onClick={() =>
                            fetchNui(NuiEvent.InventoryActionShowCard, {
                                card: card,
                                mode: 'closest',
                            })
                        }
                        className="p-1 rounded hover:bg-white/15"
                    >
                        Montrer
                    </div>
                    <div
                        onClick={() =>
                            fetchNui(NuiEvent.InventoryActionLookCard, {
                                card: card,
                            })
                        }
                        className="p-1 rounded hover:bg-white/15"
                    >
                        Regarder
                    </div>
                </div>
            </div>
            {createPortal(
                <DragOverlay dropAnimation={null}>
                    {isDragging && <img className="absolute z-50" src={imgSrc} alt={card.type} />}
                </DragOverlay>,
                document.body
            )}
        </>
    );
};
