import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { PlayerService } from '@public/client/player/player.service';
import { ResourceLoader } from '@public/client/resources/resource.loader';
import { On, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { emitRpc } from '@public/core/rpc';
import { wait } from '@public/core/utils';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { rad, Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

const AllowedJob = [JobType.FBI, JobType.BCSO, JobType.LSPD];
const WEAPON_DIGISCANNER = -38085395;
const RadarRange = 40;

@Provider()
export class PoliceProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(NuiDispatch)
    private dispatcher: NuiDispatch;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    private radarEnabled = false;
    private inTakedown = false;
    private clearTakedown = false;

    @OnEvent(ClientEvent.TAKE_DOWN)
    public async takeDown() {
        const player = this.playerService.getPlayer();
        const playerPed = PlayerPedId();

        if (this.inTakedown) {
            this.clearTakedown = true;
            return;
        }
        this.inTakedown = true;
        this.clearTakedown = false;

        if (player && AllowedJob.includes(player.job.id)) {
            this.getFrontPlayer(playerPed);
        }

        this.resourceLoader.loadAnimationDictionary('anim@sports@ballgame@handball@');

        TaskPlayAnim(
            playerPed,
            'anim@sports@ballgame@handball@',
            'ball_rstop_r',
            8.0,
            -8.0,
            -1,
            262144,
            0,
            false,
            false,
            false
        );

        const animDuration = GetAnimDuration('anim@sports@ballgame@handball@', 'ball_rstop_r');
        await wait(animDuration * 1000);
        if (!this.clearTakedown) {
            TaskPlayAnim(
                playerPed,
                'anim@sports@ballgame@handball@',
                'ball_get_up',
                8.0,
                -8.0,
                -1,
                262144,
                0,
                false,
                false,
                false
            );

            const animDuration2 = GetAnimDuration('anim@sports@ballgame@handball@', 'ball_get_up');
            await wait(animDuration2 * 1000 - 2000);
        }

        ClearPedTasks(playerPed);
        this.inTakedown = false;
    }

    public getFrontPlayer(playerPed: number) {
        const coords = GetEntityCoords(playerPed);
        const heading = GetEntityHeading(playerPed);
        const playerId = PlayerId();

        const zone = new BoxZone(
            [coords[0] - 3 * Math.sin(rad(heading)), coords[1] + 3 * Math.cos(rad(heading)), coords[2]],
            6,
            4,
            {
                heading: heading,
                minZ: coords[2] - 3,
                maxZ: coords[2] + 3,
            }
        );

        for (const player of GetActivePlayers()) {
            if (playerId == player) {
                continue;
            }

            const ped = GetPlayerPed(player);
            const targetCoords = GetEntityCoords(ped) as Vector3;
            if (zone.isPointInside(targetCoords)) {
                const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(ped));
                TriggerServerEvent(ServerEvent.POLICE_TAKE_DOWN, target);
                break;
            }
        }
    }

    @OnEvent(ClientEvent.TAKE_DOWN_TARGET)
    public async takeDownTarget() {
        const playerPed = PlayerPedId();
        SetPedToRagdoll(playerPed, 10000, 10000, 0, false, false, false);
    }

    @OnEvent(ClientEvent.POLICE_MOBILE_RADAR)
    public async mobileRadar() {
        const playerPed = PlayerPedId();
        this.radarEnabled = !this.radarEnabled;
        this.dispatcher.dispatch('police', 'SetRadarOpen', this.radarEnabled);
        if (this.radarEnabled) {
            if (GetSelectedPedWeapon(playerPed) != GetHashKey('WEAPON_UNARMED')) {
                SetCurrentPedWeapon(playerPed, GetHashKey('WEAPON_UNARMED'), true);
                await wait(2000);
            }
            GiveWeaponToPed(playerPed, WEAPON_DIGISCANNER, 1, true, true);
            SetCurrentPedWeapon(playerPed, WEAPON_DIGISCANNER, true);
            await wait(2000);
            this.loop(playerPed);
        } else {
            this.closeMobileRadar(playerPed);
        }
    }

    public async closeMobileRadar(playerPed: number) {
        this.dispatcher.dispatch('police', 'SetRadarOpen', false);
        this.radarEnabled = false;
        RemoveWeaponFromPed(playerPed, WEAPON_DIGISCANNER);
    }

    public async loop(playerPed: number) {
        while (this.radarEnabled) {
            if (!this.inventoryManager.hasEnoughItem('mobile_radar')) {
                this.closeMobileRadar(playerPed);
                return;
            }

            if (!IsPedInAnyVehicle(playerPed, true)) {
                if (WEAPON_DIGISCANNER != GetSelectedPedWeapon(playerPed)) {
                    this.closeMobileRadar(playerPed);
                    return;
                }
                if (!IsPlayerFreeAiming(PlayerId())) {
                    this.dispatcher.dispatch('police', 'UpdateRadar', ' - VISER UN VEHICULE - ');
                    await wait(50);
                    continue;
                }
            }

            const coords = GetEntityCoords(playerPed);
            const target = GetOffsetFromEntityInWorldCoords(playerPed, 0.0, RadarRange, 0.0);
            const rayHandle = StartShapeTestCapsule(
                coords[0],
                coords[1],
                coords[2],
                target[0],
                target[1],
                target[2],
                1.5,
                2,
                playerPed,
                0
            );
            let result: number[];
            do {
                result = GetShapeTestResult(rayHandle);
                await wait(0);
            } while (result[0] == 1);

            if (result[0] == 2) {
                let speedMessage = '';
                if (result[1]) {
                    speedMessage = (GetEntitySpeed(result[4]) * 3.6).toFixed(2) + ' KM/H';
                }
                this.dispatcher.dispatch('police', 'UpdateRadar', speedMessage);

                if (result[1]) {
                    await wait(1000);
                }
            }
            await wait(50);
        }
    }

    @On('police:client:breathanalyzer')
    public async breathanalyzer(data) {
        const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(data.entity));

        const alcoolLevel = await emitRpc<number>(RpcServerEvent.POLICE_ALCOOLLEVEL, target);
        this.dispatcher.dispatch('police', 'OpenBreathAnalyzer', alcoolLevel / 20);
    }

    @OnEvent(ClientEvent.POLICE_BREATHANALYZER_TARGET)
    public async breathanalyzerTarget() {
        const playerPed = PlayerPedId();

        const pCoords = GetEntityCoords(playerPed);
        const object = CreateObject(
            GetHashKey('prop_cs_walkie_talkie'),
            pCoords[0] + 1,
            pCoords[1],
            pCoords[2],
            true,
            true,
            true
        );
        SetEntityAsMissionEntity(object, true, true);
        AttachEntityToEntity(
            object,
            playerPed,
            GetPedBoneIndex(playerPed, 28422),
            0.0,
            0.0,
            0.0,
            0.0,
            90.0,
            0.0,
            true,
            true,
            false,
            true,
            1,
            true
        );

        await this.resourceLoader.loadAnimationDictionary(
            'amb@code_human_in_car_mp_actions@first_person@smoke@std@ds@base'
        );
        await this.resourceLoader.loadAnimationDictionary(
            'amb@code_human_in_car_mp_actions@first_person@smoke@std@rps@base'
        );
        TaskPlayAnim(
            playerPed,
            'amb@code_human_in_car_mp_actions@first_person@smoke@std@ds@base',
            'enter',
            8.0,
            8.0,
            -1,
            0,
            0.0,
            false,
            false,
            false
        );
        let animDuration = GetAnimDuration('amb@code_human_in_car_mp_actions@first_person@smoke@std@ds@base', 'enter');
        await wait(animDuration * 1000);
        TaskPlayAnim(
            playerPed,
            'amb@code_human_in_car_mp_actions@first_person@smoke@std@rps@base',
            'exit',
            8.0,
            8.0,
            -1,
            0,
            0.0,
            false,
            false,
            false
        );

        animDuration = GetAnimDuration('amb@code_human_in_car_mp_actions@first_person@smoke@std@rps@base', 'exit');
        await wait(animDuration * 1000);
        DeleteEntity(object);
    }
}
