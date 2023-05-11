import { Command } from '../../core/decorators/command';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { RGBAColor } from '../../shared/color';
import { Control } from '../../shared/input';
import { BoxZone, Zone } from '../../shared/polyzone/box.zone';
import { rotatePoint, Vector3 } from '../../shared/polyzone/vector';
import { NuiMenu } from './nui.menu';

@Provider()
export class NuiZoneProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    private currentZone: Zone | null;

    private useZAxis = false;

    public createZoneResolver: (zone: Zone) => void;

    @Tick()
    public async handleCurrentZone() {
        if (!this.currentZone) {
            return;
        }

        let sizeScaleDelta = 0.2;
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

        const hasMajLock = IsDisabledControlPressed(0, Control.VehiclePushbikeSprint);
        const hasControlKey = IsDisabledControlPressed(0, Control.Duck);
        const hasShiftKey = IsDisabledControlPressed(0, Control.Sprint);
        const hasAltKey = IsDisabledControlPressed(0, Control.CharacterWheel);
        const hasScrollUp = IsDisabledControlPressed(0, Control.VehicleSelectNextWeapon);
        const hasScrollDown = IsDisabledControlPressed(0, Control.VehicleNextRadio);
        const hasUp = IsDisabledControlPressed(0, Control.PhoneUp);
        const hasDown = IsDisabledControlPressed(0, Control.PhoneDown);
        const hasLeft = IsDisabledControlPressed(0, Control.PhoneLeft);
        const hasRight = IsDisabledControlPressed(0, Control.PhoneRight);

        let color = [0, 255, 0, 100] as RGBAColor;

        if (hasMajLock) {
            this.useZAxis = !this.useZAxis;

            await wait(100);
        }

        if (this.useZAxis) {
            color = [0, 0, 255, 100] as RGBAColor;
        }

        if (hasControlKey) {
            sizeScaleDelta = 0.05;
            rotationDelta = 1;
            positionDelta = 0.01;
        }

        const cameraRotation = GetGameplayCamRot(2);
        const headingCamInRad = (cameraRotation[2] * Math.PI) / 180;

        if (!this.useZAxis) {
            if (hasScrollDown) {
                if (hasAltKey) {
                    this.currentZone.width = Math.max(0, this.currentZone.width - sizeScaleDelta);
                } else if (hasShiftKey) {
                    this.currentZone.length = Math.max(0, this.currentZone.length - sizeScaleDelta);
                } else {
                    this.currentZone.heading = (this.currentZone.heading - rotationDelta) % 360;
                }
            }

            if (hasScrollUp) {
                if (hasAltKey) {
                    this.currentZone.width = Math.max(0, this.currentZone.width + sizeScaleDelta);
                } else if (hasShiftKey) {
                    this.currentZone.length = Math.max(0, this.currentZone.length + sizeScaleDelta);
                } else {
                    this.currentZone.heading = (this.currentZone.heading + rotationDelta) % 360;
                }
            }
        } else {
            if (hasScrollDown) {
                if (hasAltKey) {
                    this.currentZone.minZ -= sizeScaleDelta;
                } else if (hasShiftKey) {
                    this.currentZone.maxZ -= sizeScaleDelta;
                } else {
                    this.currentZone.minZ -= sizeScaleDelta;
                    this.currentZone.maxZ -= sizeScaleDelta;
                    this.currentZone.center[2] -= sizeScaleDelta;
                }
            }

            if (hasScrollUp) {
                if (hasAltKey) {
                    this.currentZone.minZ += sizeScaleDelta;
                } else if (hasShiftKey) {
                    this.currentZone.maxZ += sizeScaleDelta;
                } else {
                    this.currentZone.minZ += sizeScaleDelta;
                    this.currentZone.maxZ += sizeScaleDelta;
                    this.currentZone.center[2] += sizeScaleDelta;
                }
            }
        }

        if (hasUp) {
            this.currentZone = {
                ...this.currentZone,
                center: [
                    ...rotatePoint(
                        this.currentZone.center,
                        [this.currentZone.center[0], this.currentZone.center[1] + positionDelta],
                        headingCamInRad
                    ),
                    this.currentZone.center[2],
                ],
            };
        }

        if (hasDown) {
            this.currentZone = {
                ...this.currentZone,
                center: [
                    ...rotatePoint(
                        this.currentZone.center,
                        [this.currentZone.center[0], this.currentZone.center[1] - positionDelta],
                        headingCamInRad
                    ),
                    this.currentZone.center[2],
                ],
            };
        }

        if (hasLeft) {
            this.currentZone = {
                ...this.currentZone,
                center: [
                    ...rotatePoint(
                        this.currentZone.center,
                        [this.currentZone.center[0] - positionDelta, this.currentZone.center[1]],
                        headingCamInRad
                    ),
                    this.currentZone.center[2],
                ],
            };
        }

        if (hasRight) {
            this.currentZone = {
                ...this.currentZone,
                center: [
                    ...rotatePoint(
                        this.currentZone.center,
                        [this.currentZone.center[0] + positionDelta, this.currentZone.center[1]],
                        headingCamInRad
                    ),
                    this.currentZone.center[2],
                ],
            };
        }

        const boxZone = BoxZone.fromZone(this.currentZone);
        boxZone.draw(color);
    }

    public async askZone(existingZone?: Zone): Promise<Zone> {
        const promise = new Promise<Zone>(resolve => {
            this.createZoneResolver = resolve;
            this.nuiMenu.setMenuVisibility(false);
        });

        promise.finally(() => {
            this.createZoneResolver = null;
            this.nuiMenu.setMenuVisibility(true);
        });

        const position = GetEntityCoords(PlayerPedId(), false) as Vector3;
        const heading = GetEntityHeading(PlayerPedId());

        this.currentZone = existingZone
            ? BoxZone.fromZone(existingZone)
            : new BoxZone(position, 1, 1, {
                  minZ: position[2] - 1,
                  maxZ: position[2] + 1,
                  heading: (heading + 180) % 360,
              });

        return promise;
    }
    @Command('soz_admin_finish_create_zone', {
        description: "Valider la création d'une zone",
        keys: [
            {
                mapper: 'keyboard',
                key: 'E',
            },
        ],
    })
    public async endCreatingZone() {
        if (this.createZoneResolver) {
            const zone = { ...this.currentZone };
            this.currentZone = null;

            this.createZoneResolver(zone);
        }
    }
}
