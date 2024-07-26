import { Inject, Injectable } from '@core/decorators/injectable';
import { DrugSkill } from '@private/shared/drugs';
import { PlayerLoader } from '@public/core/loader/player.loader';
import { PatientClothes } from '@public/shared/job/lsmc';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';

import { Outfit } from '../../shared/cloth';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { FakeId, PlayerClientState, PlayerData, PlayerLicenceType } from '../../shared/player';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
import { Qbcore } from '../qbcore';

@Injectable()
export class PlayerService {
    @Inject(Notifier)
    private notifier: Notifier;

    private player: PlayerData | null = null;
    private fakeId: FakeId = null;
    private deguisement = false;
    private pushing = false;

    private state: PlayerClientState = {
        isDead: false,
        isEscorted: false,
        isEscorting: false,
        isHandcuffed: false,
        isInHub: false,
        isInSportClothes: false,
        isInHospital: false,
        isInShop: false,
        isInventoryBusy: false,
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

    @Inject(PlayerLoader)
    private playerLoader: PlayerLoader;

    public setPlayer(player: PlayerData) {
        this.player = player;

        this.playerLoader.trigger(player);
        this.nuiDispatch.dispatch('player', 'Update', player);
    }

    public isLoggedIn(): boolean {
        return this.player !== null;
    }

    public getPlayer(): PlayerData | null {
        return this.player;
    }

    public hasDrugSkill(skill: DrugSkill): boolean {
        const player = this.getPlayer();

        if (!player) {
            return false;
        }

        return player.metadata.drugs_skills.includes(skill);
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

    /**
     * Get the closest player
     *
     * @returns [number, number] - [playerId, distance]
     */
    public getClosestPlayer(): [number, number] {
        return this.qbcore.getClosestPlayer();
    }

    public setTempClothes(clothes: Outfit | null) {
        const player = this.getPlayer();
        const state = this.getState();
        if (state.isWearingPatientOutfit) {
            clothes = {
                Components: {
                    ...PatientClothes[player.skin.Model.Hash]['Patient'].Components,
                    ...clothes?.Components,
                },
                Props: {
                    ...PatientClothes[player.skin.Model.Hash]['Patient'].Props,
                    ...clothes?.Props,
                },
                GlovesID: clothes?.GlovesID,
                TopID: clothes?.TopID,
            };
        }

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

    public getPlayersAround(
        position: Vector3,
        distance: number,
        filterself = false,
        filter: (number) => boolean = null
    ): number[] {
        const players = GetActivePlayers() as number[];
        const playerId = PlayerId();
        const closePlayers = [];

        for (const player of players) {
            if (playerId == player && filterself) {
                continue;
            }

            const ped = GetPlayerPed(player);
            const pedCoords = GetEntityCoords(ped) as Vector3;
            const playerDistance = getDistance(position, pedCoords);

            if (playerDistance <= distance && (!filter || filter(player))) {
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

    public setDeguisement(value: boolean) {
        this.deguisement = value;
    }

    public hasDeguisement() {
        return this.deguisement;
    }

    public setPushing(value: boolean) {
        this.pushing = value;
    }

    public isPushing() {
        return this.pushing;
    }
}
