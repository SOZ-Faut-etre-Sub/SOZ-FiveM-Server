import { Inject, Injectable } from '@core/decorators/injectable';
import { CardType } from '@public/shared/nui/card';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';

import { Outfit } from '../../shared/cloth';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { FakeId, PlayerClientState, PlayerData, PlayerLicenceType } from '../../shared/player';
import { AnimationService } from '../animation/animation.service';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
import { Qbcore } from '../qbcore';

@Injectable()
export class PlayerService {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(AnimationService)
    private animationService: AnimationService;

    private player: PlayerData | null = null;
    private fakeId: FakeId = null;

    private state: PlayerClientState = {
        isDead: false,
        isEscorted: false,
        isEscorting: false,
        isHandcuffed: false,
        isInHub: false,
        isInHospital: false,
        isInShop: false,
        isInventoryBusy: false,
        tankerEntity: null,
        disableMoneyCase: false,
        hasPrisonerClothes: false,
        isWearingPatientOutfit: false,
        isZipped: false,
        isLooted: false,
        escorting: null,
        carryBox: false,
    };

    @Inject(Qbcore)
    private qbcore: Qbcore;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    public setPlayer(player: PlayerData) {
        this.player = player;
        TriggerEvent(ClientEvent.PLAYER_UPDATE.toString(), player);
        this.nuiDispatch.dispatch('player', 'Update', player);
    }

    public isLoggedIn(): boolean {
        return this.player !== null;
    }

    public getPlayer(): PlayerData | null {
        return this.player;
    }

    public getState(): PlayerClientState {
        return { ...this.state };
    }

    public setState(state: PlayerClientState) {
        this.state = { ...state };
    }

    public updateState(state: Partial<PlayerClientState>) {
        TriggerServerEvent(ServerEvent.PLAYER_UPDATE_STATE, state);
    }

    public isOnDuty(): boolean {
        return this.player.job.onduty;
    }

    public getClosestPlayer(): [number, number] {
        return this.qbcore.getClosestPlayer();
    }

    public setTempClothes(clothes: Outfit | null) {
        TriggerEvent(ClientEvent.CHARACTER_SET_TEMPORARY_CLOTH, clothes || {});
    }

    public reApplyHeadConfig() {
        exports['soz-character'].ReApplyHeadConfig();
    }

    public resetClothConfig() {
        TriggerEvent('soz-character:Client:ApplyCurrentClothConfig');
    }

    public canDoAction(): boolean {
        return !this.state.isDead && !this.state.isHandcuffed && !this.state.isZipped && !this.state.isEscorting;
    }

    public getPlayersAround(position: Vector3, distance: number): number[] {
        const players = GetActivePlayers() as number[];
        const closePlayers = [];

        for (const player of players) {
            const ped = GetPlayerPed(player);
            const pedCoords = GetEntityCoords(ped) as Vector3;
            const playerDistance = getDistance(position, pedCoords);

            if (playerDistance <= distance) {
                closePlayers.push(GetPlayerServerId(player));
            }
        }

        return closePlayers;
    }

    public getId() {
        const player = { ...this.getPlayer() };
        if (this.fakeId) {
            player.charinfo = this.fakeId.charinfo;
            player.address = this.fakeId.address;
            player.job.id = this.fakeId.job;
            player.metadata.licences = {
                ...player.metadata.licences,
                boat: this.fakeId.licenses[PlayerLicenceType.Boat],
                car: this.fakeId.licenses[PlayerLicenceType.Car],
                heli: this.fakeId.licenses[PlayerLicenceType.Heli],
                motorcycle: this.fakeId.licenses[PlayerLicenceType.Moto],
                truck: this.fakeId.licenses[PlayerLicenceType.Truck],
            };
        }

        return player;
    }

    public async showCard(type: CardType) {
        const position = GetEntityCoords(PlayerPedId()) as Vector3;
        const players = this.getPlayersAround(position, 3.0);

        if (players.length <= 1) {
            this.notifier.notify("Il n'y a personne à proximité", 'error');
            return;
        }

        const player = this.getId();
        await this.animationService.playAnimation({
            base: {
                dictionary: 'mp_common',
                name: 'givetake2_a',
                blendInSpeed: 8.0,
                blendOutSpeed: 8.0,
                options: {
                    enablePlayerControl: true,
                    onlyUpperBody: true,
                },
            },
        });

        TriggerServerEvent(ServerEvent.PLAYER_SHOW_IDENTITY, type, players, player);
    }

    public toogleFakeId(fakeId: FakeId) {
        if (!fakeId || (this.fakeId && this.fakeId.id == fakeId.id)) {
            this.fakeId = null;
            this.notifier.notify("La fausse identitée n'est ~r~plus active~s~", 'warning');
        } else {
            this.fakeId = fakeId;
            this.notifier.notify('La fausse identitée est ~g~active~s~', 'success');
        }
    }

    public getFakeId() {
        return this.fakeId;
    }
}
