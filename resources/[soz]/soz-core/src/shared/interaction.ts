import { JobType } from './job';
import { Vector3, Vector4 } from './polyzone/vector';

export const defaultDrawDistance = 2.5;
export const defaultInteractionDistance = 1;

export type Interaction = InteractionOption & {
    id: string;

    entity?: number;

    coords?: Vector3 | Vector4;

    model?: number;
    searchCoords?: Vector3;
};

export type InteractionOption = {
    label: string;

    item?: string;
    event?: string;
    blackoutGlobal?: boolean;
    blackoutJob?: string;
    job?: string | JobType | Partial<{ [key in JobType]: number }>;
    canInteract?: (entity?: number) => boolean | Promise<boolean>;

    action?: (entity?: number) => void;
};
