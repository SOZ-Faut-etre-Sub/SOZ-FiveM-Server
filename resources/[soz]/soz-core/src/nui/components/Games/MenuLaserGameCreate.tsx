import { useGetPrice } from '@public/nui/hook/price';
import { LaserGamePrice, LaserGameType, LaserGameTypeEnum } from '@public/shared/games/laser';
import { TaxType } from '@public/shared/tax';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemText,
    MenuTitle,
} from '../Styleguide/Menu';

export const MenuLaserGameCreate: FunctionComponent = () => {
    const getPrice = useGetPrice();
    return (
        <Menu type={MenuType.LaserGameCreate}>
            <MainMenu>
                <MenuTitle title="Laser Game" />
                <MenuContent helpPanel={LaserGameHelpPanel}>
                    <MenuItemSelect
                        title={`Créer une partie`}
                        value={LaserGameTypeEnum.FFA}
                        onConfirm={(_, game_type) => {
                            fetchNui(NuiEvent.LaserGameCreate, game_type);
                        }}
                        description={
                            <div className="flex justify-between items-center">
                                <span>Prix de la partie</span>
                                <span className="mr-1">${getPrice(LaserGamePrice, TaxType.SERVICE)}</span>
                            </div>
                        }
                    >
                        {Object.entries(LaserGameType).map(([type, gameType]) => (
                            <MenuItemSelectOption value={type} key={`type_${type}`}>
                                {`${gameType.name}`}
                            </MenuItemSelectOption>
                        ))}
                    </MenuItemSelect>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};

const LaserGameHelpPanel = (
    <>
        {Object.entries(LaserGameType).map(([, gameType]) => (
            <MenuItemText>
                {gameType.name} : {gameType.descrption}
            </MenuItemText>
        ))}
    </>
);
