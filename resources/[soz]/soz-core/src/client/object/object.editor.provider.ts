import { Command } from '@core/decorators/command';
import { InputService } from '@public/client/nui/input.service';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { uuidv4, wait } from '@public/core/utils';
import { ObjectEffects } from '@public/shared/animation';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { InventoryItem } from '@public/shared/inventory';
import { ObjectEditorOptions, WorldObject } from '@public/shared/object';
import { Vector3, Vector4 } from '@public/shared/polyzone/vector';

import { MenuType } from '../../shared/nui/menu';
import { Notifier } from '../notifier';
import { NuiMenu } from '../nui/nui.menu';
import { CircularCameraProvider } from './circular.camera.provider';
import { ObjectService } from './object.service';

export const PROP_MAX_DISTANCE = 50.0;

type CurrentObject = {
    edited: boolean;
    matrix: number[];
    position: Vector4;
    entity: number;
    model: number;
    options: ObjectEditorOptions;
    startingObject: WorldObject;
    previousPosition: Vector4;
    resolver: (object: WorldObject | null) => void;
};

@Provider()
export class ObjectEditorProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(CircularCameraProvider)
    private circularCamera: CircularCameraProvider;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ObjectService)
    private objectService: ObjectService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(InputService)
    private inputService: InputService;

    private currentObject: CurrentObject | null;

    private isCreatingObject = false;

    public async createOrUpdateObject(
        model: number,
        options?: Partial<ObjectEditorOptions>,
        existingObject: WorldObject | null = null
    ): Promise<WorldObject | null> {
        if (this.isCreatingObject) {
            return existingObject;
        }

        // lock early to prevent double object creation
        this.isCreatingObject = true;

        const ped = PlayerPedId();
        const position = existingObject?.position
            ? existingObject?.position
            : ([...(GetOffsetFromEntityInWorldCoords(ped, 0, 2.0, 0) as Vector3), 0] as Vector4);

        const editorOptions: ObjectEditorOptions = {
            onDrawCallback: () => {},
            deleteCallback: () => {},
            setNameCallback: () => {},
            maxDistance: PROP_MAX_DISTANCE,
            allowDelete: false,
            allowRotation: true,
            allowScale: true,
            allowToggleCollision: false,
            allowToggleSnap: true,
            allowAddEffect: false,
            allowTogglePermanent: false,
            allowDuplicate: false,
            allowSetName: false,
            onlyZRotation: false,
            effect: existingObject?.effect || null,
            vfx: existingObject?.vfx || null,
            context: 'hammer',
            collision: !existingObject?.noCollision || false,
            snapToGround: existingObject?.placeOnGround || false,
            permanent: existingObject?.permanent || false,
            useCircularCamera: true,
            initialPosition: position,
            ...options,
        };

        const initialObject: WorldObject = {
            model,
            position: editorOptions.initialPosition,
            id: existingObject?.id || uuidv4(),
            placeOnGround: editorOptions.snapToGround,
            noCollision: true,
            matrix: existingObject?.matrix,
            invisible: false,
            effect: editorOptions.effect,
            vfx: editorOptions.vfx,
            permanent: editorOptions.permanent,
            rotation: existingObject?.rotation,
            highlight: true,
        };

        const objectEntity = await this.objectService.createObject(initialObject);

        if (!objectEntity) {
            return existingObject;
        }

        initialObject.matrix = this.objectService.getEntityMatrix(objectEntity);

        const promise = new Promise<WorldObject>(resolver => {
            this.currentObject = {
                edited: !!existingObject,
                position,
                entity: objectEntity,
                model,
                matrix: this.objectService.getEntityMatrix(objectEntity),
                options: editorOptions,
                startingObject: initialObject,
                previousPosition: position,
                resolver,
            };
        });

        promise.finally(() => {
            if (this.currentObject && this.currentObject.entity) {
                DeleteEntity(this.currentObject.entity);
                this.currentObject.entity = null;
            }

            if (editorOptions.useCircularCamera) {
                this.circularCamera.deleteCamera();
            }

            this.currentObject = null;
            this.isCreatingObject = false;
        });

        SetEntityAlpha(objectEntity, 200, false);
        SetEntityCollision(objectEntity, false, false);

        await wait(0);

        this.refreshObjectPositionFromGame();

        if (editorOptions.useCircularCamera) {
            this.circularCamera.createCamera([position[0], position[1], position[2]]);
        }

        this.nuiMenu.openMenu(
            MenuType.ObjectEditor,
            {
                ...editorOptions,
                object: initialObject,
            },
            {
                originMenuType: this.nuiMenu.getOpened(),
            }
        );

        this.nuiDispatch.dispatch('object_editor', 'setEntityPosition', {
            matrix: this.objectService.getEntityMatrix(objectEntity),
        });

        return promise;
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async drawEditorLoop() {
        if (!this.currentObject) {
            return;
        }

        this.nuiDispatch.dispatch('object_editor', 'setCameraPosition', {
            position: GetFinalRenderedCamCoord() as Vector3,
            rotation: GetFinalRenderedCamRot(0) as Vector3,
        });

        this.currentObject.options.onDrawCallback(this.getWorldObject(this.currentObject));
    }

    @OnNuiEvent<{ menuType: MenuType }>(NuiEvent.MenuClosed)
    public async onCloseMenu({ menuType }) {
        if (menuType !== MenuType.ObjectEditor) {
            return;
        }

        await this.cancel();
    }

    @OnNuiEvent(NuiEvent.ObjectEditorCancel)
    public async cancel() {
        if (!this.currentObject) {
            return;
        }

        this.currentObject.resolver(null);
    }

    @OnNuiEvent(NuiEvent.ObjectEditorDelete)
    public async delete() {
        if (!this.currentObject) {
            return;
        }

        this.currentObject.options.deleteCallback(this.getWorldObject(this.currentObject));
        this.currentObject.resolver(null);
    }

    @OnNuiEvent(NuiEvent.ObjectEditorSave)
    public async save({ duplicate }: { duplicate?: boolean }) {
        if (!this.currentObject) {
            return;
        }

        const object = this.getWorldObject(this.currentObject);

        if (duplicate) {
            object.id = uuidv4();
        }

        this.currentObject.resolver(object);
    }

    @OnNuiEvent(NuiEvent.ObjectEditorToggleCollision)
    public async toggleCollision({ collision }: { collision: boolean }) {
        if (!this.currentObject) {
            return;
        }

        this.currentObject.options.collision = collision;
    }

    @OnNuiEvent(NuiEvent.ObjectEditorTogglePermanent)
    public async togglePermanent({ permanent }: { permanent: boolean }) {
        if (!this.currentObject) {
            return;
        }

        this.currentObject.options.permanent = permanent;
    }

    @OnNuiEvent(NuiEvent.ObjectEditorSetEffect)
    public async setObjectEffect({ effect }: { effect: null | keyof typeof ObjectEffects }) {
        if (!this.currentObject) {
            return;
        }

        if (!effect) {
            this.currentObject.options.vfx = null;
            this.currentObject.options.effect = null;
        } else {
            this.currentObject.options.vfx = ObjectEffects[effect]?.fx;
            this.currentObject.options.effect = effect;
        }

        await this.objectService.updateObject(this.currentObject.entity, this.getWorldObject(this.currentObject));
    }

    @OnNuiEvent(NuiEvent.ObjectEditorSnap)
    public async snapCurrentObject() {
        if (!this.currentObject) {
            return;
        }

        this.doSnapCurrentObject();

        this.nuiDispatch.dispatch('object_editor', 'setEntityPosition', {
            matrix: this.objectService.getEntityMatrix(this.currentObject.entity),
        });

        if (this.currentObject.options.useCircularCamera) {
            this.circularCamera.updateTarget([
                this.currentObject.position[0],
                this.currentObject.position[1],
                this.currentObject.position[2],
            ]);
        }
    }

    public doSnapCurrentObject() {
        if (!this.currentObject) {
            return;
        }

        const matrix = this.objectService.getEntityMatrix(this.currentObject.entity);
        PlaceObjectOnGroundProperly_2(this.currentObject.entity);
        const position = GetEntityCoords(this.currentObject.entity) as Vector3;
        matrix[12] = position[0];
        matrix[13] = position[1];
        matrix[14] = position[2];
        this.objectService.applyEntityMatrix(this.currentObject.entity, matrix);

        this.refreshObjectPositionFromGame();
    }

    @OnNuiEvent(NuiEvent.ObjectEditorSetName)
    public async setName() {
        if (!this.currentObject) {
            return;
        }

        const name = await this.inputService.askInput({
            title: 'Identifiant',
            maxCharacters: 50,
        });

        if (!name) {
            return;
        }

        this.currentObject.options.setNameCallback(this.getWorldObject(this.currentObject), name);
    }

    @OnNuiEvent(NuiEvent.ObjectEditorSetPosition)
    public async setPosition({ matrix }: { matrix: number[] }) {
        if (!this.currentObject) {
            return;
        }

        this.objectService.applyEntityMatrix(this.currentObject.entity, matrix);

        if (this.currentObject.options.snapToGround) {
            this.doSnapCurrentObject();

            this.nuiDispatch.dispatch('object_editor', 'setEntityPosition', {
                matrix: this.objectService.getEntityMatrix(this.currentObject.entity),
            });
        } else {
            this.refreshObjectPositionFromGame();
        }
    }

    @OnNuiEvent(NuiEvent.ObjectEditorStopDrag)
    public async stopDrag() {
        if (!this.currentObject) {
            return;
        }

        if (this.currentObject.options.useCircularCamera) {
            this.circularCamera.updateTarget([
                this.currentObject.position[0],
                this.currentObject.position[1],
                this.currentObject.position[2],
            ]);
        }
    }

    private getWorldObject(currentObject: CurrentObject): WorldObject {
        const position = GetEntityCoords(currentObject.entity) as Vector3;
        const heading = GetEntityHeading(currentObject.entity);
        const rotation = GetEntityRotation(currentObject.entity, currentObject.startingObject.rotationOrder ?? 0);
        const matrix = this.objectService.getEntityMatrix(currentObject.entity);

        return {
            id: currentObject.startingObject.id,
            model: currentObject.model,
            position: [position[0], position[1], position[2], heading],
            rotation: [rotation[0], rotation[1], rotation[2]],
            matrix: Array.from(matrix),
            placeOnGround: false,
            permanent: currentObject.options.permanent,
            effect: currentObject.options.effect,
            vfx: currentObject.options.vfx,
            noCollision: !currentObject.options.collision,
        };
    }

    private refreshObjectPositionFromGame() {
        if (!this.currentObject) {
            return;
        }

        const position = GetEntityCoords(this.currentObject.entity) as Vector3;
        const heading = GetEntityHeading(this.currentObject.entity);

        this.currentObject.position = [position[0], position[1], position[2], heading];
        this.currentObject.matrix = this.objectService.getEntityMatrix(this.currentObject.entity);
    }

    @OnEvent(ClientEvent.OBJECT_PLACE_ITEM)
    public async placeItem(
        serverEvent: ServerEvent,
        model: string,
        inventoryItem: InventoryItem,
        snapToGround = true,
        noCheck = false
    ) {
        const object = await this.createOrUpdateObject(GetHashKey(model), {
            snapToGround: snapToGround,
            allowScale: false,
            maxDistance: 8,
        });
        if (!object) {
            return;
        }

        if (!noCheck) {
            const [ret] = GetGroundZFor_3dCoord(
                object.position[0],
                object.position[1],
                object.position[2] + 0.1,
                false
            );
            if (!ret) {
                this.notifier.error('Position invalide');
                return;
            }

            const coords = GetEntityCoords(PlayerPedId());
            const handle = StartShapeTestLosProbe(
                coords[0],
                coords[1],
                coords[2],
                object.position[0],
                object.position[1],
                object.position[2] + 0.2,
                49,
                0,
                4
            );

            let result: [number, any, number[], number[], number];
            do {
                result = GetShapeTestResult(handle);
                await wait(0);
            } while (result[0] == 1);

            if (result[1]) {
                this.notifier.error('Position incorrecte');
                return;
            }
        }

        TriggerServerEvent(serverEvent, object.position, inventoryItem);
    }

    @Command('soz_object_editor_validate', {
        description: "Valider l'objet en cours de modification",
        keys: [
            {
                mapper: 'keyboard',
                key: 'SPACE',
            },
        ],
    })
    onValidateCurrentObject(): void {
        this.nuiDispatch.dispatch('object_editor', 'validateCurrentObject');
    }

    @Command('soz_object_editor_delete', {
        description: "Supprime l'objet en cours de modification",
        keys: [
            {
                mapper: 'keyboard',
                key: 'DELETE',
            },
        ],
    })
    onDeleteCurrentObject(): void {
        this.nuiDispatch.dispatch('object_editor', 'deleteCurrentObject');
    }

    @Command('soz_object_editor_duplicate', {
        description: "Duplique et valide l'objet en cours de modification",
        keys: [
            {
                mapper: 'keyboard',
                key: 'N',
            },
        ],
    })
    onDuplicateCurrentObject(): void {
        this.nuiDispatch.dispatch('object_editor', 'duplicateCurrentObject');
    }
}
