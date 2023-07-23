import { Command } from '../../core/decorators/command';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { Vector3 } from '../../shared/polyzone/vector';
import { PlayerService } from '../player/player.service';
import { ResourceLoader } from '../resources/resource.loader';

@Provider()
export class AnimationPointProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private pointing = false;

    @Command('animation_point', {
        description: 'Pointer du doigt',
        keys: [
            {
                mapper: 'keyboard',
                key: 'B',
            },
        ],
    })
    public async togglePoint() {
        const ped = PlayerPedId();

        if (this.pointing) {
            this.pointing = false;
            return;
        }

        if (!this.playerService.canDoAction()) {
            return;
        }

        if (IsPedSittingInAnyVehicle(ped)) {
            return;
        }

        await this.resourceLoader.loadAnimationDictionary('anim@mp_point');
        TaskMoveNetworkByName(ped, 'task_mp_pointing', 0.5, false, 'anim@mp_point', 24);
        this.resourceLoader.unloadAnimationDictionary('anim@mp_point');

        this.pointing = true;

        while (this.pointing) {
            let camPitch = GetGameplayCamRelativePitch();

            if (camPitch < -70.0) {
                camPitch = -70.0;
            } else if (camPitch > 42.0) {
                camPitch = 42.0;
            }

            camPitch = (camPitch + 70.0) / 112.0;
            const camHeading = (GetGameplayCamRelativeHeading() + 180) % 360;
            const camHeadingRad = (camHeading * Math.PI) / 180.0;
            const cosCamHeading = Math.cos(camHeadingRad);
            const sinCamHeading = Math.sin(camHeadingRad);
            const camHeadingPercent = camHeading / 360.0;

            const coords = GetOffsetFromEntityInWorldCoords(
                ped,
                cosCamHeading * -0.2 - sinCamHeading * (0.4 * camHeadingPercent + 0.3),
                sinCamHeading * -0.2 + cosCamHeading * (0.4 * camHeadingPercent + 0.3),
                0.6
            ) as Vector3;
            const ray = Cast_3dRayPointToPoint(
                coords[0],
                coords[1],
                coords[2] - 0.2,
                coords[0],
                coords[1],
                coords[2] + 0.2,
                0.4,
                95,
                ped,
                7
            );

            const [, blocked, ,] = GetRaycastResult(ray);

            SetTaskMoveNetworkSignalFloat(ped, 'Pitch', camPitch);
            SetTaskMoveNetworkSignalFloat(ped, 'Heading', camHeadingPercent * -1.0 + 1.0);
            SetTaskMoveNetworkSignalBool(ped, 'isBlocked', blocked);
            SetTaskMoveNetworkSignalBool(
                ped,
                'isFirstPerson',
                GetCamViewModeForContext(GetCamActiveViewModeContext()) == 4
            );

            await wait(0);

            if (!IsTaskMoveNetworkActive(ped)) {
                this.pointing = false;
            }
        }

        RequestTaskMoveNetworkStateTransition(ped, 'Stop');
        ClearPedSecondaryTask(ped);
    }
}
