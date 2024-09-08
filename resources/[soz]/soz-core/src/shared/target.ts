import { JobType } from './job';

export type TargetContext = {
    id?: string;
    entity?: number;
};

export type TargetOption = TargetContext & {
    label: string;
    subLabel?: string;
    icon?: string;
    category: 'citizen' | 'society' | 'criminal';

    item?: string;
    blackoutGlobal?: boolean;
    blackoutJob?: string;
    job?: string | JobType | Partial<{ [key in JobType]: number }>;
    canInteract?: (entity?: number) => boolean | Promise<boolean>;

    action?: (entity?: number) => void;

    // todo:
    color?: string;
};
