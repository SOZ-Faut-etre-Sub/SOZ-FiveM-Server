import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { Ok } from '../../shared/result';
import { ClipboardService } from '../clipboard.service';
import { DrawService } from '../draw.service';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';

@Provider()
export class AdminMenuDeveloperProvider {
    @Inject(ClipboardService)
    private clipboard: ClipboardService;

    @Inject(DrawService)
    private draw: DrawService;

    @Inject(InputService)
    private input: InputService;

    @Inject(Notifier)
    private notifier: Notifier;

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

            this.draw.drawText({
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
    public async copyCoords(type: 'coords3' | 'coords4') {
        const coords = GetEntityCoords(PlayerPedId(), true);
        const heading = GetEntityHeading(PlayerPedId()).toFixed(2);

        const x = coords[0].toFixed(2);
        const y = coords[1].toFixed(2);
        const z = coords[2].toFixed(2);

        switch (type) {
            case 'coords3':
                this.clipboard.copy(`vector3(${x}, ${y}, ${z})`);
                break;
            case 'coords4':
                this.clipboard.copy(`vector4(${x}, ${y}, ${z}, ${heading})`);
                break;
        }
        this.notifier.notify('Coordonnées copiées dans le presse-papier');
    }

    @OnNuiEvent(NuiEvent.AdminChangePlayer)
    public async changePlayer(): Promise<void> {
        const citizenId = await this.input.askInput(
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
