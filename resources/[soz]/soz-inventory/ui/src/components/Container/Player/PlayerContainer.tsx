import { useCallback, useEffect, useRef, useState } from 'react';
import { debugPlayerInventory } from '../../../test/debug';
import { InventoryItem, SozInventoryModel } from '../../../types/inventory';
import { ContainerWrapper } from '../ContainerWrapper';
import style from './PlayerContainer.module.css';
import { ContainerSlots } from '../ContainerSlots';
import playerBanner from '/banner/player.jpg'
import { closeNUI } from '../../../hooks/nui';
import { clsx } from 'clsx';

export const PlayerContainer = () => {
    const [display, setDisplay] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [playerMoney, setPlayerMoney] = useState<number>(debugPlayerInventory.playerMoney);
    const [playerInventory, setPlayerInventory] = useState<SozInventoryModel | null>();

    const interactAction = useCallback(
        (action: string, item: InventoryItem) => {
            fetch(`https://soz-inventory/player/${action}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(item),
            }).then(() => {
                setDisplay(false);
            });
        },
        [setDisplay]
    );

    const onClickReceived = useCallback(
        (event: MouseEvent) => {
            if (display && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                event.preventDefault();
                closeNUI(() => setDisplay(false));
            }
        },
        [menuRef, display, setDisplay]
    );

    const onMessageReceived = useCallback(
        (event: MessageEvent) => {
            if (event.data.action === "openPlayerInventory") {
                if (event.data.playerInventory === undefined) return;

                try {
                    let items = event.data.playerInventory.items;
                    if (typeof items === "object") items = Object.values(items);

                    setPlayerInventory(event.data.playerInventory);
                    setPlayerMoney(event.data.playerMoney);

                    setDisplay(true);
                } catch (e: any) {
                    console.error(e, event.data.playerInventory, event.data.playerMoney);
                    closeNUI(() => setDisplay(false));
                }
            }
        },
        [setDisplay, setPlayerMoney, setPlayerInventory]
    );

    const onKeyDownReceived = useCallback(
        (event: KeyboardEvent) => {
            if (display && !event.repeat && (event.key === "Escape" || event.key === "F2")) {
                closeNUI(() => setDisplay(false));
            }
        },
        [display, setDisplay]
    );


    useEffect(() => {
        window.addEventListener("contextmenu", onClickReceived);
        window.addEventListener("message", onMessageReceived);
        window.addEventListener("keydown", onKeyDownReceived);

        // onMessageReceived({ data: { ...debugPlayerInventory } } as MessageEvent);

        return () => {
            window.removeEventListener("contextmenu", onClickReceived);
            window.removeEventListener("message", onMessageReceived);
            window.removeEventListener("keydown", onKeyDownReceived);
        };
    }, [onClickReceived, onMessageReceived, onKeyDownReceived]);

    if (!playerInventory) {
        return null;
    }

    return (
        <div className={clsx(style.Wrapper, {
            [style.Show]: display,
            [style.Hide]: !display,
        })}>
            <ContainerWrapper
                display={true}
                banner={playerBanner}
                weight={playerInventory.weight}
                maxWeight={playerInventory.maxWeight}
            >
                <ContainerSlots
                    id="player"
                    rows={Math.ceil(playerInventory.items.length / 5)}
                    money={playerMoney}
                    items={playerInventory.items.map((item, i) => ({...item, id: i}))}
                    setItems={(s) => {
                        setPlayerInventory({...playerInventory, items: s})
                    }}
                    action={interactAction}
                />
            </ContainerWrapper>
        </div>
    )
}
