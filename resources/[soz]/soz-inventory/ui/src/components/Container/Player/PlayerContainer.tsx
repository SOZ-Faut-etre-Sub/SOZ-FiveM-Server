import { useEffect, useState } from 'react';
import { debugPlayerInventory } from '../../../test/debug';
import { SozInventoryModel } from '../../../types/inventory';
import { ContainerWrapper } from '../ContainerWrapper';
import style from './PlayerContainer.module.css';
import { ContainerSlots } from '../ContainerSlots';
import playerBanner from '/banner/player.jpg'

export const PlayerContainer = () => {
    const [display, setDisplay] = useState<boolean>(true);

    const [playerMoney, setPlayerMoney] = useState<number>(debugPlayerInventory.playerMoney);
    const [playerInventory, setPlayerInventory] = useState<SozInventoryModel | null>();

    useEffect(() => {
        setPlayerInventory(debugPlayerInventory.playerInventory);
    }, [])

    if (!playerInventory) {
        return null;
    }

    return (
        <div className={style.Wrapper}>
            <ContainerWrapper
                display={true}
                banner={playerBanner}
                weight={playerInventory.weight}
                maxWeight={playerInventory.maxWeight}
            >
                <ContainerSlots
                    rows={Math.ceil(playerInventory.items.length / 5)}
                    items={playerInventory.items.map((item, i) => ({...item, id: i}))}
                    setItems={(s) => {
                        setPlayerInventory({...playerInventory, items: s})
                    }}
                />
            </ContainerWrapper>
        </div>
    )
}
