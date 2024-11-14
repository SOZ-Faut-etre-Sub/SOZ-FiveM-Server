import { Provider } from '@core/decorators/provider';
import { Command } from '@public/core/decorators/command';

@Provider()
export class ViewModeProvider {
    private camViewMode: number;

    @Command('view-mode-toggle', {
        description: 'Active ou Désactive le mode FPS',
        keys: [
            {
                mapper: 'keyboard',
                key: '',
            },
        ],
    })
    toggleViewMode() {
        const currentViewMode = GetFollowPedCamViewMode();

        if (currentViewMode !== 4) {
            this.camViewMode = currentViewMode;
            SetFollowPedCamViewMode(4);
            return;
        }

        SetFollowPedCamViewMode(this.camViewMode || 0);
    }
}
