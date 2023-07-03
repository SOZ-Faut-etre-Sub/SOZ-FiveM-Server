import { Command } from '@public/core/decorators/command';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Exportable } from '@public/core/decorators/exports';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { PLACEMENT_PROP_LIST, PlacementProp } from '@public/shared/nui/prop_placement';

import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';

@Provider()
export class PropPlacementProvider {
    @Inject(NuiMenu)
    private menu: NuiMenu;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(Notifier)
    private notifier: Notifier;

    private placementPropState: PlacementProp | null = null;

    @Command('soz_core_toggle_prop_placement_menu', {
        description: 'Ouvrir le menu placement de prop',
        passthroughNuiFocus: true,
        keys: [
            {
                mapper: 'keyboard',
                key: 'F4',
            },
        ],
    })
    public async openPlacementMenu() {
        if (this.menu.getOpened() === MenuType.PropPlacementMenu) {
            this.menu.closeMenu();
            return;
        }
        this.menu.openMenu(MenuType.PropPlacementMenu, {
            props: PLACEMENT_PROP_LIST,
            propState: (this.placementPropState ? this.placementPropState : null) as PlacementProp | null,
        });
    }

    @OnNuiEvent(NuiEvent.SelectPlacementProp)
    public async onSelectPlacementProp({ selectedProp }: { selectedProp: PlacementProp }) {
        if (!selectedProp) {
            const propModel = await this.inputService.askInput({
                title: 'Modèle du prop',
                defaultValue: '',
            });
            if (!propModel || !IsModelValid(propModel)) {
                this.notifier.notify('Modèle invalide', 'error');
                return;
            }
            await this.setPlacementProp({ model: propModel, label: GetLabelText(propModel) });
        } else {
            await this.setPlacementProp(selectedProp);
        }
    }

    public async setPlacementProp(prop: PlacementProp) {
        const playerPed = PlayerPedId();
        if (!playerPed) {
            return;
        }

        console.log(prop);

        this.menu.closeMenu();

        await this.createDebugProp(prop);

        EnterCursorMode();

        this.menu.openMenu(MenuType.PropPlacementMenu, {
            props: PLACEMENT_PROP_LIST,
            propState: this.placementPropState,
        });
    }

    public async createDebugProp(prop: PlacementProp) {
        while (!HasModelLoaded(prop.model)) {
            RequestModel(prop.model);
            await wait(0);
        }

        const propPosition = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0, 2, 0);

        const propEntity = CreateObject(
            prop.model,
            propPosition[0],
            propPosition[1],
            propPosition[2],
            false,
            false,
            false
        );
        PlaceObjectOnGroundProperly(propEntity);

        this.placementPropState = {
            model: prop.model,
            label: prop.label,
            entity: propEntity,
        };

        SetEntityDrawOutline(this.placementPropState.entity, true);
        SetEntityDrawOutlineColor(0, 255, 0, 255);
        SetEntityAlpha(this.placementPropState.entity, 200, false);
        SetEntityCollision(this.placementPropState.entity, false, false);
        SetEntityInvincible(this.placementPropState.entity, true);
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async handleGizmo() {
        if (!this.placementPropState) {
            return;
        }
        if (!DoesEntityExist(this.placementPropState.entity)) {
            await this.leavePlacementMode();
        }
        while (!HasModelLoaded(this.placementPropState.model)) {
            RequestModel(this.placementPropState.model);
            await wait(0);
        }
        const matrixBuffer = this.makeEntityMatrix(this.placementPropState.entity);
        const changed = DrawGizmo(matrixBuffer as any, 'Gismo_editor');
        if (changed) {
            this.applyEntityMatrix(this.placementPropState.entity, matrixBuffer);
        }

        DisableAllControlActions(0);
    }

    @OnNuiEvent(NuiEvent.PropPlacementReset)
    public async resetPlacement({
        position,
        rotation,
        scale,
        snap,
    }: {
        position: boolean;
        rotation: boolean;
        scale: boolean;
        snap: boolean;
    }) {
        if (!this.placementPropState || !DoesEntityExist(this.placementPropState.entity)) {
            return;
        }
        // Scale is not easy to handle, so just reset the prop completely.
        if (scale) {
            SetEntityDrawOutline(this.placementPropState.entity, false);
            DeleteEntity(this.placementPropState.entity);
            await this.createDebugProp(this.placementPropState);
            return;
        }
        if (position) {
            const playerPed = PlayerPedId();
            if (!playerPed) {
                return;
            }
            const propPosition = GetOffsetFromEntityInWorldCoords(playerPed, 0, 2, 0);
            SetEntityCoordsNoOffset(
                this.placementPropState.entity,
                propPosition[0],
                propPosition[1],
                propPosition[2],
                false,
                false,
                false
            );
            PlaceObjectOnGroundProperly(this.placementPropState.entity);
        }
        if (rotation) {
            SetEntityRotation(this.placementPropState.entity, 0, 0, 0, 0, false);
        }
        if (snap) {
            PlaceObjectOnGroundProperly(this.placementPropState.entity);
        }
    }

    @OnNuiEvent(NuiEvent.LeavePlacementMode)
    public async leavePlacementMode() {
        if (!this.placementPropState) {
            return;
        }
        SetEntityDrawOutline(this.placementPropState.entity, false);
        DeleteEntity(this.placementPropState.entity);
        this.placementPropState = null;

        EnableAllControlActions(0);
        LeaveCursorMode();

        this.menu.closeMenu();
        this.menu.openMenu(MenuType.PropPlacementMenu, {
            props: PLACEMENT_PROP_LIST,
            propState: null,
        });
    }

    public makeEntityMatrix = (entity: number): Float32Array => {
        const [f, r, u, a] = GetEntityMatrix(entity);

        return new Float32Array([r[0], r[1], r[2], 0, f[0], f[1], f[2], 0, u[0], u[1], u[2], 0, a[0], a[1], a[2], 1]);
    };

    public applyEntityMatrix = (entity: number, matrix: Float32Array) => {
        SetEntityMatrix(
            entity,
            matrix[4],
            matrix[5],
            matrix[6], // Right
            matrix[0],
            matrix[1],
            matrix[2], // Forward
            matrix[8],
            matrix[9],
            matrix[10], // Up
            matrix[12],
            matrix[13],
            matrix[14] // Position
        );
    };

    @Exportable('IsPlacementModeActive')
    public IsPlacementModeActive(): boolean {
        return this.placementPropState != null;
    }
}
