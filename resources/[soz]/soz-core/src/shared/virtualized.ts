import { CSSProperties } from 'react';

export type VirtualizedProps<T> = {
    index: number;
    style: CSSProperties;
    data: T[];
};
