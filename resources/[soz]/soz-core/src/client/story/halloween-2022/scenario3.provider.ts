import { PlayerPositionProvider } from '@public/client/player/player.position.provider';

import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { emitRpc } from '../../../core/rpc';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { RpcServerEvent } from '../../../shared/rpc';
import { Halloween2022Scenario3 } from '../../../shared/story/halloween-2022/scenario3';
import { Dialog } from '../../../shared/story/story';
import { BlipFactory } from '../../blip';
import { PedFactory } from '../../factory/ped.factory';
import { TargetFactory } from '../../target/target.factory';
import { StoryProvider } from '../story.provider';

@Provider()
export class Halloween2022Scenario3Provider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Inject(StoryProvider)
    private storyService: StoryProvider;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        if (!isFeatureEnabled(Feature.HalloweenScenario3)) {
            return;
        }

        await this.createTourist1Ped();
        await this.createTourist2Ped();
        await this.createDoctorPed();
        await this.createTPTarget();
    }

    public createBlip() {
        if (!isFeatureEnabled(Feature.HalloweenScenario3)) {
            return;
        }

        if (!this.storyService.canInteractForPart('halloween2022', 'scenario3', 0)) {
            return;
        }

        const blipId = 'halloween2022_scenario3';
        if (this.blipFactory.exist(blipId)) {
            return;
        }

        this.blipFactory.create(blipId, {
            name: 'Horror Story I : La double personnalité. (P3)',
            coords: { x: 510.03, y: 5596.81, z: 792.72 },
            sprite: 484,
            scale: 0.99,
            color: 44,
        });
    }

    private async createTourist1Ped(): Promise<void> {
        await this.pedFactory.createPedOnGrid({
            model: 'a_f_y_tourist_01',
            coords: { x: 510.03, y: 5596.81, z: 792.72, w: 255.8 },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'amb@medic@standing@kneel@idle_a',
            anim: 'idle_a',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario3:part1',
            {
                center: [510.03, 5596.81, 792.72],
                length: 1.5,
                width: 1.5,
                heading: 255,
                minZ: 792,
                maxZ: 794,
            },
            [
                {
                    label: 'Parler',
                    icon: 'fas fa-comment',
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario3', 0),
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcServerEvent.STORY_HALLOWEEN_SCENARIO3, 'part1');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, 509.06, 5596.23, 794.22, 306.58);
                        }
                    },
                },
                {
                    label: 'Parler',
                    icon: 'fas fa-comment',
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario3', 5),
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcServerEvent.STORY_HALLOWEEN_SCENARIO3, 'part5');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, 509.06, 5596.23, 794.22, 306.58);
                        }
                    },
                },
                this.storyService.replayTarget(Halloween2022Scenario3, 'scenario3', 1),
                this.storyService.replayTarget(Halloween2022Scenario3, 'scenario3', 5),
            ]
        );
    }

    private async createTourist2Ped(): Promise<void> {
        await this.pedFactory.createPedOnGrid({
            model: 'mp_f_cocaine_01',
            coords: { x: 905.28, y: -3198.25, z: -98.1, w: 204.99 },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'timetable@floyd@cryingonbed_ig_5@',
            anim: 'idle_a',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario3:part2',
            {
                center: [905.28, -3198.25, -98.1],
                length: 1.5,
                width: 1.5,
                heading: 204,
                minZ: -98,
                maxZ: -97,
            },
            [
                {
                    label: 'Parler',
                    icon: 'fas fa-comment',
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario3', 2),
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcServerEvent.STORY_HALLOWEEN_SCENARIO3, 'part2');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, 906.08, -3199.19, -97.19, 25.7);
                        }
                    },
                },
                {
                    label: 'Parler',
                    icon: 'fas fa-comment',
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario3', 4),
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcServerEvent.STORY_HALLOWEEN_SCENARIO3, 'part4');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, 906.08, -3199.19, -97.19, 25.7);
                        }
                    },
                },
                this.storyService.replayTarget(Halloween2022Scenario3, 'scenario3', 2),
                this.storyService.replayTarget(Halloween2022Scenario3, 'scenario3', 4),
            ]
        );
    }

    private async createDoctorPed(): Promise<void> {
        await this.pedFactory.createPedOnGrid({
            model: 's_m_m_doctor_01',
            coords: { x: -323.92, y: -254.14, z: 33.39, w: 234.28 },
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_SMOKING',
            flag: 1,
        });

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario3:part3',
            {
                center: [-323.92, -254.14, 33.39],
                length: 1.5,
                width: 1.5,
                heading: 234,
                minZ: 33,
                maxZ: 35,
            },
            [
                {
                    label: 'Parler',
                    icon: 'fas fa-comment',
                    canInteract: () => this.storyService.canInteractForPart('halloween2022', 'scenario3', 3),
                    action: async () => {
                        const dialog = await emitRpc<Dialog | null>(RpcServerEvent.STORY_HALLOWEEN_SCENARIO3, 'part3');
                        if (dialog) {
                            await this.storyService.launchDialog(dialog, true, -322.72, -255.15, 34.39, 48.55);
                        }
                    },
                },
                this.storyService.replayTarget(Halloween2022Scenario3, 'scenario3', 3),
            ]
        );
    }

    private async createTPTarget(): Promise<void> {
        this.targetFactory.createForBoxZone(
            'halloween2022:scenario3:TPBunker',
            {
                center: [598.52, 5556.91, 715.56],
                length: 18.4,
                width: 15.6,
                heading: 343,
                minZ: 715.56,
                maxZ: 716.16,
            },
            [
                {
                    label: 'Entrer',
                    icon: 'c:housing/enter.png',
                    action: async () => {
                        this.playerPositionProvider.teleportPlayerToPosition([894.74, -3245.37, -98.26, 91.46]);
                    },
                },
            ]
        );

        this.targetFactory.createForBoxZone(
            'halloween2022:scenario3:TPBunkerBack',
            {
                center: [896.9, -3245.8, -99.27],
                length: 0.4,
                width: 5.2,
                heading: 271,
                minZ: -99.27,
                maxZ: -94.07,
            },
            [
                {
                    label: 'Sortir',
                    icon: 'c:housing/enter.png',
                    action: async () => {
                        this.playerPositionProvider.teleportPlayerToPosition([604.61, 5556.5, 716.76, 37.74]);
                    },
                },
            ]
        );
    }
}
