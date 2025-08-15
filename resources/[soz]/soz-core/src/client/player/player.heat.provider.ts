import { Provider } from '@core/decorators/provider';
import { FemaleJewelryItems, MaleJewelryItems } from '@public/config/jewelry';
import { On } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { Component, Outfit, Prop } from '@public/shared/cloth';
import { Feature } from '@public/shared/features';
import { JobType } from '@public/shared/job';
import { ObjectOutFits } from '@public/shared/job/police';
import { PlayerPedHash } from '@public/shared/player';
import { RpcServerEvent } from '@public/shared/rpc';

import { LsmcCloakroom } from '../../shared/job/lsmc';
import { ClothingService } from '../clothing/clothing.service';
import { FeatureProvider } from '../feature/feature.provider';
import { HudWeatherIconProvider } from '../hud/hud.weathericon.provider';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
import { Store } from '../store/store';
import { BlurService } from '../utils/blur.service';
import { PlayerService } from './player.service';

const ExtraWarnCloths: Record<number, Outfit[]> = {
    [PlayerPedHash.Male]: [
        /*
        POLICE_CLOAKROOM[JobType.LSPD][PlayerPedHash.Male]['Tenue Hiver'],
        POLICE_CLOAKROOM[JobType.BCSO][PlayerPedHash.Male]['Tenue Hiver'],
        LsmcCloakroom[PlayerPedHash.Male]['Tenue Hiver'],
        StonkCloakroom[PlayerPedHash.Male]['Tenue Hiver'],
        */
    ],
    [PlayerPedHash.Female]: [
        /*
        POLICE_CLOAKROOM[JobType.LSPD][PlayerPedHash.Female]['Tenue Hiver'],
        POLICE_CLOAKROOM[JobType.BCSO][PlayerPedHash.Female]['Tenue Hiver'],
        LsmcCloakroom[PlayerPedHash.Female]['Tenue Hiver'],
        StonkCloakroom[PlayerPedHash.Female]['Tenue Hiver'],
        */
    ],
};

const SkipWarnCloths: Record<number, Outfit[]> = {
    [PlayerPedHash.Male]: [
        ObjectOutFits[JobType.LSPD][PlayerPedHash.Male]['light_intervention_outfit'],
        ObjectOutFits[JobType.BCSO][PlayerPedHash.Male]['heavy_antiriot_outfit'],
        LsmcCloakroom[PlayerPedHash.Male]['Tenue incendie'],
    ],
    [PlayerPedHash.Female]: [
        ObjectOutFits[JobType.LSPD][PlayerPedHash.Female]['light_intervention_outfit'],
        ObjectOutFits[JobType.BCSO][PlayerPedHash.Female]['heavy_antiriot_outfit'],
        LsmcCloakroom[PlayerPedHash.Female]['Tenue incendie'],
    ],
};

const maskEyesProtected = [
    9, 10, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29, 31, 33, 38, 39, 40, 41, 42, 43, 44, 45, 46, 59, 60, 61, 63,
    64, 65, 66, 67, 68, 70, 71, 72, 74, 75, 79, 80, 81, 82, 83, 84, 87, 89, 91, 92, 93, 94, 97, 98, 100, 102, 103, 105,
    106, 108, 110, 123, 125, 129, 130, 131, 132, 134, 135, 136, 137, 138, 139, 140, 141, 143, 144, 146, 147, 149, 150,
    151, 152, 153, 154, 155, 156, 157, 158, 159, 162, 163, 175, 177, 179, 180, 181, 182, 183, 184, 189, 193, 194, 195,
    196, 197, 198, 201, 202, 203, 205, 206, 208, 210, 214, 215, 223, 225, 229, 236,
];

const maskEyesBCSOProtected = [0];

const maskMouthNotProtected = [0, 11, 12, 27, 32, 37, 47, 57, 58, 73, 77, 109, 114, 117, 119, 120, 121, 122, 145, 148];

const hatProtected = {
    [PlayerPedHash.Male]: [
        18, 38, 47, 50, 51, 52, 53, 57, 62, 73, 78, 80, 82, 91, 111, 115, 123, 125, 128, 129, 133, 134, 144, 195, 199,
    ],
    [PlayerPedHash.Female]: [
        18, 37, 46, 49, 50, 51, 52, 62, 72, 77, 79, 81, 90, 110, 114, 122, 124, 127, 128, 132, 133, 143, 194, 198,
    ],
};

@Provider()
export class PlayerHeatProvider {
    @Inject('Store')
    public store: Store;

    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(NuiDispatch)
    public nuiDispatch: NuiDispatch;

    @Inject(ClothingService)
    public clothingService: ClothingService;

    @Inject(Notifier)
    public notifier: Notifier;

    @Inject(HudWeatherIconProvider)
    public hudWeatherIconProvider: HudWeatherIconProvider;

    @Inject(BlurService)
    public blurService: BlurService;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    private heatDeath = false;
    private damage = false;
    private heat = false;
    private sandstorm = false;
    private heatScore = 0;
    private sandStormProtected = false;

    @On('soz-character:Client:Cloth:Applied')
    async onClothUpdate(outfit: Outfit): Promise<void> {
        if (!this.featureProvider.isFeatureEnabled(Feature.SummerHeat)) {
            return;
        }
        if (this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        let newheatScore = 0;
        if (player.metadata.scuba) {
            this.heatScore = newheatScore;
            this.sandStormProtected = true;
            return;
        }

        for (const skipOutfit of SkipWarnCloths[player.skin.Model.Hash]) {
            if (
                outfit.Components[Component.Tops].Drawable == skipOutfit.Components[Component.Tops].Drawable &&
                outfit.Components[Component.Tops].Collection == skipOutfit.Components[Component.Tops].Collection
            ) {
                newheatScore = -10;
                break;
            }
        }

        const data = await emitRpc<Partial<Record<Component, number>>>(
            RpcServerEvent.CLOTHING_GET_WARM_SCORE,
            outfit.Components
        );
        if (!data) {
            return;
        }

        [Component.Tops, Component.Legs, Component.Shoes].forEach(component => {
            if (data[component] == null) {
                const extra = ExtraWarnCloths[player.skin.Model.Hash].find(
                    item =>
                        item.Components[component] &&
                        outfit.Components[component] &&
                        item.Components[component].Drawable == outfit.Components[component].Drawable
                );
                if (extra) {
                    newheatScore += 3;
                }
            } else {
                newheatScore += data[component];
            }
        });

        if (this.clothingService.checkWearingGloves()) {
            newheatScore++;
        }

        const jewels = player.skin.Model.Hash == PlayerPedHash.Male ? MaleJewelryItems : FemaleJewelryItems;
        const neckJewels = jewels['Accessoires'];
        const scarfs = Object.keys(neckJewels.items['Echarpes']).map(item => Number(item));
        const neckProtected = scarfs.includes(outfit.Components[neckJewels.componentId].Drawable);
        if (neckProtected) {
            newheatScore++;
        }

        const helmetJewels = jewels['Chapeaux'];
        const helmets = Object.keys(helmetJewels.items['Bonnets']).map(item => Number(item));
        const headProtected = helmets.includes(outfit.Props[helmetJewels.propId]?.Drawable);
        if (headProtected) {
            newheatScore++;
        }

        this.sandStormProtected = false;
        const maskEyeList =
            outfit.Components[Component.Mask]?.Collection === 'soz_bcso' ? maskEyesBCSOProtected : maskEyesProtected;

        if (
            hatProtected[player.skin.Model.Hash].includes(outfit.Props[Prop.Hat]?.Drawable) ||
            maskEyeList.includes(outfit.Components[Component.Mask]?.Drawable)
        ) {
            this.sandStormProtected = true;
        } else if (
            !maskMouthNotProtected.includes(outfit.Components[Component.Mask]?.Drawable)
            //&& outfit.Props[Prop.Glasses]?.Drawable > 0
        ) {
            this.sandStormProtected = true;
        }

        this.heatScore = newheatScore;
    }

    @Tick(TickInterval.EVERY_SECOND)
    public onCheckHeat() {
        if (!this.featureProvider.isFeatureEnabled(Feature.SummerHeat)) {
            return;
        }
        if (this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }
        this.damage = false;

        const playerPed = PlayerPedId();
        if (GetInteriorFromEntity(playerPed) != 0) {
            this.hudWeatherIconProvider.remove('heat');
            this.heat = false;
            this.hudWeatherIconProvider.remove('sandstorm');
            this.sandstorm = false;
            this.blurService.remove('heat', 1000);
            return;
        }

        const veh = GetVehiclePedIsIn(playerPed, false);
        const model = GetEntityModel(veh);
        if (veh && !IsThisModelABike(model) && !IsThisModelAQuadbike(model)) {
            this.hudWeatherIconProvider.remove('heat');
            this.heat = false;
            this.hudWeatherIconProvider.remove('sandstorm');
            this.sandstorm = false;
            this.blurService.remove('heat', 1000);
            return;
        }

        const weather = this.store.getState().global.weather;
        if (weather == 'BLIZZARD') {
            this.hudWeatherIconProvider.remove('heat');
            this.heat = false;
            this.blurService.remove('heat', 1000);
            if (!this.sandStormProtected) {
                this.damage = true;
                if (!this.sandstorm) {
                    this.notifier.notify(
                        'La tempête fouette votre visage, trouvez de quoi vous protéger la bouche et les yeux',
                        'warning'
                    );
                }
                this.hudWeatherIconProvider.add('sandstorm');
                this.sandstorm = true;
            } else {
                this.hudWeatherIconProvider.remove('sandstorm');
                this.sandstorm = false;
            }
        } else {
            this.hudWeatherIconProvider.remove('sandstorm');
            this.sandstorm = false;
            if (this.heatScore >= 6) {
                this.damage = true;
                if (!this.heat) {
                    this.notifier.notify('Vous commencez à transpirer due à la forte chaleur', 'warning');
                }
                this.hudWeatherIconProvider.add('heat');
                this.heat = true;
                this.blurService.add('heat', 1000);
            } else {
                this.hudWeatherIconProvider.remove('heat');
                this.heat = false;
                this.blurService.remove('heat', 1000);
            }
        }
    }

    @Tick(10_000)
    public onHeatTick() {
        if (!this.featureProvider.isFeatureEnabled(Feature.SummerHeat)) {
            return;
        }
        if (this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const playerPed = PlayerPedId();
        const veh = GetVehiclePedIsIn(playerPed, false);
        if (veh) {
            const weather = this.store.getState().global.weather;
            if (weather == 'BLIZZARD') {
                const model = GetEntityModel(veh);
                if (IsThisModelAHeli(model) && IsVehicleEngineOn(veh)) {
                    SetVehicleEngineHealth(veh, GetVehicleEngineHealth(veh) - 20.0);
                }
            }
        }

        if (!this.damage) {
            return;
        }

        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        if (player.metadata.godmode) {
            return;
        }

        if (player.metadata.isdead) {
            return;
        }

        const newHealth = GetEntityHealth(playerPed) - 1;
        this.heatDeath = newHealth <= 100;
        SetEntityHealth(playerPed, newHealth);
    }

    public isHeatDeath() {
        return this.heatDeath;
    }
}
