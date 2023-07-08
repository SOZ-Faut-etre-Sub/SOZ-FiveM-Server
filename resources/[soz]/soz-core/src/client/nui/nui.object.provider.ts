import { Command } from '../../core/decorators/command';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { Control } from '../../shared/input';
import { Vector3, Vector4 } from '../../shared/polyzone/vector';
import { NuiMenu } from './nui.menu';

type CurrentObject = {
    position: Vector4;
    model: number;
};

@Provider()
export class NuiObjectProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    private currentObject: CurrentObject | null;

    private createObjectResolver: (currentObject: CurrentObject | null) => void;

    private objectProp: number | null;

    @Tick()
    public async handleCurrentObject() {
        if (!this.createObjectResolver) {
            return;
        }

        let rotationDelta = 5;
        let positionDelta = 0.05;

        BlockWeaponWheelThisFrame();
        DisableControlAction(0, Control.VehiclePushbikeSprint, true);
        DisableControlAction(0, Control.Duck, true);
        DisableControlAction(0, Control.Sprint, true);
        DisableControlAction(0, Control.CharacterWheel, true);
        DisableControlAction(0, Control.VehicleNextRadio, true);
        DisableControlAction(0, Control.VehicleSelectNextWeapon, true);
        DisableControlAction(0, Control.PhoneUp, true);
        DisableControlAction(0, Control.PhoneDown, true);
        DisableControlAction(0, Control.PhoneLeft, true);
        DisableControlAction(0, Control.PhoneRight, true);
        DisableControlAction(0, Control.FrontendCancel, true);

        const hasControlKey = IsDisabledControlPressed(0, Control.Duck);
        const hasAltKey = IsDisabledControlPressed(0, Control.CharacterWheel);
        const hasScrollUp = IsDisabledControlPressed(0, Control.VehicleSelectNextWeapon);
        const hasScrollDown = IsDisabledControlPressed(0, Control.VehicleNextRadio);
        const hasUp = IsDisabledControlPressed(0, Control.PhoneUp);
        const hasDown = IsDisabledControlPressed(0, Control.PhoneDown);
        const hasLeft = IsDisabledControlPressed(0, Control.PhoneLeft);
        const hasRight = IsDisabledControlPressed(0, Control.PhoneRight);
        const hasCancel = IsDisabledControlPressed(0, Control.FrontendCancel);

        if (hasControlKey) {
            positionDelta = 0.01;
            rotationDelta = 1;
        }

        if (hasScrollDown) {
            this.currentObject.position[3] = (this.currentObject.position[3] - rotationDelta) % 360;
        }

        if (hasScrollUp) {
            this.currentObject.position[3] = (this.currentObject.position[3] + rotationDelta) % 360;
        }

        if (hasUp) {
            if (hasAltKey) {
                this.currentObject.position[2] = this.currentObject.position[2] + positionDelta;
            } else {
                this.currentObject.position[1] = this.currentObject.position[1] + positionDelta;
            }
        }

        if (hasDown) {
            if (hasAltKey) {
                this.currentObject.position[2] = this.currentObject.position[2] - positionDelta;
            } else {
                this.currentObject.position[1] = this.currentObject.position[1] - positionDelta;
            }
        }

        if (hasLeft) {
            this.currentObject.position[0] = this.currentObject.position[0] - positionDelta;
        }

        if (hasRight) {
            this.currentObject.position[0] = this.currentObject.position[0] + positionDelta;
        }

        FreezeEntityPosition(this.objectProp, true);
        SetEntityHeading(this.objectProp, this.currentObject.position[3]);
        SetEntityCoords(
            this.objectProp,
            this.currentObject.position[0],
            this.currentObject.position[1],
            this.currentObject.position[2],
            false,
            false,
            false,
            false
        );

        if (hasCancel) {
            this.createObjectResolver(null);
            this.currentObject = null;
        }
    }

    public async askObject(model: number, existingPosition?: Vector4): Promise<CurrentObject | null> {
        const promise = new Promise<CurrentObject>(resolve => {
            this.createObjectResolver = resolve;
            this.nuiMenu.setMenuVisibility(false);
        });

        promise.finally(() => {
            this.createObjectResolver = null;
            this.nuiMenu.setMenuVisibility(true);
            DeleteEntity(this.objectProp);
            this.objectProp = null;
        });

        const position = GetEntityCoords(PlayerPedId(), false) as Vector3;
        const heading = GetEntityHeading(PlayerPedId());

        this.currentObject = existingPosition
            ? {
                  position: existingPosition,
                  model,
              }
            : {
                  position: [position[0], position[1], position[2] - 1, heading],
                  model,
              };

        this.objectProp = CreateObject(
            this.currentObject.model,
            this.currentObject.position[0],
            this.currentObject.position[1],
            this.currentObject.position[2],
            false,
            false,
            false
        );

        SetEntityAlpha(this.objectProp, 204, false);

        return promise;
    }
    @Command('soz_admin_finish_create_object', {
        description: "Valider la création d'un objet",
        keys: [
            {
                mapper: 'keyboard',
                key: 'E',
            },
        ],
    })
    public async endCreatingZone() {
        if (this.createObjectResolver) {
            const object = { ...this.currentObject };
            this.currentObject = null;

            this.createObjectResolver(object);
        }
    }
}
