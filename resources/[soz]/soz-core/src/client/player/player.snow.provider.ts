import { Provider } from '@core/decorators/provider';
import { FemaleJewelryItems, MaleJewelryItems } from '@public/config/jewelry';
import { On } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { Component, Outfit } from '@public/shared/cloth';
import { Feature } from '@public/shared/features';
import { joaat } from '@public/shared/joaat';
import { JobType } from '@public/shared/job';
import { HAZMAT_OUTFIT_NAME, LsmcCloakroom } from '@public/shared/job/lsmc';
import { ObjectOutFits, POLICE_CLOAKROOM } from '@public/shared/job/police';
import { StonkCloakroom } from '@public/shared/job/stonk';
import { PlayerPedHash } from '@public/shared/player';
import { RpcServerEvent } from '@public/shared/rpc';
import { Weather } from '@public/shared/weather';

import { ClothingService } from '../clothing/clothing.service';
import { FeatureProvider } from '../feature/feature.provider';
import { HudWeatherIconProvider } from '../hud/hud.weathericon.provider';
import { NuiDispatch } from '../nui/nui.dispatch';
import { Store } from '../store/store';
import { PlayerService } from './player.service';

const ColdWeather: Weather[] = ['BLIZZARD', 'SNOW', 'SNOWLIGHT', 'XMAS'];

const ExtraWarnCloths: Record<number, Outfit[]> = {
    [joaat('mp_m_freemode_01')]: [
        POLICE_CLOAKROOM[JobType.LSPD][joaat('mp_m_freemode_01')]['Tenue Hiver'],
        POLICE_CLOAKROOM[JobType.LSPD][joaat('mp_m_freemode_01')]['Tenue de pilote'],
        POLICE_CLOAKROOM[JobType.LSPD][joaat('mp_m_freemode_01')]['Tenue de moto'],
        ObjectOutFits[JobType.LSPD][joaat('mp_m_freemode_01')]['light_intervention_outfit'],
        ObjectOutFits[JobType.LSPD][joaat('mp_m_freemode_01')]['heavy_antiriot_outfit'],
        POLICE_CLOAKROOM[JobType.BCSO][joaat('mp_m_freemode_01')]['Tenue Hiver'],
        POLICE_CLOAKROOM[JobType.BCSO][joaat('mp_m_freemode_01')]['Tenue de pilote'],
        POLICE_CLOAKROOM[JobType.BCSO][joaat('mp_m_freemode_01')]['Tenue de moto'],
        ObjectOutFits[JobType.BCSO][joaat('mp_m_freemode_01')]['light_intervention_outfit'],
        ObjectOutFits[JobType.BCSO][joaat('mp_m_freemode_01')]['heavy_antiriot_outfit'],
        LsmcCloakroom[joaat('mp_m_freemode_01')]['Tenue incendie'],
        LsmcCloakroom[joaat('mp_m_freemode_01')][HAZMAT_OUTFIT_NAME],
        LsmcCloakroom[joaat('mp_m_freemode_01')]['Tenue Hiver'],
        StonkCloakroom[joaat('mp_m_freemode_01')]['Tenue Hiver'],
    ],
    [joaat('mp_f_freemode_01')]: [
        POLICE_CLOAKROOM[JobType.LSPD][joaat('mp_f_freemode_01')]['Tenue Hiver'],
        POLICE_CLOAKROOM[JobType.LSPD][joaat('mp_f_freemode_01')]['Tenue de pilote'],
        POLICE_CLOAKROOM[JobType.LSPD][joaat('mp_f_freemode_01')]['Tenue de moto'],
        ObjectOutFits[JobType.LSPD][joaat('mp_f_freemode_01')]['light_intervention_outfit'],
        ObjectOutFits[JobType.LSPD][joaat('mp_f_freemode_01')]['heavy_antiriot_outfit'],
        POLICE_CLOAKROOM[JobType.BCSO][joaat('mp_f_freemode_01')]['Tenue Hiver'],
        POLICE_CLOAKROOM[JobType.BCSO][joaat('mp_f_freemode_01')]['Tenue de pilote'],
        POLICE_CLOAKROOM[JobType.BCSO][joaat('mp_f_freemode_01')]['Tenue de moto'],
        ObjectOutFits[JobType.BCSO][joaat('mp_f_freemode_01')]['light_intervention_outfit'],
        ObjectOutFits[JobType.BCSO][joaat('mp_f_freemode_01')]['heavy_antiriot_outfit'],
        LsmcCloakroom[joaat('mp_f_freemode_01')]['Tenue incendie'],
        LsmcCloakroom[joaat('mp_f_freemode_01')][HAZMAT_OUTFIT_NAME],
        LsmcCloakroom[joaat('mp_f_freemode_01')]['Tenue Hiver'],
        StonkCloakroom[joaat('mp_f_freemode_01')]['Tenue Hiver'],
    ],
};

const ExtraCagoule: Record<number, Outfit[]> = {
    [joaat('mp_m_freemode_01')]: [
        ObjectOutFits[JobType.LSPD][joaat('mp_m_freemode_01')]['light_intervention_outfit'],
        ObjectOutFits[JobType.LSPD][joaat('mp_m_freemode_01')]['heavy_antiriot_outfit'],
        ObjectOutFits[JobType.BCSO][joaat('mp_m_freemode_01')]['light_intervention_outfit'],
        ObjectOutFits[JobType.BCSO][joaat('mp_m_freemode_01')]['heavy_antiriot_outfit'],
    ],
    [joaat('mp_f_freemode_01')]: [
        ObjectOutFits[JobType.LSPD][joaat('mp_f_freemode_01')]['light_intervention_outfit'],
        ObjectOutFits[JobType.LSPD][joaat('mp_f_freemode_01')]['heavy_antiriot_outfit'],
        ObjectOutFits[JobType.BCSO][joaat('mp_f_freemode_01')]['light_intervention_outfit'],
        ObjectOutFits[JobType.BCSO][joaat('mp_f_freemode_01')]['heavy_antiriot_outfit'],
    ],
};

@Provider()
export class PlayerSnowProvider {
    @Inject('Store')
    public store: Store;

    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(NuiDispatch)
    public nuiDispatch: NuiDispatch;

    @Inject(ClothingService)
    public clothingService: ClothingService;

    @Inject(HudWeatherIconProvider)
    public hudWeatherIconProvider: HudWeatherIconProvider;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    private lastSlipDate = 0;
    private cold = false;
    private coldProtected = false;
    private blizzardProtected = false;
    private frozenDeath = false;

    @Tick(TickInterval.EVERY_MINUTE)
    public onSlipCheck() {
        if (!this.store.getState().global.snow) {
            return;
        }

        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        if (player.metadata.godmode) {
            return;
        }

        if (Date.now() < this.lastSlipDate + 30 * 60_0000) {
            return;
        }

        const playerPed = PlayerPedId();
        if (IsPedInAnyVehicle(playerPed, true)) {
            return;
        }

        if (!IsPedWalking(playerPed) && !IsPedRunning(playerPed) && !IsPedSprinting(playerPed)) {
            return;
        }

        if (GetInteriorFromEntity(playerPed) != 0) {
            return;
        }

        if (Math.random() < 0.2) {
            SetPedToRagdoll(playerPed, 2000, 2000, 0, false, false, false);
            this.lastSlipDate = Date.now();
        }
    }

    @On('soz-character:Client:Cloth:Applied')
    async onClothUpdate(outfit: Outfit): Promise<void> {
        if (this.featureProvider.isFeatureEnabled(Feature.SummerHeat)) {
            return;
        }

        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        const clothConfig = player.cloth_config.Config;

        if (clothConfig.HidePants || clothConfig.HideShoes || clothConfig.HideTop || clothConfig.Naked) {
            this.coldProtected = false;
            return;
        }

        const data = await emitRpc<Partial<Record<Component, number>>>(
            RpcServerEvent.CLOTHING_GET_WARM_SCORE,
            outfit.Components
        );
        if (!data) {
            return;
        }

        let coldScore = 0;
        [Component.Tops, Component.Legs, Component.Shoes].forEach(component => {
            if (data[component] == null) {
                const extra = ExtraWarnCloths[player.skin.Model.Hash].find(
                    item =>
                        item.Components[component] &&
                        outfit.Components[component] &&
                        item.Components[component].Drawable == outfit.Components[component].Drawable
                );
                if (extra) {
                    coldScore++;
                }
            }
        });

        for (const score of Object.values(data)) {
            if (score == 0) {
                this.coldProtected = false;
                return;
            }
            coldScore + score;
        }

        if (this.clothingService.checkWearingGloves()) {
            coldScore++;
            this.blizzardProtected = true;
        } else {
            this.blizzardProtected = false;
        }

        const hasCustomCagoule = ExtraCagoule[player.skin.Model.Hash].find(
            item =>
                item.Components[Component.Mask] &&
                outfit.Components[Component.Mask] &&
                item.Components[Component.Mask].Drawable == outfit.Components[Component.Mask].Drawable
        );

        const jewels = player.skin.Model.Hash == PlayerPedHash.Male ? MaleJewelryItems : FemaleJewelryItems;
        const neckJewels = jewels['Accessoires'];
        const scarfs = Object.keys(neckJewels.items['Echarpes']).map(item => Number(item));
        const neckProtected = scarfs.includes(outfit.Components[neckJewels.componentId].Drawable);
        if (neckProtected) {
            coldScore++;
        }

        const hatJewels = jewels['Chapeaux'];
        const bonnets = Object.keys(hatJewels.items['Bonnets']).map(item => Number(item));
        const helmetJewels = jewels['Casques'];
        const helmets = Object.keys(helmetJewels.items['Casques']).map(item => Number(item));
        const headProtected =
            bonnets.includes(outfit.Props[hatJewels.propId]?.Drawable) ||
            helmets.includes(outfit.Props[helmetJewels.propId]?.Drawable) ||
            !!hasCustomCagoule ||
            data[Component.Mask] > 1;
        if (headProtected) {
            coldScore++;
        }

        //Cagoule - bandana - écharpes
        if (neckProtected || headProtected) {
            this.blizzardProtected = true;
        } else {
            this.blizzardProtected = false;
        }

        this.coldProtected = coldScore >= 6;
        this.blizzardProtected = this.blizzardProtected && coldScore >= 9;
    }

    private setCold(cold: boolean) {
        if (cold) {
            this.hudWeatherIconProvider.add('snowflake');
        } else {
            this.hudWeatherIconProvider.remove('snowflake');
        }
        this.cold = cold;
    }

    @Tick(TickInterval.EVERY_SECOND)
    public onColdCheckTick() {
        if (this.featureProvider.isFeatureEnabled(Feature.SummerHeat)) {
            return;
        }

        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        if (player.metadata.godmode) {
            this.setCold(false);
            return;
        }

        const weather = this.store.getState().global.weather;
        if (!ColdWeather.includes(weather)) {
            this.setCold(false);
            return;
        }

        const playerPed = PlayerPedId();
        if (GetInteriorFromEntity(playerPed) != 0) {
            this.setCold(false);
            return;
        }

        if (weather == 'BLIZZARD') {
            this.setCold(!this.coldProtected || !this.blizzardProtected);
        } else {
            this.setCold(!this.coldProtected);
        }
    }

    @Tick(10_000)
    public onColdTick() {
        if (!this.cold) {
            return;
        }
        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        if (player.metadata.isdead) {
            return;
        }

        const playerPed = PlayerPedId();
        const newHealth = GetEntityHealth(playerPed) - 1;
        this.frozenDeath = newHealth <= 100;
        SetEntityHealth(playerPed, newHealth);
    }

    public isFrozenDeath() {
        return this.frozenDeath;
    }
}
