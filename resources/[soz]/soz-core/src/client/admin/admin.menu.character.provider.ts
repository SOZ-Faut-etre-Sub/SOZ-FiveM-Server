import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { NotEmptyStringValidator } from '../../shared/nui/input';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';

@Provider()
export class AdminMenuCharacterProvider {
    @Inject(InputService)
    private inputService: InputService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @OnNuiEvent(NuiEvent.AdminMenuCharacterCreateNew)
    public async createNewCharacter(): Promise<void> {
        const firstName = await this.inputService.askInput(
            {
                maxCharacters: 30,
                title: 'Prénom',
            },
            NotEmptyStringValidator
        );

        if (!firstName) {
            return;
        }

        const lastName = await this.inputService.askInput(
            {
                maxCharacters: 30,
                title: 'Nom',
            },
            NotEmptyStringValidator
        );

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
