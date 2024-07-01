import { Command } from '@core//decorators/command';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';

@Provider()
export class GizmoControlProvider {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Command('gizmo_toggle_focus', {
        description: 'Housing : Basculer caméra/souris.',
        keys: [
            {
                mapper: 'keyboard',
                key: 'Tab',
            },
        ],
    })
    onGizmoToggleFocus(): void {
        this.nuiDispatch.dispatch('gizmo', 'ToggleFocus');
    }

    @Command('gizmo_place', {
        description: 'Housing : Confirmer et placer.',
        keys: [
            {
                mapper: 'keyboard',
                key: 'Space',
            },
        ],
    })
    onGizmoPlace(): void {
        this.nuiDispatch.dispatch('gizmo', 'handlePlaceObject');
    }

    @Command('gizmo_delete', {
        description: "Housing : Effacer l'objet.",
        keys: [
            {
                mapper: 'keyboard',
                key: 'Delete',
            },
        ],
    })
    onGizmoDelete(): void {
        this.nuiDispatch.dispatch('gizmo', 'handleDeleteObject');
    }

    @Command('gizmo_toggle_snap', {
        description: "Housing : Aligner l'objet.",
        keys: [
            {
                mapper: 'keyboard',
                key: 'C',
            },
        ],
    })
    onGizmoSnapMode(): void {
        this.nuiDispatch.dispatch('gizmo', 'handleSnap');
    }

    @Command('gizmo_toggle_space', {
        description: 'Housing : Basculer reférence.',
        keys: [
            {
                mapper: 'keyboard',
                key: 'L',
            },
        ],
    })
    onGizmoToggleSpaceMode(): void {
        this.nuiDispatch.dispatch('gizmo', 'handleToggleSpaceMode');
    }

    @Command('gizmo_toggle_editor', {
        description: 'Housing : Basculer translation/rotation.',
        keys: [
            {
                mapper: 'keyboard',
                key: 'R',
            },
        ],
    })
    onMenuShift(): void {
        this.nuiDispatch.dispatch('gizmo', 'handleToggleEditorMode');
    }
}
