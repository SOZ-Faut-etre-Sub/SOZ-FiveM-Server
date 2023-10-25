import { Inject, Injectable } from '@public/core/decorators/injectable';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';

import { Notifier } from './notifier';

interface RopeState {
    rope: number;
    baseEntity: number;
    maxLength: number;
    attachPosition: Vector3;
}

@Injectable()
export class RopeService {
    @Inject(Notifier)
    private notifier: Notifier;

    private ropeState: RopeState | null = null;

    public createNewRope(
        position: Vector3,
        attachPosition: Vector3,
        baseEntity: number,
        ropeType: number,
        initLength: number,
        maxLength: number
    ): number | null {
        // Fail if already exist
        // Create
        if (this.ropeState) {
            this.notifier.notify("Vous vous surestimez. Vous n'êtes pas assez musclé pour tirer deux cordes.", 'error');
            //TODO: Return error
            return null;
        }
        RopeLoadTextures();
        const [rope] = AddRope(
            position[0],
            position[1],
            position[2],
            0.0,
            0.0,
            0.0,
            maxLength,
            ropeType,
            initLength,
            0.5,
            0,
            false,
            true,
            true,
            1.0,
            false,
            0
        );
        this.ropeState = {
            rope,
            baseEntity,
            maxLength,
            attachPosition,
        };
        AttachRopeToEntity(
            this.ropeState.rope,
            baseEntity,
            attachPosition[0],
            attachPosition[1],
            attachPosition[2],
            true
        );
        ActivatePhysics(this.ropeState.rope);
        return this.ropeState.rope;
    }

    public manageRopePhysics() {
        const ped = PlayerPedId();
        const rope = this.ropeState.rope;
        const ropeLength = GetRopeLength(rope);
        const stationPosition = GetEntityCoords(this.ropeState.baseEntity) as Vector3;
        const playerPosition = GetEntityCoords(ped, true) as Vector3;
        const distanceStationPlayer = getDistance(stationPosition, playerPosition);
        const floatingRange = 0.1;

        if (distanceStationPlayer < ropeLength) {
            // current length > desired length : winding case
            StopRopeUnwindingFront(rope);
            StartRopeWinding(rope);
            RopeForceLength(rope, distanceStationPlayer + floatingRange);
            console.log("déroule");
        } else if (distanceStationPlayer > ropeLength) {
            // current length < desired length : unwinding case
            StopRopeWinding(rope);
            StartRopeUnwindingFront(rope);
            RopeForceLength(rope, distanceStationPlayer + floatingRange);
            console.log("enroule");
        } else {
            StopRopeWinding(rope);
            StopRopeUnwindingFront(rope);
            RopeForceLength(rope, distanceStationPlayer + floatingRange);
        }

        const handPosition = GetWorldPositionOfEntityBone(
            PlayerPedId(),
            GetEntityBoneIndexByName(PlayerPedId(), 'BONETAG_L_FINGER2')
        ) as Vector3;

        AttachEntitiesToRope(
            this.ropeState.rope,
            this.ropeState.baseEntity,
            PlayerPedId(),
            this.ropeState.attachPosition[0],
            this.ropeState.attachPosition[1],
            this.ropeState.attachPosition[2],
            handPosition[0],
            handPosition[1],
            handPosition[2],
            10.0,
            true,
            true,
            null,
            'BONETAG_L_FINGER2'
        );
    }

    public getRopeDistance() {
        if (!this.ropeState) {
            return null;
        }
        const handPosition = GetWorldPositionOfEntityBone(
            PlayerPedId(),
            GetEntityBoneIndexByName(PlayerPedId(), 'BONETAG_L_FINGER2')
        ) as Vector3;
        return getDistance(this.ropeState.attachPosition, handPosition);
    }

    public deleteRope() {
        RopeUnloadTextures();
        DeleteRope(this.ropeState.rope);
        this.ropeState = null;
    }
}
