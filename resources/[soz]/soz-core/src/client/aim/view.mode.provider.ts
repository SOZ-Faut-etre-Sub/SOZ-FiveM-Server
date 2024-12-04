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
        const viewModeContext = GetCamActiveViewModeContext();
        const currentViewMode = GetCamViewModeForContext(viewModeContext);

        if (currentViewMode !== 4) {
            this.camViewMode = currentViewMode;
            SetCamViewModeForContext(viewModeContext, 4);
            return;
        }

        SetCamViewModeForContext(viewModeContext, this.camViewMode || 0);
    }
}
