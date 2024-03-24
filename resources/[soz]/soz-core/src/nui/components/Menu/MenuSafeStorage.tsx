import { MenuSafeStorageAction, MenuSafeStorageData, MenuSafeStorageInput } from '@public/shared/bank';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type MenuSafeStorageProps = {
    data: MenuSafeStorageData;
};

const subtitles = {
    money: "Gestion de l'argent",
    marked_money: "Gestion de l'argent marqué",
};

export const MenuSafeStorage: FunctionComponent<MenuSafeStorageProps> = ({ data }) => {
    const banner = `https://cfx-nui-soz-core/public/images/banner/${data.banner}.webp`;
    return (
        <Menu type={MenuType.SafeStorage}>
            <MainMenu>
                <MenuTitle banner={banner}>Coffre d'argent</MenuTitle>
                <MenuContent>
                    {data.showMoney && (
                        <MenuItemSubMenuLink id="money" noChevron={true}>
                            <div className="pr-2 flex items-center justify-between">
                                <span>Argent</span>
                                <span className="text-green-500">${data.money}</span>
                            </div>
                        </MenuItemSubMenuLink>
                    )}
                    <MenuItemSubMenuLink id="marked_money" noChevron={true}>
                        <div className="pr-2 flex items-center justify-between">
                            <span>Argent Marqué</span>
                            <span className="text-red-500">
                                ${data.marked_money}
                                {data.maxMarked ? '/$' + data.maxMarked : ''}
                            </span>
                        </div>
                    </MenuItemSubMenuLink>
                </MenuContent>
            </MainMenu>
            {['money', 'marked_money'].map(type => (
                <SubMenu id={type} key={type}>
                    <MenuTitle banner={banner}>
                        {subtitles[type]} (${data[type]})
                    </MenuTitle>
                    <MenuContent>
                        {Object.values(MenuSafeStorageAction).map(action => (
                            <MenuItemButton
                                key={action}
                                onConfirm={async () => {
                                    const typedType = type as 'money' | 'marked_money';
                                    const input: MenuSafeStorageInput = { id: data.id, type: typedType, action };
                                    await fetchNui(NuiEvent.SafeStorageAction, input);
                                }}
                            >
                                {action}
                            </MenuItemButton>
                        ))}
                    </MenuContent>
                </SubMenu>
            ))}
        </Menu>
    );
};
