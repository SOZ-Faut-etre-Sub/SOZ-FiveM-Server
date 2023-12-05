import React, { FunctionComponent, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { NuiEvent } from '../../../shared/event';
import { InventoryItem } from '../../../shared/item';
import { MenuType } from '../../../shared/nui/menu';
import { WEAPON_CUSTOM_PRICE, WeaponAttachment, WeaponComponentType } from '../../../shared/weapons/attachment';
import { WeaponTintColor, WeaponTintColorChoiceItem } from '../../../shared/weapons/tint';
import { WeaponConfiguration, WeaponsMenuData } from '../../../shared/weapons/weapon';
import { fetchNui } from '../../fetch';
import { RootState } from '../../store';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
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

const GunSmithWeaponSubMenu: FunctionComponent<{
    submenu_id: number;
    banner: string;
    weapon: InventoryItem;
    tint: Record<WeaponTintColor, WeaponTintColorChoiceItem>;
    attachments: WeaponAttachment[];
}> = ({ submenu_id, banner, weapon, tint, attachments }) => {
    const [configuration, setConfiguration] = useState<WeaponConfiguration>({});

    const price = useMemo(() => {
        let price = 0;

        if (configuration.attachments) {
            price += Object.values(configuration.attachments).reduce((acc, attachment) => {
                if (attachment && !Object.values(weapon.metadata.attachments || []).includes(attachment)) {
                    return acc + WEAPON_CUSTOM_PRICE.attachment;
                }
                return acc;
            }, 0);
        }

        if (configuration.label) {
            price += WEAPON_CUSTOM_PRICE.label;
        }

        if (configuration.repair) {
            price +=
                WEAPON_CUSTOM_PRICE.repair *
                Math.floor(100 - ((weapon.metadata.health / weapon.metadata.maxHealth) * 100 || 0));
        }

        if (configuration.tint && configuration.tint !== weapon.metadata.tint) {
            price += WEAPON_CUSTOM_PRICE.tint;
        }

        return price;
    }, [configuration]);

    return (
        <SubMenu id={`gunsmith_${submenu_id}`}>
            <MenuTitle banner={banner}>
                Modifier l'arme {configuration.label ? `(${configuration.label})` : ''}
            </MenuTitle>
            <MenuContent>
                <MenuItemCheckbox
                    onChange={label => {
                        setConfiguration(s => ({ ...s, label }));
                    }}
                >
                    Renommer l'arme
                </MenuItemCheckbox>

                <MenuItemCheckbox
                    onChange={repair => {
                        setConfiguration(s => ({ ...s, repair }));
                    }}
                >
                    Réparer l'arme ({((weapon.metadata.health / weapon.metadata.maxHealth) * 100 || 0).toFixed(0)}%)
                </MenuItemCheckbox>

                <MenuItemSelect
                    title="Tint"
                    distance={5}
                    onChange={async (_, tint) => {
                        setConfiguration(s => ({ ...s, tint: Number(tint) }));
                        fetchNui(NuiEvent.GunSmithPreviewTint, { slot: weapon.slot, tint: Number(tint) });
                    }}
                    value={(weapon.metadata.tint ?? 0).toString()}
                >
                    {Object.entries(tint).map(([key, tint]) => (
                        <MenuItemSelectOptionColor key={key} color={tint.color} label={tint.label} value={key} />
                    ))}
                </MenuItemSelect>

                <MenuWeaponComponentSelect
                    label="Chargeur"
                    type={WeaponComponentType.Clip}
                    weapon={weapon}
                    attachments={attachments}
                    onUpdate={setConfiguration}
                />
                <MenuWeaponComponentSelect
                    label="Torche"
                    type={WeaponComponentType.Flashlight}
                    weapon={weapon}
                    attachments={attachments}
                    onUpdate={setConfiguration}
                />
                <MenuWeaponComponentSelect
                    label="Silencieux"
                    type={WeaponComponentType.Suppressor}
                    weapon={weapon}
                    attachments={attachments}
                    onUpdate={setConfiguration}
                />
                <MenuWeaponComponentSelect
                    label="Viseur"
                    type={WeaponComponentType.Scope}
                    weapon={weapon}
                    attachments={attachments}
                    onUpdate={setConfiguration}
                />
                <MenuWeaponComponentSelect
                    label="Poignée"
                    type={WeaponComponentType.Grip}
                    weapon={weapon}
                    attachments={attachments}
                    onUpdate={setConfiguration}
                />
                <MenuWeaponComponentSelect
                    label="Apparence Principale"
                    type={WeaponComponentType.PrimarySkin}
                    weapon={weapon}
                    attachments={attachments}
                    onUpdate={setConfiguration}
                />
                <MenuWeaponComponentSelect
                    label="Apparence Secondaire"
                    type={WeaponComponentType.SecondarySkin}
                    weapon={weapon}
                    attachments={attachments}
                    onUpdate={setConfiguration}
                />

                <MenuItemButton
                    className="border-t border-white/50"
                    onConfirm={async () => {
                        fetchNui(NuiEvent.GunSmithApplyConfiguration, {
                            slot: weapon.slot,
                            ...configuration,
                        });
                    }}
                >
                    <div className="flex w-full justify-between items-center">
                        <span>Confirmer les changements</span>
                        <span>${price.toFixed(0)}</span>
                    </div>
                </MenuItemButton>
            </MenuContent>
        </SubMenu>
    );
};

const MenuWeaponComponentSelect: FunctionComponent<{
    label: string;
    type: WeaponComponentType;
    weapon: InventoryItem;
    attachments: WeaponAttachment[];
    onUpdate?: (s) => void;
}> = ({ onUpdate, label, type, weapon, attachments }) => {
    const options = attachments.filter(a => a.type === type);
    const player = useSelector((state: RootState) => state.player);

    return (
        <MenuItemSelect
            title={label}
            onChange={async (_, attachment) => {
                fetchNui(NuiEvent.GunSmithPreviewAttachment, {
                    slot: weapon.slot,
                    attachment: attachment,
                    attachmentList: options,
                });
                onUpdate?.(s => ({ ...s, attachments: { ...s.attachments, [type]: attachment } }));
            }}
            value={weapon.metadata?.attachments?.[type] ?? 0}
            disabled={
                options.length === 0 ||
                (type === WeaponComponentType.Suppressor && player.role !== 'admin' && player.role !== 'staff')
            }
        >
            <MenuItemSelectOption value={null}>Défaut</MenuItemSelectOption>

            {options.map((attachment, index) => (
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
                <GunSmithWeaponSubMenu
                    key={`gunsmith_${id}`}
                    submenu_id={id}
                    banner={banner}
                    weapon={weapon}
                    tint={tints.find(t => t.slot === weapon.slot).tints}
                    attachments={attachments?.find(t => t.slot === weapon.slot)?.attachments || []}
                />
            ))}
        </Menu>
    );
};
