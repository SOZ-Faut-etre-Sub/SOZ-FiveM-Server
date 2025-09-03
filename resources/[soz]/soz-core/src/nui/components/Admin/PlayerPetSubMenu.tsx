import {
    increamentalPetMeta,
    incrementalPetResetMetadata,
    PetMetaLabel,
    PetResetMetaLabel,
    ServerPet,
} from '@public/shared/animal';
import { FunctionComponent, useState } from 'react';

import { SozRole } from '../../../core/permissions';
import { AdminPlayer } from '../../../shared/admin/admin';
import { NuiEvent } from '../../../shared/event';
import { isOk, Result } from '../../../shared/result';
import { fetchNui } from '../../fetch';
import {
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemText,
    MenuSubTitle,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type PlayerPetSubMenuProps = {
    permission: SozRole;
    disabled: boolean;
    player: AdminPlayer;
};

export const PlayerPetSubMenu: FunctionComponent<PlayerPetSubMenuProps> = ({ permission, disabled, player }) => {
    const [pet, setPet] = useState<ServerPet>();

    if (!pet) {
        return (
            <SubMenu id={`player-pet-${player.citizenId}`}>
                <MenuTitle title={permission} />
                <MenuContent subtitle={`Animal de ${player.name}`}>
                    <MenuItemText
                        onSelected={() => {
                            fetchNui<string, Result<ServerPet, never>>(
                                NuiEvent.AdminGetPlayerPet,
                                player.citizenId
                            ).then(result => {
                                if (isOk(result)) {
                                    if (result.ok) {
                                        setPet(result.ok);
                                    } else {
                                        setPet({
                                            id: 0,
                                        } as ServerPet);
                                    }
                                }
                            });
                        }}
                    >
                        Chargement ...
                    </MenuItemText>
                </MenuContent>
            </SubMenu>
        );
    }

    return (
        <>
            <SubMenu id={`player-pet-${player.citizenId}`}>
                <MenuTitle title={permission} />
                <MenuContent subtitle={`Animal de ${player.name}`}>
                    {disabled && <MenuItemText>Pas de permission pour voir ce menu</MenuItemText>}
                    {!disabled && !pet.id && <MenuItemText>Aucun animal de disponible</MenuItemText>}
                    {!disabled && !!pet.id && (
                        <>
                            <MenuItemSelect
                                title={`État de l'animal : ${pet.dead ? `Mort` : `En vie`}`}
                                onConfirm={async (_, value) => {
                                    await fetchNui(NuiEvent.AdminSetPlayerPetSeath, {
                                        citizenId: player.citizenId,
                                        value: value,
                                    });
                                }}
                            >
                                <MenuItemSelectOption key={'revive'} value={false}>
                                    Soigner
                                </MenuItemSelectOption>
                                <MenuItemSelectOption key={'kill'} value={true}>
                                    Tuer
                                </MenuItemSelectOption>
                            </MenuItemSelect>
                            <MenuItemText>
                                <div className="pr-2 flex items-center justify-between">
                                    <span>A tenter de s'enfuire</span>
                                    <span>{pet.perDays.escape ? 'Oui' : 'Non'}</span>
                                </div>
                            </MenuItemText>
                            <MenuSubTitle>Personnalité</MenuSubTitle>
                            <MenuItemText>
                                <div className="pr-2 flex items-center justify-between">
                                    <span>Bonus</span>
                                    <span>{pet.trait_up}</span>
                                </div>
                            </MenuItemText>
                            <MenuItemText>
                                <div className="pr-2 flex items-center justify-between">
                                    <span>Malus</span>
                                    <span>{pet.trait_down}</span>
                                </div>
                            </MenuItemText>
                            <MenuSubTitle>Statistique</MenuSubTitle>
                            {[...increamentalPetMeta].map(meta => (
                                <MenuItemButton
                                    key={meta.toString()}
                                    onConfirm={async () => {
                                        await fetchNui(NuiEvent.AdminSetPlayerPetMeta, {
                                            citizenId: player.citizenId,
                                            meta: meta,
                                        });
                                    }}
                                >
                                    <div className="pr-2 flex items-center justify-between">
                                        <span>{PetMetaLabel[meta]}</span>
                                        <span>{pet[meta].toFixed(2)}</span>
                                    </div>
                                </MenuItemButton>
                            ))}
                            <MenuSubTitle>Limitation par jour</MenuSubTitle>
                            <MenuItemButton
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.AdminResetPlayerPetResetMeta, player.citizenId);
                                }}
                            >
                                Reset des limitations par jours
                            </MenuItemButton>
                            {[...incrementalPetResetMetadata].map(resetMeta => (
                                <MenuItemButton
                                    key={resetMeta.toString()}
                                    onConfirm={async () => {
                                        await fetchNui(NuiEvent.AdminSetPlayerPetResetMeta, {
                                            citizenId: player.citizenId,
                                            resetMeta: resetMeta,
                                        });
                                    }}
                                >
                                    <div className="pr-2 flex items-center justify-between">
                                        <span>{PetResetMetaLabel[resetMeta].label}</span>
                                        <span>
                                            {`${pet.perDays[resetMeta] >= PetResetMetaLabel[resetMeta].max ? `⚠️ ` : ``}${pet.perDays[resetMeta].toFixed(2)}`}
                                        </span>
                                    </div>
                                </MenuItemButton>
                            ))}
                        </>
                    )}
                </MenuContent>
            </SubMenu>
        </>
    );
};
