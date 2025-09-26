import {
    increamentalPetMeta,
    incrementalPetResetMetadata,
    PetMetaLabel,
    PetResetMetaLabel,
    ServerJobPet,
} from '@public/shared/animal';
import { FunctionComponent, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { isOk, Result } from '../../../shared/result';
import { fetchNui } from '../../fetch';
import {
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuItemText,
    MenuSubTitle,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type JobPetSubMenuProps = {
    job: string;
};

export const JobPetsSubMenu: FunctionComponent<JobPetSubMenuProps> = ({ job }) => {
    const [pets, setPets] = useState<Array<ServerJobPet>>(null);

    if (pets === null) {
        return (
            <SubMenu id={`pet-management-${job}`}>
                <MenuTitle title={job} />
                <MenuContent subtitle={`Animal d'entreprise`}>
                    <MenuItemText
                        onSelected={() => {
                            fetchNui<string, Result<Array<ServerJobPet>, never>>(NuiEvent.AdminGetJobPets, job).then(
                                result => {
                                    if (isOk(result)) {
                                        if (result.ok) {
                                            setPets(result.ok);
                                        } else {
                                            setPets([]);
                                        }
                                    }
                                }
                            );
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
            <SubMenu id={`pet-management-${job}`}>
                <MenuTitle title={job} />
                <MenuContent subtitle={`Animal d'entreprise`}>
                    {!pets.length && <MenuItemText>Aucun animal de disponible</MenuItemText>}
                    {pets.length &&
                        pets.map(pet => (
                            <>
                                <MenuItemSubMenuLink id={`pet-management-${job}-${pet.id}`}>
                                    {pet.name || `Animal sans nom`}
                                </MenuItemSubMenuLink>
                            </>
                        ))}
                </MenuContent>
            </SubMenu>
            {pets.length && pets.map(pet => <SingleJobPetSubMenu pet={pet}></SingleJobPetSubMenu>)}
        </>
    );
};

export type SingleJobPetSubMenuProps = {
    pet: ServerJobPet;
};

export const SingleJobPetSubMenu: FunctionComponent<SingleJobPetSubMenuProps> = ({ pet }) => {
    return (
        <>
            <SubMenu id={`pet-management-${pet.job}-${pet.id}`}>
                <MenuTitle title={pet.job} />
                <MenuContent subtitle={`Animal d'entreprise - ${pet.name || `Animal sans nom`}`}>
                    {
                        <>
                            <MenuItemSelect
                                title={`État de l'animal : ${pet.dead ? `Mort` : `En vie`}`}
                                onConfirm={async (_, value) => {
                                    await fetchNui(NuiEvent.AdminSetJobPetSeath, {
                                        id: pet.id,
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
                                        await fetchNui(NuiEvent.AdminSetJobPetMeta, {
                                            id: pet.id,
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
                                    await fetchNui(NuiEvent.AdminResetJobPetResetMeta, pet.id);
                                }}
                            >
                                Reset des limitations par jours
                            </MenuItemButton>
                            {[...incrementalPetResetMetadata].map(resetMeta => (
                                <MenuItemButton
                                    key={resetMeta.toString()}
                                    onConfirm={async () => {
                                        await fetchNui(NuiEvent.AdminSetJobPetResetMeta, {
                                            id: pet.id,
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
                    }
                </MenuContent>
            </SubMenu>
        </>
    );
};
