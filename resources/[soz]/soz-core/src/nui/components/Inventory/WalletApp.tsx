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
import { GlassMorphismContainer } from '../Styleguide/GlassMorphismContainer';
import { InventoryDiv } from './Inventory';
import { getItemSlotClassnames } from './ItemSlot';
import { useInventorySize, useItemSize } from './size';

export const WalletApp: FunctionComponent = () => {
    const [cards, setCards] = useState<InventoryCard[]>(null);
    const [currentCard, setCurrentCard] = useState<InventoryCard>(null);
    const open = cards !== null;
    const inventorySize = useInventorySize(6);

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

    useKeyPress('F2', () => {
        if (open) {
            fetchNui(NuiEvent.InventoryGoBackPlayerInventory);
            setCards(null);
        }
    });

    useKeyPress('Backspace', () => {
        if (open) {
            fetchNui(NuiEvent.InventoryGoBackPlayerInventory);
            setCards(null);
        }
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
            <div className="absolute h-full w-full font-prompt">
                <main className="m-8 h-[45vh] w-[370px] wide:ml-[94vh]">
                    <InventoryDiv
                        title="Cartes"
                        description={
                            currentCard ? (
                                <div className="mt-2 w-[370px]">
                                    <GlassMorphismContainer duration="duration-0" borderClassName="rounded-xl">
                                        <div className="p-2 rounded text-gray-100">
                                            <div className="flex justify-between align-items-center w-full">
                                                <h2 className="font-semibold">{currentCard.label}</h2>
                                                <div>
                                                    {currentCard.iban && (
                                                        <span>
                                                            [ IBAN : {currentCard.iban.replace(/.{4}/g, '$& ')}]
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-2 flex justify-between align-items-center w-full">
                                                <span>{currentCard.description}</span>
                                            </div>
                                        </div>
                                    </GlassMorphismContainer>
                                </div>
                            ) : null
                        }
                    >
                        <div
                            className="grid grid-cols-5 w-full max-h-full"
                            style={{
                                gap: `${inventorySize.gapSize}px`,
                                width: `${inventorySize.width}px`,
                            }}
                        >
                            {cards.map((card, index) => (
                                <CardItem key={index} index={index} card={card} setCurrentCard={setCurrentCard} />
                            ))}
                        </div>
                    </InventoryDiv>
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
    const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
        id: `droppable_card_${index}`,
        data: card,
    });
    const [contextData, setContextData] = useState({ visible: false, posX: 0, posY: 0 });
    const itemSize = useItemSize();

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
                className="aspect-square"
                style={{
                    width: `${itemSize}px`,
                    height: `${itemSize}px`,
                }}
                onContextMenu={event => {
                    setContextData({
                        visible: true,
                        posX: event.clientX,
                        posY: event.clientY,
                    });
                }}
                ref={setDroppableNodeRef}
                onMouseEnter={() => setCurrentCard(card)}
                onMouseLeave={() => {
                    setCurrentCard(null);
                    setContextData({ visible: false, posX: 0, posY: 0 });
                }}
            >
                <GlassMorphismContainer
                    duration="duration-0"
                    borderClassName="rounded-xl aspect-square"
                    showBorderOnHover={!isOver}
                >
                    <div ref={setDroppableNodeRef} className={getItemSlotClassnames(false)}>
                        <div ref={setDraggableNodeRef} {...listeners} {...attributes}>
                            <div className="relative">
                                <img className="h-full w-full" src={imgSrc} alt={card.type} />
                            </div>
                        </div>
                    </div>
                </GlassMorphismContainer>
                <div
                    className="fixed text-white rounded p-2 h-auto w-fit flex flex-col justify-center items-center bg-black/80"
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
                {createPortal(
                    <DragOverlay dropAnimation={null}>
                        {isDragging && <img className="absolute z-50" src={imgSrc} alt={card.type} />}
                    </DragOverlay>,
                    document.body
                )}
            </div>
        </>
    );
};
