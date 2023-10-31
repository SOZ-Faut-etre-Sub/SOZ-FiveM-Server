import { BlipFactory } from '@public/client/blip';
import { EntityFactory } from '@public/client/factory/entity.factory';
import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { ItemService } from '@public/client/item/item.service';
import { Notifier } from '@public/client/notifier';
import { AudioService } from '@public/client/nui/audio.service';
import { PlayerPositionProvider } from '@public/client/player/player.position.provider';
import { PlayerService } from '@public/client/player/player.service';
import { ProgressService } from '@public/client/progress.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { ServerEvent } from '@public/shared/event';
import { Feature, isFeatureEnabled } from '@public/shared/features';
import { PlayerData } from '@public/shared/player';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { toVector4Object } from '@public/shared/polyzone/vector';
import { Halloween2023Scenario3 } from '@public/shared/story/halloween-2023/scenario3';

import { StoryProvider } from '../story.provider';

@Provider()
export class Halloween2023Scenario3Provider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(AudioService)
    private audioService: AudioService;

    @Inject(StoryProvider)
    private storyService: StoryProvider;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(EntityFactory)
    private entityFactory: EntityFactory;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Inject(Notifier)
    private notifier: Notifier;

    private electricity = false;
    private doorUnlock = false;

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        if (!isFeatureEnabled(Feature.Halloween2023Scenario3)) {
            return;
        }

        await this.createPeds();
        await this.spawnProps();
        await this.createTPTarget();
        await this.createActionZones();
    }

    public createBlip(player: PlayerData) {
        if (!isFeatureEnabled(Feature.Halloween2023Scenario3)) {
            return;
        }

        const startedOrFinish = !!player?.metadata?.halloween2023?.scenario3;
        if (!startedOrFinish && !this.storyService.canInteractForPart('halloween2023', 'scenario3', 0)) {
            return;
        }

        const blipId = 'halloween2023_scenario3';
        if (this.blipFactory.exist(blipId)) {
            return;
        }

        this.blipFactory.create(blipId, {
            name: 'Horror Story II : Le visiteur. (P3)',
            coords: toVector4Object([792.83, 1206.37, 338.39, 179.05]),
            sprite: 484,
            scale: 0.99,
            color: 44,
        });
    }

    private async createPeds(): Promise<void> {
        this.targetFactory.createForPed({
            model: 's_m_m_movalien_01',
            coords: toVector4Object([792.83, 1206.37, 338.47, 179.05]),
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_STAND_IMPATIENT_FACILITY',
            target: {
                options: [
                    {
                        label: 'Parler',
                        icon: 'fas fa-comment',
                        canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario3', 0),
                        action: async entity => {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_3, 1);
                            await this.storyService.launchDialog(
                                Halloween2023Scenario3.dialog['part1'],
                                true,
                                794.95,
                                1205.33,
                                339.57,
                                74.08,
                                entity
                            );
                        },
                    },
                    this.storyService.replayYearTarget(
                        Halloween2023Scenario3,
                        'halloween2023',
                        'scenario3',
                        0,
                        'part1',
                        [794.95, 1205.33, 339.57, 74.08]
                    ),
                    {
                        label: 'Donner',
                        icon: 'c:pole/livrer.png',
                        item: 'halloween_beef_with_bone',
                        canInteract: () => {
                            return this.storyService.canInteractForPart('halloween2023', 'scenario3', 1);
                        },
                        action: async entity => {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_3, 2);
                            await this.storyService.launchDialog(
                                Halloween2023Scenario3.dialog['part2'],
                                true,
                                794.95,
                                1205.33,
                                339.57,
                                74.08,
                                entity
                            );
                        },
                    },
                    this.storyService.replayYearTarget(
                        Halloween2023Scenario3,
                        'halloween2023',
                        'scenario3',
                        1,
                        'part2',
                        [794.95, 1205.33, 339.57, 74.08]
                    ),
                    {
                        label: 'Téléportation',
                        icon: 'c:halloween/teleportation.png',
                        canInteract: () => {
                            return this.storyService.canInteractForPart('halloween2023', 'scenario3', 2);
                        },
                        action: async () => {
                            this.audioService.playAudio('audio/halloween-2023/scenario3/teleportation.mp3', 0.2);
                            this.playerPositionProvider.teleportPlayerToPosition([405.9228, -954.1149, -99.6627, 0.1]);
                            this.audioService.playAudio('audio/halloween-2023/scenario3/song.mp3', 0.2);

                            await wait(30 * 1000);

                            this.audioService.playAudio('audio/halloween-2023/scenario3/teleportation.mp3', 0.2);
                            this.playerPositionProvider.teleportPlayerToPosition([-1266.32, -2962.67, -48.5, 178.4]);
                        },
                    },
                ],
                distance: 1.5,
            },
        });

        this.targetFactory.createForPed({
            model: 'u_m_y_burgerdrug_01',
            coords: toVector4Object([1234.08, -354.69, 68.08, 78.93]),
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_STAND_IMPATIENT',
            target: {
                options: [
                    {
                        label: 'Horny’s Burgers',
                        icon: 'fas fa-shopping-cart',
                        action: () => {
                            const products = [
                                {
                                    ...this.itemService.getItem('halloween_beef_with_bone'),
                                    price: 100,
                                    amount: 2000,
                                    slot: 1,
                                },
                            ];

                            this.inventoryManager.openShopInventory(products, 'menu_shop_supermarket');
                        },
                    },
                ],
                distance: 1.5,
            },
        });
    }

    private async createActionZones() {
        Halloween2023Scenario3.zones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, [
                {
                    label: zone.label,
                    icon: zone.icon,
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario3', zone.part),
                    action: async () => {
                        const { completed } = await this.progressService.progress(
                            'Recherche',
                            'Vous recherchez...',
                            5000,
                            {
                                dictionary: 'missfbi4prepp1',
                                name: '_bag_pickup_garbage_man',
                                options: {
                                    enablePlayerControl: false,
                                    repeat: true,
                                },
                            },
                            {
                                useAnimationService: true,
                            }
                        );

                        if (completed) {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_3, zone.part + 1);
                        }
                    },
                },
            ]);
        });

        this.targetFactory.createForBoxZone(
            'halloween2023_scenario3-1door',
            {
                ...new BoxZone([-1267.06, -3050.4, -48.49], 1.8, 24.8, {
                    heading: -0.16,
                    minZ: -49.49,
                    maxZ: -47.49,
                }),
            },
            [
                {
                    label: 'Sortir',
                    icon: 'c:housing/enter.png',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario3', 2),
                    action: async () => {
                        if (!this.electricity) {
                            this.notifier.error('Impossible de sortir tant que la porte n’est pas alimentée..');
                            return;
                        }
                        this.audioService.playAudio('audio/halloween-2023/scenario3/teleportation.mp3', 0.2);
                        this.playerPositionProvider.teleportPlayerToPosition([-1005.84, -478.92, 50.02733, 0.0]);
                    },
                },
            ]
        );

        this.targetFactory.createForBoxZone(
            'halloween2023_scenario3-1elec',
            {
                ...new BoxZone([-1286.43, -2984.89, -48.49], 1.0, 3.6, {
                    heading: 270.38,
                    minZ: -49.49,
                    maxZ: -47.49,
                }),
            },
            [
                {
                    label: 'Alimenter',
                    icon: 'c:upw/deposer.png',
                    canInteract: () =>
                        this.storyService.canInteractForPart('halloween2023', 'scenario3', 2) && !this.electricity,
                    action: async () => {
                        const { completed } = await this.progressService.progress(
                            'halloween_elec',
                            "Vous rebanchez l'électicité...",
                            5000,
                            {
                                dictionary: 'missfbi4prepp1',
                                name: '_bag_pickup_garbage_man',
                                options: {
                                    enablePlayerControl: false,
                                    repeat: true,
                                },
                            },
                            {
                                useAnimationService: true,
                            }
                        );

                        if (!completed) {
                            return;
                        }

                        this.notifier.notify('Alimentation électique réactivée');
                        this.electricity = true;
                    },
                },
            ]
        );

        this.targetFactory.createForBoxZone(
            'halloween2023_scenario3-2-1',
            {
                ...new BoxZone([-1002.64, -479.55, 50.83], 1.0, 2.0, {
                    heading: 30.54,
                    minZ: 49.83,
                    maxZ: 51.83,
                }),
            },
            [
                {
                    label: 'Fouiller',
                    icon: 'fas fa-search',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario3', 2),
                    action: async () => {
                        this.notifier.notify('Des livres d’histoires sur des MJs.. Je préfère voir ça en Live.');
                    },
                },
            ]
        );
        this.targetFactory.createForBoxZone(
            'halloween2023_scenario3-2-2',
            {
                ...new BoxZone([-1005.15, -481.1, 50.48], 0.6, 1.0, {
                    heading: 29.27,
                    minZ: 50.48,
                    maxZ: 51.08,
                }),
            },
            [
                {
                    label: 'Fouiller',
                    icon: 'fas fa-search',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario3', 2),
                    action: async () => {
                        this.notifier.notify('Des photos d’une charmante jeune femme, pas autant que l’Admin..');
                    },
                },
            ]
        );
        this.targetFactory.createForBoxZone(
            'halloween2023_scenario3-2-3',
            {
                ...new BoxZone([-1009.13, -480.72, 50.03], 0.8, 0.8, {
                    heading: 291.12,
                    minZ: 49.03,
                    maxZ: 51.03,
                }),
            },
            [
                {
                    label: 'Fouiller',
                    icon: 'fas fa-search',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario3', 2),
                    action: async () => {
                        this.notifier.notify('Un sarcophage ? Barker a dû connaître cette époque..');
                    },
                },
            ]
        );
        this.targetFactory.createForBoxZone(
            'halloween2023_scenario3-2-4',
            {
                ...new BoxZone([-1011.36, -476.53, 49.28], 0.8, 0.8, {
                    heading: 252.84,
                    minZ: 49.68,
                    maxZ: 50.28,
                }),
            },
            [
                {
                    label: 'Fouiller',
                    icon: 'fas fa-search',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario3', 2),
                    action: async () => {
                        this.notifier.notify("Des bouteilles d'alcool et aucune bière en vue, étrange..");
                    },
                },
            ]
        );
        this.targetFactory.createForBoxZone(
            'halloween2023_scenario3-2-5',
            {
                ...new BoxZone([-1007.98, -476.43, 49.38], 1.2, 2.4, {
                    heading: 28.54,
                    minZ: 49.78,
                    maxZ: 50.38,
                }),
            },
            [
                {
                    label: 'Fouiller',
                    icon: 'fas fa-search',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario3', 2),
                    action: async () => {
                        this.notifier.notify('Il y a tellement de papiers que ça ressemble à un Discord HRP..');
                    },
                },
            ]
        );
        this.targetFactory.createForBoxZone(
            'halloween2023_scenario3-2-6',
            {
                ...new BoxZone([-1005.81, -473.43, 50.03], 0.6, 0.9, {
                    heading: 118.65,
                    minZ: 49.03,
                    maxZ: 51.03,
                }),
            },
            [
                {
                    label: 'Fouiller',
                    icon: 'fas fa-search',
                    canInteract: () =>
                        this.storyService.canInteractForPart('halloween2023', 'scenario3', 2) && !this.doorUnlock,
                    action: async () => {
                        this.notifier.notify(
                            'Vous trouvez un bouton caché, en appuyant dessus, un clique retenti, la porte semble être dévérouillée'
                        );
                        this.doorUnlock = true;
                    },
                },
            ]
        );
        this.targetFactory.createForBoxZone(
            'halloween2023_scenario3-2-7',
            {
                ...new BoxZone([-1006.49, -472.98, 51.03], 0.2, 1.4, {
                    heading: 210.54,
                    minZ: 50.03,
                    maxZ: 52.03,
                }),
            },
            [
                {
                    label: 'Fouiller',
                    icon: 'fas fa-search',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario3', 2),
                    action: async () => {
                        this.notifier.notify('Star Citizen ? Même la Haute Criminalité sortira avant.');
                    },
                },
            ]
        );
        this.targetFactory.createForBoxZone(
            'halloween2023_scenario3-2door',
            {
                ...new BoxZone([-1002.44, -477.54, 50.03], 0.4, 1.4, {
                    heading: 119.89,
                    minZ: 49.03,
                    maxZ: 51.03,
                }),
            },
            [
                {
                    label: 'Sortir',
                    icon: 'c:housing/enter.png',
                    canInteract: () =>
                        this.storyService.canInteractForPart('halloween2023', 'scenario3', 2) && this.doorUnlock,
                    action: async () => {
                        this.audioService.playAudio('audio/halloween-2023/scenario3/teleportation.mp3', 0.2);
                        this.playerPositionProvider.teleportPlayerToPosition([151.51, -743.58, 254.15, 0.0]);
                        TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_3, 3);
                    },
                },
            ]
        );

        this.targetFactory.createForBoxZone(
            'halloween2023_scenario3-3-a',
            {
                ...new BoxZone([136.59, -763.45, 233.75], 0.15, 0.45, {
                    heading: 340.93,
                    minZ: 233.85,
                    maxZ: 234.75,
                }),
            },
            [
                {
                    label: 'Ascenseur',
                    icon: 'c:elevators/descendre.png',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario3', 3),
                    action: async () => this.exitFBI(),
                },
            ]
        );

        this.targetFactory.createForBoxZone(
            'halloween2023_scenario3-3-b',
            {
                ...new BoxZone([133.44, -733.56, 246.15], 1.0, 1.4, {
                    heading: 339.48,
                    minZ: 245.15,
                    maxZ: 247.15,
                }),
            },
            [
                {
                    label: 'Sortir',
                    icon: 'c:housing/enter.png',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario3', 3),
                    action: async () => this.exitFBI(),
                },
            ]
        );

        this.targetFactory.createForBoxZone(
            'halloween2023_scenario3-4',
            {
                ...new BoxZone([-1506.43, -3025.44, -79.24], 0.2, 0.4, {
                    heading: 0.83,
                    minZ: -79.24,
                    maxZ: -78.64,
                }),
            },
            [
                {
                    label: 'Ascenseur',
                    icon: 'c:elevators/descendre.png',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario3', 4),
                    action: async () => {
                        this.audioService.playAudio('audio/halloween-2023/scenario3/teleportation.mp3', 0.2);
                        this.playerPositionProvider.teleportPlayerToPosition([150.46, -1301.75, 1308.99, 99.83]);
                        await wait(20 * 1000);
                        this.audioService.playAudio('audio/halloween-2023/scenario3/teleportation.mp3', 0.2);
                        this.playerPositionProvider.teleportPlayerToPosition([1561.55, 411.93, -49.66, 0.0]);
                    },
                },
            ]
        );
    }

    private async exitFBI() {
        TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_3, 4);
        this.audioService.playAudio('audio/halloween-2023/scenario3/teleportation.mp3', 0.2);
        this.playerPositionProvider.teleportPlayerToPosition([520.0, 4750.0, -70.0, 0.0]);
        await wait(5 * 1000);
        this.audioService.playAudio('audio/halloween-2023/scenario3/teleportation.mp3', 0.2);
        this.playerPositionProvider.teleportPlayerToPosition([-1520.8, -2978.92, -80.46, 271.53]);
    }

    @Tick(TickInterval.EVERY_SECOND, 'halloween2023')
    private async inFBICheckLoop() {
        if (!this.playerService.getPlayer()) {
            return;
        }

        if (!this.storyService.canInteractForPart('halloween2023', 'scenario3', 3)) {
            await wait(5000);
            return;
        }

        if (!GetInteriorFromEntity(PlayerPedId())) {
            this.audioService.playAudio('audio/halloween-2023/scenario3/teleportation.mp3', 0.2);
            this.playerPositionProvider.teleportPlayerToPosition([151.51, -743.58, 254.15, 0.0]);
        }
    }

    private async spawnProps() {
        for (const prop of Halloween2023Scenario3.props) {
            await this.entityFactory.createEntityWithRotation(GetHashKey(prop.model), ...prop.coords, ...prop.rotation);
        }
    }

    private async createTPTarget(): Promise<void> {
        this.targetFactory.createForBoxZone(
            'halloween2023:scenario3:TPSubmarineBack',
            {
                ...new BoxZone([1561.48, 392.68, -49.69], 1.0, 1.0, {
                    heading: 182.04,
                    minZ: -50.69,
                    maxZ: -48.69,
                }),
            },
            [
                {
                    label: 'Sortir',
                    icon: 'c:housing/enter.png',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario3', 5),
                    action: async () => {
                        this.audioService.playAudio('audio/halloween-2023/scenario3/teleportation.mp3', 0.2);
                        this.playerPositionProvider.teleportPlayerToPosition([791.14, 1209.36, 339.23, 251.88]);
                        TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_3, 6);
                    },
                },
            ]
        );
    }
}
