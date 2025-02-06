import { Once, OnceStep, OnEvent, OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { TargetFactory } from '@public/client/target/target.factory';
import { emitRpc } from '@public/core/rpc';
import { CraftsList } from '@public/shared/craft/craft';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { Feature } from '@public/shared/features';
import { JobType } from '@public/shared/job';
import { CraftZones } from '@public/shared/job/food';
import { MenuType } from '@public/shared/nui/menu';
import { RpcServerEvent } from '@public/shared/rpc';

import { BlipFactory } from '../../blip';
import { FeatureProvider } from '../../feature/feature.provider';
import { NuiMenu } from '../../nui/nui.menu';

@Provider()
export class FoodProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    private state = {
        displayEasterEggBlip: false,
        easterEnabled: false,
    };

    @OnNuiEvent(NuiEvent.FoodDisplayBlip)
    public async onDisplayBlip({ blip, value }: { blip: string; value: boolean }) {
        this.state[blip] = value;
        this.blipFactory.hide(blip, !value);
    }

    @Once(OnceStep.PlayerLoaded)
    public setupFoodJob() {
        CraftZones.forEach(zone =>
            this.targetFactory.createForBoxZone(`${zone.name}-fish`, zone, [
                {
                    icon: 'food/fish',
                    label: 'Préparation marine',
                    job: JobType.Food,
                    blackoutGlobal: true,
                    blackoutJob: JobType.Food,
                    category: 'society',
                    canInteract: () => {
                        return true;
                    },
                    action: async () => {
                        TriggerServerEvent(ServerEvent.FOOD_FISH_PREPARATION);
                    },
                },
            ])
        );

        if (this.featureProvider.isFeatureEnabled(Feature.EasterFood)) {
            this.state.easterEnabled = true;

            this.blipFactory.create('displayEasterEggBlip', {
                name: 'Point de collecte des oeufs',
                coords: { x: 2253.42, y: 4835.86, z: 40.66 },
                sprite: 809,
                scale: 0.9,
            });

            this.blipFactory.hide('displayEasterEggBlip', true);

            this.targetFactory.createForBoxZone(
                'food:easter_harvest',
                {
                    center: [2253.42, 4835.86, 40.66],
                    length: 33.2,
                    width: 8.4,
                    minZ: 38.66,
                    maxZ: 40.66,
                    heading: 45,
                },
                [
                    {
                        label: 'Récolter',
                        icon: 'food/collecter',
                        job: JobType.Food,
                        category: 'society',
                        action: () => {
                            TriggerServerEvent(ServerEvent.FOOD_EASTER_HARVEST);
                        },
                    },
                ]
            );
        }
    }

    @OnEvent(ClientEvent.JOBS_FOOD_OPEN_SOCIETY_MENU)
    public async onOpenSocietyMenu() {
        if (this.nuiMenu.getOpened() === MenuType.FoodJobMenu) {
            this.nuiMenu.closeMenu();
            return;
        }
        const crafting = await emitRpc<CraftsList>(RpcServerEvent.CRAFT_GET_RECIPES, JobType.Food);
        this.nuiMenu.openMenu(MenuType.FoodJobMenu, {
            recipes: crafting.categories,
            state: this.state,
        });
    }
}
