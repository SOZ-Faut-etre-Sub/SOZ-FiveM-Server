import { Operation } from 'fast-json-patch';

import { RepositoryType } from '../repository';

export interface NuiRepositoryMethodMap {
    Set: {
        type: RepositoryType;
        data: Record<any, any>;
    };
    Patch: {
        type: RepositoryType;
        patch: Operation[];
    };
}
