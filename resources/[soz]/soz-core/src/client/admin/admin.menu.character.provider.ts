import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';

@Provider()
export class AdminMenuCharacterProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @OnNuiEvent(NuiEvent.AdminMenuCharacterCreateNew)
    public async createNewCharacter(): Promise<void> {
        const firstName = await this.inputService.askInput({
            maxCharacters: 30,
            title: 'Prénom',
            defaultValue: '',
        });

        if (!firstName) {
            return;
        }

        await wait(100);

        const lastName = await this.inputService.askInput({
            maxCharacters: 30,
            title: 'Nom',
            defaultValue: '',
        });

        if (!lastName) {
            return;
        }

        this.nuiMenu.closeAll();
        TriggerServerEvent(ServerEvent.ADMIN_CREATE_CHARACTER, firstName, lastName);
    }

    @OnNuiEvent(NuiEvent.AdminMenuCharacterSwitch)
    public async switchCharacter(citizenId: string): Promise<void> {
        this.nuiMenu.closeAll();
        TriggerServerEvent(ServerEvent.ADMIN_SWITCH_CHARACTER, citizenId);
    }
}
