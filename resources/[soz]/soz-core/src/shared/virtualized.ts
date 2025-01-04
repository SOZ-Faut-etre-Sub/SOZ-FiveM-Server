import { CSSProperties } from 'react';

type VirtualizedProps<T> = {
    style: CSSProperties;
    data: T[];
};

export type VirtualizedListProps<T> = VirtualizedProps<T> & {
    index: number;
};

export type VirtualizedGridProps<T> = VirtualizedProps<T> & {
    rowIndex: number;
    columnIndex: number;
};
