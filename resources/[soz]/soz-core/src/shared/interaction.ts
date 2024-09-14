import { JobType } from './job';
import { Vector3, Vector4 } from './polyzone/vector';

export type Interaction = InteractionOption & {
    coords?: Vector3 | Vector4;
    drawDistance: number;
    interactionDistance: number;
};

export type InteractionOption = {
    label: string;

    item?: string;
    blackoutGlobal?: boolean;
    blackoutJob?: string;
    job?: string | JobType | Partial<{ [key in JobType]: number }>;
    canInteract?: () => boolean | Promise<boolean>;

    action?: () => void;
};
