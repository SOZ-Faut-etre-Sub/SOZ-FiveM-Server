import { SubMenuScene } from '@public/nui/components/Menu/SubMenuScene';
import { fetchNui } from '@public/nui/fetch';
import { useItems } from '@public/nui/hook/data';
import { useRepository } from '@public/nui/hook/repository';
import { NuiEvent } from '@public/shared/event/nui';
import { RepositoryType } from '@public/shared/repository';
import { EventInfo } from '@public/shared/scene';
import { Fragment, FunctionComponent, useState } from 'react';

import {
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type EventSubMenuProps = {
    banner: string;
    event: EventInfo;
};

export const EventSubMenu: FunctionComponent<EventSubMenuProps> = ({ banner, event }) => {
    const [eventInfo, setEventInfo] = useState<EventInfo>(event);
    const events = useRepository(RepositoryType.WorldEvent);
    const scenes = useRepository(RepositoryType.Scene);
    const items = useItems();

    const currentEvent = eventInfo.currentEventId
        ? Object.values(events).find(worldEvent => worldEvent.id === eventInfo.currentEventId)
        : null;
    const currentScene = eventInfo.currentSceneId
        ? Object.values(scenes).find(scene => scene.id === eventInfo.currentSceneId)
        : null;

    return (
        <>
            <SubMenu id="event">
                <MenuTitle banner={banner}>Evenements HC</MenuTitle>
                <MenuContent>
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.AdminMenuEventCreate)}>
                        📅 Ajouter un nouveau evenement
                    </MenuItemButton>
                    {currentEvent && currentScene && (
                        <MenuItemButton
                            description={
                                <div>
                                    <div>Evenement: {currentEvent.name}</div>
                                    <div>Scène: {currentScene.name}</div>
                                    <div>
                                        Date de fin {new Date(eventInfo.endEventTimestamp).toLocaleString('fr-FR')}
                                    </div>
                                </div>
                            }
                            onConfirm={() => {
                                fetchNui(NuiEvent.AdminMenuEventStop);
                                setEventInfo({
                                    currentEventId: null,
                                    currentSceneId: null,
                                    endEventTimestamp: null,
                                });
                            }}
                        >
                            🔴 Arreter evenement en cours
                        </MenuItemButton>
                    )}
                    {Object.values(events).map(event => (
                        <MenuItemSubMenuLink key={event.id} id={`event-${event.id}`}>
                            {event.name}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </SubMenu>
            {Object.values(events).map(event => (
                <Fragment key={event.id}>
                    <SubMenu id={`event-${event.id}`}>
                        <MenuTitle banner={banner}>Evenement {event.name}</MenuTitle>
                        <MenuContent>
                            <MenuItemButton
                                onConfirm={() => fetchNui(NuiEvent.AdminMenuEventAddReward, { eventId: event.id })}
                            >
                                ➕ Ajouter une récompense
                            </MenuItemButton>
                            <MenuItemButton onConfirm={() => fetchNui(NuiEvent.SceneCreate, { eventId: event.id })}>
                                ➕ Ajouter une scène
                            </MenuItemButton>
                            <MenuItemButton
                                onConfirm={() =>
                                    fetchNui(NuiEvent.AdminMenuEventSetStartSound, {
                                        eventId: event.id,
                                        sound: event.startSound,
                                    })
                                }
                            >
                                ➕ Son de début d'évenement
                            </MenuItemButton>
                            <MenuItemButton
                                onConfirm={async () => {
                                    const eventInfo = await fetchNui(NuiEvent.AdminMenuEventStart, {
                                        eventId: event.id,
                                    });

                                    if (eventInfo) {
                                        setEventInfo(eventInfo as EventInfo);
                                    }
                                }}
                            >
                                🟢 Lancer l'évenement
                            </MenuItemButton>
                            <MenuItemButton
                                onConfirm={() => {
                                    fetchNui(NuiEvent.AdminMenuEventDelete, { eventId: event.id });
                                }}
                            >
                                ❌ Supprimer
                            </MenuItemButton>
                            <MenuTitle>Récompenses</MenuTitle>
                            {event.reward.map(reward => (
                                <MenuItemSelect
                                    title={items.find(item => item.name === reward.item)?.label || reward.item}
                                    key={reward.item}
                                    description={
                                        <div>
                                            <div>Chance: {reward.chance}%</div>
                                            <div>Min: {reward.min}</div>
                                            <div>Max: {reward.max}</div>
                                        </div>
                                    }
                                    onConfirm={(i, value) => {
                                        if (value === 'delete') {
                                            fetchNui(NuiEvent.AdminMenuEventRemoveReward, {
                                                eventId: event.id,
                                                itemId: reward.item,
                                            });
                                        }

                                        if (value === 'chance') {
                                            fetchNui(NuiEvent.AdminMenuEventSetRewardChance, {
                                                eventId: event.id,
                                                itemId: reward.item,
                                            });
                                        }

                                        if (value === 'min') {
                                            fetchNui(NuiEvent.AdminMenuEventSetRewardMin, {
                                                eventId: event.id,
                                                itemId: reward.item,
                                            });
                                        }

                                        if (value === 'max') {
                                            fetchNui(NuiEvent.AdminMenuEventSetRewardMax, {
                                                eventId: event.id,
                                                itemId: reward.item,
                                            });
                                        }
                                    }}
                                >
                                    <MenuItemSelectOption value="delete">Supprimer</MenuItemSelectOption>
                                    <MenuItemSelectOption value="chance">Déf. Chance</MenuItemSelectOption>
                                    <MenuItemSelectOption value="min">Déf. Min</MenuItemSelectOption>
                                    <MenuItemSelectOption value="max">Déf. Max</MenuItemSelectOption>
                                </MenuItemSelect>
                            ))}
                            <MenuTitle>Scènes</MenuTitle>
                            {Object.values(scenes)
                                .filter(scene => scene.worldEventId === event.id)
                                .map(scene => (
                                    <MenuItemSubMenuLink key={scene.id} id={`scene-${scene.id}`}>
                                        {scene.persistent ? '🟢' : '🔴'} {scene.name}
                                    </MenuItemSubMenuLink>
                                ))}
                        </MenuContent>
                    </SubMenu>
                    {Object.values(scenes)
                        .filter(scene => scene.worldEventId === event.id)
                        .map(scene => (
                            <SubMenuScene key={scene.id} scene={scene} context="admin" />
                        ))}
                </Fragment>
            ))}
        </>
    );
};
