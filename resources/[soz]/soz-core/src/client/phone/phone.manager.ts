import { Command } from '@core/decorators/command';
import { Inject } from '@core/decorators/injectable';
import { PlayerInventoryUpdate } from '@core/decorators/player';
import { Provider } from '@core/decorators/provider';
import { Tick, TickInterval } from '@core/decorators/tick';
import { PlayerTalentService } from '@private/client/player/player.talent.service';
import { PoliceSwatProvider } from '@private/client/police/police.swat.provider';
import { MineSweeperRobotProvider } from '@private/client/vehicle/minesweeper.provider';
import { PhoneState } from '@public/client/phone/phone.state';
import { SceneProvider } from '@public/client/scene/scene.provider';
import { OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { ClientEvent } from '@public/shared/event/client';
import { NuiEvent } from '@public/shared/event/nui';

import { Control } from '../../shared/input';
import { HousingFournitureProvider } from '../housing/housing.fourniture.provider';
import { InventoryManager } from '../inventory/inventory.manager';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';
import { StateSelector } from '../store/store';
import { PhoneService } from './phone.service';
import { PhoneSimCardCalls } from './phone.simcard.calls';

@Provider()
export class PhoneManager {
    @Inject(PhoneState)
    private phoneState: PhoneState;

    @Inject(PhoneService)
    private readonly phoneService: PhoneService;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(InventoryManager)
    private readonly inventoryManager: InventoryManager;

    @Inject(SceneProvider)
    private readonly sceneProvider: SceneProvider;

    @Inject(HousingFournitureProvider)
    private readonly housingFournitureProvider: HousingFournitureProvider;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    @Inject(PhoneSimCardCalls)
    private readonly phoneSimCardCalls: PhoneSimCardCalls;

    @Inject(PlayerTalentService)
    private readonly playerTalentService: PlayerTalentService;

    @Inject(MineSweeperRobotProvider)
    private readonly mineSweeperRobotProvider: MineSweeperRobotProvider;

    @Inject(PoliceSwatProvider)
    private readonly policeSwatProvider: PoliceSwatProvider;

    private isInsideInput = false;

    @StateSelector(state => state.global.blackout, state => state.global.blackoutLevel)
    async onBlackout(blackout: boolean, blackoutLevel: number) {
        const inBlackout = blackout || blackoutLevel >= 3;

        this.phoneService.setPhoneDisabled('blackout', inBlackout);
        if (!inBlackout) return;

        await this.stopPhoneCall();
        if (this.phoneState.isPhoneOpen()) {
            await this.hidePhone();
        }
    }

    @Tick()
    async onTick() {
        if (!IsControlJustPressed(0, Control.PhoneSelect)) return;

        this.nuiDispatch.dispatch('phone', 'SetPhoneFreeCamera', false);
    }

    @Tick(TickInterval.EVERY_SECOND)
    async ensureAvailability() {
        const ped = PlayerPedId();
        const isSwimming = IsPedSwimming(ped);
        const isInSubmarine = IsPedInAnySub(ped);

        if (isSwimming && !isInSubmarine && !this.phoneState.isPhoneDrowned()) {
            await this.stopPhoneCall();
            this.phoneState.setPhoneDrowned(true);
        } else if ((!isSwimming || isInSubmarine) && this.phoneState.isPhoneDrowned()) {
            this.phoneState.setPhoneDrowned(false);
        }

        const playerState = this.playerService.getState();
        if (playerState.isInventoryBusy) {
            if (this.phoneState.isPhoneOpen()) {
                await this.hidePhone();
            }
        }
    }

    @PlayerInventoryUpdate()
    public updatePlayerInventory() {
        const hasPhone = this.inventoryManager.hasEnoughItem('phone', 1);
        const hasDongle = this.inventoryManager.hasEnoughItem('cyber_darkweb_module', 1);

        this.phoneService.setPhoneDisabled('item_phone', !hasPhone);
        this.nuiDispatch.dispatch('phone', 'SetAvailability', hasPhone);
        this.nuiDispatch.dispatch('phone', 'AppDarkWebHasDongle', hasDongle);
    }

    @OnNuiEvent(NuiEvent.PhoneInsideInput)
    @OnEvent(ClientEvent.PHONE_IS_INSIDE_INPUT)
    async onPhoneInsideInput({ insideInput }: { insideInput: boolean }) {
        this.isInsideInput = insideInput;
    }

    @OnNuiEvent(NuiEvent.PhoneSetPropModel)
    async onPhoneSetPropModel({ frame }: { frame: string }) {
        switch (frame) {
            case 'gold.webp':
                this.phoneState.setPhonePropModel('soz_phone_gold');
                break;
            case 'natural.webp':
                this.phoneState.setPhonePropModel('soz_phone_natural');
                break;
            case 'white.webp':
                this.phoneState.setPhonePropModel('soz_phone_white');
                break;
            case 'casino_diamond.webp':
                this.phoneState.setPhonePropModel('soz_phone_diamond');
                break;
            case 'black.webp':
            default:
                this.phoneState.setPhonePropModel('soz_phone_black');
        }
    }

    @OnNuiEvent(NuiEvent.PhoneFlashLight)
    async onPhoneFlashLight(enabled: boolean) {
        this.phoneState.setPhoneFlashlightEnabled(enabled);
    }

    @OnEvent(ClientEvent.PLAYER_ON_DEATH)
    async onPlayerDeath(killData: any) {
        if (this.phoneState.isPhoneOpen()) {
            await this.hidePhone();
        }

        if (this.phoneState.isInCall()) {
            await this.stopPhoneCall();
        }

        this.nuiDispatch.dispatch('phone', 'SetEmergency', true);

        const player = this.playerService.getPlayer();
        if (
            (player.metadata.rp_death && !killData.hungerThristDeath && !killData.frozenDeath) ||
            player.metadata.injuries_count >= this.playerTalentService.getMaxInjuries()
        ) {
            this.nuiDispatch.dispatch('phone', 'SetEmergencyDeath', ' ');
        }
    }

    @OnEvent(ClientEvent.INJURY_DEATH)
    async onInjuryDeath(reason: string) {
        this.nuiDispatch.dispatch('phone', 'SetEmergencyDeath', reason);
    }

    @OnEvent(ClientEvent.LSMC_REVIVE)
    async onRevive(_skipanim: boolean, _uniteHU: boolean, _uniteHUBed: number, rpDeath: boolean) {
        if (rpDeath) return;

        this.nuiDispatch.dispatch('phone', 'SetEmergency', false);
        this.nuiDispatch.dispatch('phone', 'SetEmergencyDeath', null);
    }

    @Command('phone', {
        description: 'Afficher le téléphone',
        passthroughNuiFocus: true,
        keys: [
            {
                mapper: 'keyboard',
                key: 'L',
            },
        ],
    })
    async togglePhone() {
        if (
            this.sceneProvider.isEditingScene() ||
            this.housingFournitureProvider.isHousingEditorModeActive() ||
            this.mineSweeperRobotProvider.isUsingRobot() ||
            this.policeSwatProvider.isUsingShield()
        ) {
            return;
        }

        if (this.phoneState.isPhoneOpen() && !this.isInsideInput) {
            return this.hidePhone();
        }

        const playerState = this.playerService.getState();
        if (!playerState.isDead) {
            if (this.phoneState.isPhoneDrowned()) return;
            if (this.phoneState.isPhoneDisabled()) return;

            if (!this.hasPlayerPhone()) return;
        } else {
            this.nuiDispatch.dispatch('phone', 'SetAvailability', true);
        }

        return this.showPhone();
    }

    private async showPhone() {
        this.phoneState.setPhoneOpen(true);
    }

    public async hidePhone() {
        this.phoneState.setPhoneFrontCameraEnabled(false);
        this.phoneState.setPhoneFlashlightEnabled(false);
        this.phoneState.setPhoneOpen(false);
        this.isInsideInput = false;
    }

    public async stopPhoneCall() {
        if (!this.phoneState.isInCall()) return;

        return this.phoneSimCardCalls.onCallEnd(this.phoneState.getCurrentCall()?.transmitter);
    }

    private hasPlayerPhone() {
        if (IsPauseMenuActive()) {
            return false;
        }

        const hasPhone = this.inventoryManager.hasEnoughItem('phone', 1);
        if (!hasPhone) {
            this.notifier.error("Vous n'avez pas de téléphone");
            return false;
        }

        const playerState = this.playerService.getState();
        if (playerState.isInventoryBusy) {
            this.notifier.error('Action en cours');
            return false;
        }

        const player = this.playerService.getPlayer();
        if (player.metadata.inlaststand || player.metadata.ishandcuffed) {
            this.notifier.error('Vous ne pouvez pas accéder à votre téléphone');
            return false;
        }

        return true;
    }
}
