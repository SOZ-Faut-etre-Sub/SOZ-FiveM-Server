import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { Ok } from '../../shared/result';
import { InputService } from '../nui/input.service';
import { Qbcore } from '../qbcore';

@Provider()
export class AdminMenuDeveloperProvider {
    @Inject(InputService)
    private inputService: InputService;

    @Inject(Qbcore)
    private QBCore: Qbcore;

    private showCoordinatesInterval = null;

    @OnNuiEvent(NuiEvent.AdminToggleNoClip)
    public async toggleNoClip(): Promise<void> {
        exports['soz-utils'].ToggleNoClipMode();
    }

    @OnNuiEvent(NuiEvent.AdminToggleShowCoordinates)
    public async toggleShowCoordinates(active: boolean): Promise<void> {
        if (!active) {
            clearInterval(this.showCoordinatesInterval);
            this.showCoordinatesInterval = null;
            return;
        }
        this.showCoordinatesInterval = setInterval(() => {
            const coords = GetEntityCoords(PlayerPedId(), true);
            const heading = GetEntityHeading(PlayerPedId()).toFixed(2);

            const x = coords[0].toFixed(2);
            const y = coords[1].toFixed(2);
            const z = coords[2].toFixed(2);

            this.QBCore.DrawText({
                x: 0.4,
                y: 0.01,
                width: 0,
                height: 0,
                scale: 0.4,
                r: 66,
                g: 182,
                b: 245,
                a: 255,
                text: `~w~Ped coordinates:~b~ vector4(${x}, ${y}, ${z}, ${heading})`,
            });
        }, 1);
    }

    @OnNuiEvent(NuiEvent.AdminCopyCoords)
    public async copyCoords(type: 'vector3' | 'vector4'): Promise<void> {
        const coords = GetEntityCoords(PlayerPedId(), true);
        const heading = GetEntityHeading(PlayerPedId()).toFixed(2);

        const x = coords[0].toFixed(2);
        const y = coords[1].toFixed(2);
        const z = coords[2].toFixed(2);

        switch (type) {
            case 'vector3':
                // FIXME: This is not working
                exports['soz-utils'].CopyToClipboard(`vector3(${x}, ${y}, ${z})`);
                break;
            case 'vector4':
                // FIXME: This is not working
                exports['soz-utils'].CopyToClipboard(`vector4(${x}, ${y}, ${z}, ${heading})`);
                break;
        }
    }

    @OnNuiEvent(NuiEvent.AdminChangePlayer)
    public async changePlayer(): Promise<void> {
        const citizenId = await this.inputService.askInput(
            {
                title: 'Citizen ID',
                defaultValue: '',
                maxCharacters: 32,
            },
            () => {
                return Ok(true);
            }
        );
        TriggerServerEvent(ServerEvent.ADMIN_CHANGE_PLAYER, citizenId);
    }

    @OnNuiEvent(NuiEvent.AdminResetHealthData)
    public async resetHealthData(): Promise<void> {
        TriggerServerEvent(ServerEvent.QBCORE_SET_METADATA, 'thirst', 100);
        TriggerServerEvent(ServerEvent.QBCORE_SET_METADATA, 'hunger', 100);
        TriggerServerEvent(ServerEvent.QBCORE_SET_METADATA, 'alcohol', 0);
        TriggerServerEvent(ServerEvent.QBCORE_SET_METADATA, 'drug', 0);
    }
}
