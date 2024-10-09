import { Command } from '@core/decorators/command';
import { OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { SozRole } from '@core/permissions';
import { FlyingCameraProvider } from '@public/client/camera/flying.camera.provider';
import { OrbitalCameraProvider } from '@public/client/camera/orbital.camera.provider';
import { Monitor } from '@public/client/monitor/monitor';
import { Notifier } from '@public/client/notifier';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { VoipService } from '@public/client/voip/voip.service';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { AdminPlayer } from '@public/shared/admin/admin';
import { NuiEvent, ServerEvent } from '@public/shared/event';
import { Vector3 } from '@public/shared/polyzone/vector';

@Provider()
export class AdminSpectateProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(VoipService)
    private voipService: VoipService;

    @Inject(FlyingCameraProvider)
    private flyingCameraProvider: FlyingCameraProvider;

    @Inject(OrbitalCameraProvider)
    private orbitalCameraProvider: OrbitalCameraProvider;

    public ped: number = null;
    private flyingCamera: number;
    private orbitalCamera: number;

    @OnNuiEvent(NuiEvent.AdminMenuPlayerSpectate)
    public async spectate(player: AdminPlayer): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_SPECTATE_PLAYER, player);
    }

    public async spectatePlayer(player: AdminPlayer, position: Vector3): Promise<void> {
        if (GetPlayerServerId(NetworkGetPlayerIndexFromPed(PlayerPedId())) === player.id) {
            return;
        }

        SetEntityCoords(PlayerPedId(), position[0], position[1], position[2] - 5, false, false, false, false);
        await wait(10);

        const target = GetPlayerPed(GetPlayerFromServerId(player.id));
        if (!target || target === PlayerPedId()) {
            return;
        }

        await this.initSpectate();
        this.flyingCamera = this.flyingCameraProvider.createCamera(6.25, false);
        this.orbitalCamera = this.orbitalCameraProvider.createCamera(target);
        this.ped = target;

        this.nuiMenu.closeMenu();
        this.notifier.notify(
            `Vous êtes maintenant en mode spectateur sur ~g~${player.rpFullName} (${player.name}).`,
            'info'
        );
        this.monitor.traceEvent('admin_spectate', {
            target_source: player.id,
        });
    }

    @Tick(TickInterval.EVERY_FRAME)
    public spectateLoop() {
        if (!this.flyingCamera || !this.orbitalCamera || !this.ped) {
            return;
        }

        const position = GetEntityCoords(this.ped);
        SetEntityCoords(PlayerPedId(), position[0], position[1], position[2] - 5, false, false, false, false);
    }

    private async initSpectate() {
        FreezeEntityPosition(PlayerPedId(), true);
        await this.voipService.mutePlayer(true);
    }

    private async terminateSpectate() {
        FreezeEntityPosition(PlayerPedId(), false);
        await this.voipService.mutePlayer(false);
    }

    @Command('admin_swap_spectate_cam', {
        role: ['admin', 'staff'] as SozRole[],
        keys: [
            {
                mapper: 'keyboard',
                key: 'Tab',
            },
        ],
    })
    public swapCamMode() {
        if (!this.flyingCamera || !this.orbitalCamera) {
            return;
        }

        if (!IsCamActive(this.flyingCamera)) {
            const [x, y, z] = GetCamCoord(this.orbitalCamera);
            SetCamCoord(this.flyingCamera, x, y, z);

            const [rotX, rotY, rotZ] = GetCamRot(this.orbitalCamera, 0);
            SetCamRot(this.flyingCamera, rotX, rotY, rotZ, 0);

            SetCamActive(this.orbitalCamera, false);
            SetCamActive(this.flyingCamera, true);
        } else if (!IsCamActive(this.orbitalCamera)) {
            SetCamActive(this.flyingCamera, false);
            SetCamActive(this.orbitalCamera, true);
        }
    }

    @Command('admin_leave_spectate', {
        role: ['admin', 'staff'] as SozRole[],
        keys: [
            {
                mapper: 'keyboard',
                key: 'BACK',
            },
        ],
    })
    public leaveSpactate() {
        if (this.isNotSpectating()) {
            return;
        }

        this.flyingCameraProvider.deleteCamera();
        this.orbitalCameraProvider.deleteCamera();

        this.ped = null;
        this.flyingCamera = null;
        this.orbitalCamera = null;

        this.terminateSpectate();
        this.notifier.notify(`Arrêt du mode observateur.`, 'info');
    }

    public isNotSpectating(): boolean {
        return !this.ped && !this.flyingCamera && !this.orbitalCamera;
    }
}
