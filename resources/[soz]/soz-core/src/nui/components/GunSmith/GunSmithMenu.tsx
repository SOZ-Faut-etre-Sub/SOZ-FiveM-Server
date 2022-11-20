import React, { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { InventoryItem } from '../../../shared/item';
import { MenuType } from '../../../shared/nui/menu';
import { WeaponAttachment, WeaponComponentType } from '../../../shared/weapons/attachment';
import { WeaponsMenuData } from '../../../shared/weapons/weapon';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSelectOptionColor,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type MenuGunSmithStateProps = {
    data: WeaponsMenuData;
};

const MenuWeaponComponentSelect: FunctionComponent<{
    label: string;
    type: WeaponComponentType;
    weapon: InventoryItem;
    attachments: { slot: number; attachments: WeaponAttachment[] }[];
}> = ({ label, type, weapon, attachments }) => {
    const attachmentList = attachments.find(t => t.slot === weapon.slot).attachments.filter(a => a.type === type);

    return (
        <MenuItemSelect
            title={label}
            onConfirm={async (_, attachment) => {
                await fetchNui(NuiEvent.GunSmithApplyAttachment, {
                    slot: weapon.slot,
                    attachmentType: type,
                    attachment: attachment,
                });
            }}
            onChange={async (_, attachment) => {
                await fetchNui(NuiEvent.GunSmithPreviewAttachment, {
                    slot: weapon.slot,
                    attachment: attachment,
                });
            }}
        >
            <MenuItemSelectOption value={null}>Défaut</MenuItemSelectOption>

            {attachmentList.map((attachment, index) => (
                <MenuItemSelectOption key={index} value={attachment.component}>
                    {attachment.label}
                </MenuItemSelectOption>
            ))}
        </MenuItemSelect>
    );
};

export const MenuGunSmith: FunctionComponent<MenuGunSmithStateProps> = ({ data: { weapons, tints, attachments } }) => {
    const banner = 'https://nui-img/soz/menu_job_gunsmith';

    return (
        <Menu type={MenuType.GunSmith}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    {weapons.map((weapon, id) => (
                        <MenuItemSubMenuLink key={`gunsmith_${id}`} id={`gunsmith_${id}`}>
                            {weapon.metadata.label ? weapon.metadata.label + ` (${weapon.label})` : weapon.label}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </MainMenu>
            {weapons.map((weapon, id) => (
                <SubMenu id={`gunsmith_${id}`}>
                    <MenuTitle banner={banner}>Modifier l'arme</MenuTitle>
                    <MenuContent>
                        <MenuItemButton
                            key={id}
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.GunSmithRenameWeapon, { slot: weapon.slot });
                            }}
                        >
                            Renommer l'arme
                        </MenuItemButton>

                        <MenuItemSelect
                            title="Tint"
                            distance={5}
                            onConfirm={async (_, tint) => {
                                await fetchNui(NuiEvent.GunSmithApplyTint, { slot: weapon.slot, tint: tint });
                            }}
                            onChange={async (_, tint) => {
                                await fetchNui(NuiEvent.GunSmithPreviewTint, { slot: weapon.slot, tint: tint });
                            }}
                        >
                            {Object.values(tints.find(t => t.slot === weapon.slot).tints).map((tint, index) => (
                                <MenuItemSelectOptionColor
                                    key={index}
                                    color={tint.color}
                                    label={tint.label}
                                    value={index}
                                />
                            ))}
                        </MenuItemSelect>

                        <MenuWeaponComponentSelect
                            label="Chargeur"
                            type={WeaponComponentType.Clip}
                            weapon={weapon}
                            attachments={attachments}
                        />
                        <MenuWeaponComponentSelect
                            label="Torche"
                            type={WeaponComponentType.Flashlight}
                            weapon={weapon}
                            attachments={attachments}
                        />
                        <MenuWeaponComponentSelect
                            label="Silencieux"
                            type={WeaponComponentType.Suppressor}
                            weapon={weapon}
                            attachments={attachments}
                        />
                        <MenuWeaponComponentSelect
                            label="Viseur"
                            type={WeaponComponentType.Scope}
                            weapon={weapon}
                            attachments={attachments}
                        />
                        <MenuWeaponComponentSelect
                            label="Poignée"
                            type={WeaponComponentType.Grip}
                            weapon={weapon}
                            attachments={attachments}
                        />
                        <MenuWeaponComponentSelect
                            label="Apparence"
                            type={WeaponComponentType.Skin}
                            weapon={weapon}
                            attachments={attachments}
                        />
                    </MenuContent>
                </SubMenu>
            ))}
        </Menu>
    );
};
