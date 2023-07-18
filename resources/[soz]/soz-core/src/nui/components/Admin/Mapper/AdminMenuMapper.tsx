import { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../../shared/event';
import { Property } from '../../../../shared/housing/housing';
import { AdminMapperMenuData } from '../../../../shared/housing/menu';
import { JobType } from '../../../../shared/job';
import { MenuType } from '../../../../shared/nui/menu';
import { Zone } from '../../../../shared/polyzone/box.zone';
import { fetchNui } from '../../../fetch';
import { useJobs } from '../../../hook/job';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../../Styleguide/Menu';

export type AdminMapperMenuStateProps = {
    data?: AdminMapperMenuData;
};

export const AdminMenuMapper: FunctionComponent<AdminMapperMenuStateProps> = ({ data }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [properties, setProperties] = useState<AdminMapperMenuData['properties']>([]);
    const [selectedObject, setSelectedObject] = useState<string>('soz_prop_bb_bin');
    const jobs = useJobs();
    const [job, setJob] = useState<JobType | null>(null);
    const [event, setEvent] = useState<string | null>(null);

    useEffect(() => {
        setProperties(data?.properties || []);
    }, [data]);

    if (!data) {
        return null;
    }

    const sortedProperties = properties.sort((a, b) => a.identifier.localeCompare(b.identifier));

    return (
        <Menu type={MenuType.AdminMapperMenu}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_mapper">Menu mapper</MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id="objects">🚏 Gestion des objets</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="properties">🏠 Gestion des propriétés</MenuItemSubMenuLink>
                    <MenuItemCheckbox
                        checked={data.showInterior}
                        onChange={value => {
                            fetchNui(NuiEvent.AdminMenuMapperSetShowInterior, { value: value });
                        }}
                    >
                        🚧 Voir les informations de l'interieur
                    </MenuItemCheckbox>
                </MenuContent>
            </MainMenu>
            <SubMenu id="objects">
                <MenuTitle banner="https://nui-img/soz/menu_mapper">Un poteau, une borne, des poubelles !</MenuTitle>
                <MenuContent>
                    <MenuItemSelect title={'🚏 Objet séléctionné'} onChange={(i, value) => setSelectedObject(value)}>
                        <MenuItemSelectOption value="soz_prop_bb_bin">Poubelle</MenuItemSelectOption>
                        <MenuItemSelectOption value="soz_prop_elec01">Borne civile</MenuItemSelectOption>
                        <MenuItemSelectOption value="soz_prop_elec02">Borne entreprise</MenuItemSelectOption>
                        <MenuItemSelectOption value="upwpile">Onduleur</MenuItemSelectOption>
                        <MenuItemSelectOption value="soz_atm_entreprise">ATM entreprise</MenuItemSelectOption>
                    </MenuItemSelect>
                    <MenuItemSelect
                        title="Metier lié"
                        description="Lier la prop à une entreprise (uniquement borne entreprise)"
                        value={null}
                        onChange={(i, value) => {
                            setJob(value);
                        }}
                    >
                        <MenuItemSelectOption value={null}>Aucun</MenuItemSelectOption>
                        {jobs.map(job => (
                            <MenuItemSelectOption value={job.id} key={'job_' + job.id}>
                                {job.label}
                            </MenuItemSelectOption>
                        ))}
                    </MenuItemSelect>
                    <MenuItemSelect
                        title="Evenement lié"
                        description="Permet de filtrer les objets a afficher"
                        value={null}
                        onChange={(i, value) => {
                            setEvent(value);
                        }}
                    >
                        <MenuItemSelectOption value={null}>Tous le temps</MenuItemSelectOption>
                        <MenuItemSelectOption value="xmas">Noel</MenuItemSelectOption>
                    </MenuItemSelect>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.AdminMenuMapperAddObject, {
                                object: selectedObject,
                                event: event,
                                job: job,
                            });
                        }}
                    >
                        Ajouter l'objet
                    </MenuItemButton>
                </MenuContent>
            </SubMenu>
            <SubMenu id="properties">
                <MenuTitle banner="https://nui-img/soz/menu_mapper">Gestion des propriétés</MenuTitle>
                <MenuContent>
                    <MenuItemCheckbox
                        onChange={value => {
                            fetchNui(NuiEvent.AdminMenuMapperShowAllProperty, { show: value });
                        }}
                    >
                        Afficher tous les bâtiments
                    </MenuItemCheckbox>
                    <MenuItemSelect
                        title="🏢 Bâtiments"
                        onConfirm={(index, identifier) => {
                            navigate(`/${MenuType.AdminMapperMenu}/property_${identifier}`, {
                                state: {
                                    ...(location.state || {}),
                                    activeIndex: 0,
                                },
                            });
                        }}
                    >
                        {sortedProperties.map(property => (
                            <MenuItemSelectOption
                                key={property.id}
                                helper={property.identifier}
                                value={property.identifier}
                            >
                                {property.identifier}
                            </MenuItemSelectOption>
                        ))}
                    </MenuItemSelect>
                    <MenuItemButton
                        onConfirm={async () => {
                            const properties = await fetchNui<any, Property[]>(NuiEvent.AdminMenuMapperAddProperty, {});

                            setProperties(properties);
                        }}
                    >
                        ➕ Ajouter un bâtiment
                    </MenuItemButton>
                </MenuContent>
            </SubMenu>
            <SubMenu id="tools">
                <MenuTitle banner="https://nui-img/soz/menu_mapper">Menu pour les mappeurs</MenuTitle>
                <MenuContent></MenuContent>
            </SubMenu>
            {sortedProperties.map(property => (
                <Fragment key={property.id}>
                    <SubMenu id={`property_${property.identifier}`}>
                        <MenuTitle banner="https://nui-img/soz/menu_mapper">Batiment : {property.identifier}</MenuTitle>
                        <MenuContent>
                            <ZoneMenuSelect
                                title="🚪 Zone entrée"
                                type="entry"
                                zone={property.entryZone}
                                propertyId={property.id}
                                setProperties={setProperties}
                            />
                            <ZoneMenuSelect
                                title="🅿️ Zone garage"
                                type="garage"
                                zone={property.garageZone}
                                propertyId={property.id}
                                setProperties={setProperties}
                            />
                            {property.apartments.map(apartment => (
                                <MenuItemSubMenuLink key={apartment.id} id={`apartment_${apartment.identifier}`}>
                                    Appartement: {apartment.label}
                                </MenuItemSubMenuLink>
                            ))}
                            <MenuItemButton
                                onConfirm={async () => {
                                    const properties = await fetchNui<any, Property[]>(
                                        NuiEvent.AdminMenuMapperAddApartment,
                                        { propertyId: property.id }
                                    );

                                    setProperties(properties);
                                }}
                            >
                                ➕ Ajouter un appartement
                            </MenuItemButton>
                            <MenuItemButton
                                onConfirm={async () => {
                                    const properties = await fetchNui<any, Property[]>(
                                        NuiEvent.AdminMenuMapperDeleteProperty,
                                        {
                                            propertyId: property.id,
                                        }
                                    );

                                    setProperties(properties);
                                }}
                            >
                                ❌ Supprimer
                            </MenuItemButton>
                        </MenuContent>
                    </SubMenu>
                    {property.apartments.map(apartment => (
                        <SubMenu key={apartment.id} id={`apartment_${apartment.identifier}`}>
                            <MenuTitle banner="https://nui-img/soz/menu_mapper">{apartment.label}</MenuTitle>
                            <MenuContent>
                                <MenuItemButton
                                    onConfirm={async () => {
                                        const properties = await fetchNui<any, Property[]>(
                                            NuiEvent.AdminMenuMapperSetApartmentIdentifier,
                                            {
                                                propertyId: property.id,
                                                apartmentId: apartment.id,
                                            }
                                        );

                                        setProperties(properties);
                                    }}
                                >
                                    <div className="flex justify-between align-items-center">
                                        <span>{apartment.identifier}</span>
                                        <span>Changer l'identifiant</span>
                                    </div>
                                </MenuItemButton>
                                <MenuItemButton
                                    onConfirm={async () => {
                                        const properties = await fetchNui<any, Property[]>(
                                            NuiEvent.AdminMenuMapperSetApartmentName,
                                            {
                                                propertyId: property.id,
                                                apartmentId: apartment.id,
                                            }
                                        );

                                        setProperties(properties);
                                    }}
                                >
                                    <div className="flex justify-between align-items-center">
                                        <span>{apartment.label}</span>
                                        <span>Changer le nom</span>
                                    </div>
                                </MenuItemButton>
                                <MenuItemButton
                                    onConfirm={async () => {
                                        const properties = await fetchNui<any, Property[]>(
                                            NuiEvent.AdminMenuMapperSetApartmentPrice,
                                            {
                                                propertyId: property.id,
                                                apartmentId: apartment.id,
                                                price: null,
                                            }
                                        );

                                        setProperties(properties);
                                    }}
                                >
                                    <div className="flex justify-between">
                                        <span>💲 Prix</span>
                                        <span>${apartment.price?.toLocaleString()}</span>
                                    </div>
                                </MenuItemButton>
                                <MenuItemSelect
                                    onConfirm={async (i, value) => {
                                        if (value === 'teleport') {
                                            fetchNui(NuiEvent.AdminMenuMapperTeleportToInsideCoords, {
                                                coords: apartment.position,
                                            });
                                        }

                                        if (value === 'update') {
                                            const properties = await fetchNui<any, Property[]>(
                                                NuiEvent.AdminMenuMapperSetInsideCoords,
                                                {
                                                    apartmentId: apartment.id,
                                                }
                                            );

                                            setProperties(properties);
                                        }
                                    }}
                                    title={
                                        <span className={apartment.position ? '' : 'text-red-500'}>
                                            🌀 Zone d'apparition
                                        </span>
                                    }
                                >
                                    <MenuItemSelectOption value="teleport">Téléporter</MenuItemSelectOption>
                                    <MenuItemSelectOption value="update">Définir</MenuItemSelectOption>
                                </MenuItemSelect>
                                <ZoneMenuSelect
                                    title="🚪 Zone de sortie"
                                    type="exit"
                                    zone={apartment.exitZone}
                                    propertyId={property.id}
                                    apartmentId={apartment.id}
                                    setProperties={setProperties}
                                />
                                <ZoneMenuSelect
                                    title="❄️️ Zone frigo"
                                    type="fridge"
                                    zone={apartment.fridgeZone}
                                    propertyId={property.id}
                                    apartmentId={apartment.id}
                                    setProperties={setProperties}
                                />
                                <ZoneMenuSelect
                                    title="🗄️ Zone du coffre"
                                    type="stash"
                                    zone={apartment.stashZone}
                                    propertyId={property.id}
                                    apartmentId={apartment.id}
                                    setProperties={setProperties}
                                />
                                <ZoneMenuSelect
                                    title="👕 Zone de la penderie"
                                    type="closet"
                                    zone={apartment.closetZone}
                                    propertyId={property.id}
                                    apartmentId={apartment.id}
                                    setProperties={setProperties}
                                />
                                <ZoneMenuSelect
                                    title="👛 Zone du coffre d'argent"
                                    type="money"
                                    zone={apartment.moneyZone}
                                    propertyId={property.id}
                                    apartmentId={apartment.id}
                                    setProperties={setProperties}
                                />
                                <MenuItemButton
                                    onConfirm={async () => {
                                        const properties = await fetchNui<any, Property[]>(
                                            NuiEvent.AdminMenuMapperDeleteApartment,
                                            {
                                                propertyId: property.id,
                                                apartmentId: apartment.id,
                                            }
                                        );

                                        setProperties(properties);
                                    }}
                                >
                                    ❌ Supprimer
                                </MenuItemButton>
                            </MenuContent>
                        </SubMenu>
                    ))}
                </Fragment>
            ))}
        </Menu>
    );
};

type ZoneMenuSelectProps = {
    title: string;
    zone: Zone;
    type: string;
    propertyId: number;
    apartmentId?: number;
    setProperties: (properties: Property[]) => void;
};

const ZoneMenuSelect: FunctionComponent<ZoneMenuSelectProps> = ({
    title,
    zone,
    type,
    propertyId,
    apartmentId = null,
    setProperties,
}) => {
    const onConfirm = async (index: number, value: string) => {
        if (value === 'teleport') {
            fetchNui(NuiEvent.AdminMenuMapperTeleportToZone, { zone });
        }

        if (value === 'update') {
            let properties;

            if (apartmentId === null) {
                properties = await fetchNui<any, Property[]>(NuiEvent.AdminMenuMapperUpdatePropertyZone, {
                    zone,
                    type,
                    propertyId,
                });
            } else {
                properties = await fetchNui<any, Property[]>(NuiEvent.AdminMenuMapperUpdateApartmentZone, {
                    zone,
                    type,
                    propertyId,
                    apartmentId,
                });
            }

            setProperties(properties);
        }

        if (value === 'show') {
            if (apartmentId === null) {
                fetchNui<any, Property[]>(NuiEvent.AdminMenuMapperShowPropertyZone, { type, propertyId, show: true });
            } else {
                fetchNui<any, Property[]>(NuiEvent.AdminMenuMapperShowApartmentZone, {
                    type,
                    propertyId,
                    apartmentId,
                    show: true,
                });
            }
        }

        if (value === 'hide') {
            if (apartmentId === null) {
                fetchNui(NuiEvent.AdminMenuMapperShowPropertyZone, { type, propertyId, show: false });
            } else {
                fetchNui(NuiEvent.AdminMenuMapperShowApartmentZone, { type, propertyId, apartmentId, show: false });
            }
        }
    };

    return (
        <MenuItemSelect onConfirm={onConfirm} title={<span className={!zone ? 'text-red-500' : ''}>{title}</span>}>
            <MenuItemSelectOption value="teleport">Téléporter</MenuItemSelectOption>
            <MenuItemSelectOption value="update">Modifier</MenuItemSelectOption>
            <MenuItemSelectOption value="show">Afficher</MenuItemSelectOption>
            <MenuItemSelectOption value="hide">Cacher</MenuItemSelectOption>
        </MenuItemSelect>
    );
};
