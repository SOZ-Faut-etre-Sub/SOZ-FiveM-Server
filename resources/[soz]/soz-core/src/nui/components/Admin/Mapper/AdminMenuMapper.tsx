import { Fragment, FunctionComponent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../../shared/event';
import { AdminMapperMenuData } from '../../../../shared/housing/menu';
import { MenuType } from '../../../../shared/nui/menu';
import { Zone } from '../../../../shared/polyzone/box.zone';
import { fetchNui } from '../../../fetch';
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

    if (!data) {
        return null;
    }

    const properties = data.properties.sort((a, b) => a.identifier.localeCompare(b.identifier));

    return (
        <Menu type={MenuType.AdminMapperMenu}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_mapper">Menu mapper</MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id="objects">🚏 Gestion des objets</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="properties">🏠 Gestion des propriétés</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="tools">🚧 Outils pour mappeur</MenuItemSubMenuLink>
                </MenuContent>
            </MainMenu>
            <SubMenu id="objects">
                <MenuTitle banner="https://nui-img/soz/menu_mapper">Un poteau, une borne, des poubelles !</MenuTitle>
                <MenuContent></MenuContent>
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
                        {properties.map(property => (
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
                        onConfirm={() => {
                            fetchNui(NuiEvent.AdminMenuMapperAddProperty, {});
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
            {properties.map(property => (
                <Fragment key={property.id}>
                    <SubMenu id={`property_${property.identifier}`}>
                        <MenuTitle banner="https://nui-img/soz/menu_mapper">Batiment : {property.identifier}</MenuTitle>
                        <MenuContent>
                            <ZoneMenuSelect
                                title="🚪 Zone entrée"
                                type="entry"
                                zone={property.entryZone}
                                propertyId={property.id}
                            />
                            <ZoneMenuSelect
                                title="🅿️ Zone garage"
                                type="garage"
                                zone={property.garageZone}
                                propertyId={property.id}
                            />
                            {property.apartments.map(apartment => (
                                <MenuItemSubMenuLink key={apartment.id} id={`apartment_${apartment.identifier}`}>
                                    Appartement: {apartment.label}
                                </MenuItemSubMenuLink>
                            ))}
                            <MenuItemButton
                                onConfirm={() => {
                                    fetchNui(NuiEvent.AdminMenuMapperAddApartment, { propertyId: property.id });
                                }}
                            >
                                ➕ Ajouter un appartement
                            </MenuItemButton>
                            <MenuItemButton
                                onConfirm={() => {
                                    fetchNui(NuiEvent.AdminMenuMapperDeleteProperty, {
                                        propertyId: property.id,
                                    });
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
                                    onConfirm={() => {
                                        fetchNui(NuiEvent.AdminMenuMapperSetApartmentIdentifier, {
                                            propertyId: property.id,
                                            apartmentId: apartment.id,
                                        });
                                    }}
                                >
                                    Changer l'identifiant
                                </MenuItemButton>
                                <MenuItemButton
                                    onConfirm={() => {
                                        fetchNui(NuiEvent.AdminMenuMapperSetApartmentName, {
                                            propertyId: property.id,
                                            apartmentId: apartment.id,
                                        });
                                    }}
                                >
                                    Changer le nom
                                </MenuItemButton>
                                <MenuItemButton
                                    onConfirm={() => {
                                        fetchNui(NuiEvent.AdminMenuMapperSetApartmentPrice, {
                                            propertyId: property.id,
                                            apartmentId: apartment.id,
                                        });
                                    }}
                                >
                                    <div className="flex justify-between">
                                        <span>💲 Prix</span>
                                        <span>${apartment.price.toLocaleString()}</span>
                                    </div>
                                </MenuItemButton>
                                {/*<ZoneMenuSelect*/}
                                {/*    title="🌀️ Zone d'apparition"*/}
                                {/*    type="money"*/}
                                {/*    zone={apartment.position}*/}
                                {/*    propertyId={property.id}*/}
                                {/*    apartmentId={apartment.id}*/}
                                {/*/>*/}
                                <ZoneMenuSelect
                                    title="🚪 Zone de sortie"
                                    type="exit"
                                    zone={apartment.exitZone}
                                    propertyId={property.id}
                                    apartmentId={apartment.id}
                                />
                                <ZoneMenuSelect
                                    title="❄️️ Zone frigo"
                                    type="fridge"
                                    zone={apartment.fridgeZone}
                                    propertyId={property.id}
                                    apartmentId={apartment.id}
                                />
                                <ZoneMenuSelect
                                    title="🗄️ Zone du coffre"
                                    type="stash"
                                    zone={apartment.stashZone}
                                    propertyId={property.id}
                                    apartmentId={apartment.id}
                                />
                                <ZoneMenuSelect
                                    title="👕 Zone de la penderie"
                                    type="closet"
                                    zone={apartment.closetZone}
                                    propertyId={property.id}
                                    apartmentId={apartment.id}
                                />
                                <ZoneMenuSelect
                                    title="👛 Zone du coffre d'argent"
                                    type="money"
                                    zone={apartment.moneyZone}
                                    propertyId={property.id}
                                    apartmentId={apartment.id}
                                />
                                <MenuItemButton
                                    onConfirm={() => {
                                        fetchNui(NuiEvent.AdminMenuMapperDeleteApartment, {
                                            propertyId: property.id,
                                            apartmentId: apartment.id,
                                        });
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
};

const ZoneMenuSelect: FunctionComponent<ZoneMenuSelectProps> = ({
    title,
    zone,
    type,
    propertyId,
    apartmentId = null,
}) => {
    const onConfirm = (index: number, value: string) => {
        if (value === 'teleport') {
            fetchNui(NuiEvent.AdminMenuMapperTeleportToZone, { zone });
        }

        if (value === 'update') {
            if (apartmentId === null) {
                fetchNui(NuiEvent.AdminMenuMapperUpdatePropertyZone, { zone, type, propertyId });
            } else {
                fetchNui(NuiEvent.AdminMenuMapperUpdateApartmentZone, { zone, type, propertyId, apartmentId });
            }
        }

        if (value === 'show') {
            if (apartmentId === null) {
                fetchNui(NuiEvent.AdminMenuMapperShowPropertyZone, { type, propertyId, show: true });
            } else {
                fetchNui(NuiEvent.AdminMenuMapperShowApartmentZone, { type, propertyId, apartmentId, show: true });
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
        <MenuItemSelect onConfirm={onConfirm} title={title}>
            <MenuItemSelectOption value="teleport">Téléporter</MenuItemSelectOption>
            <MenuItemSelectOption value="update">Modifier</MenuItemSelectOption>
            <MenuItemSelectOption value="show">Afficher</MenuItemSelectOption>
            <MenuItemSelectOption value="hide">Cacher</MenuItemSelectOption>
        </MenuItemSelect>
    );
};
