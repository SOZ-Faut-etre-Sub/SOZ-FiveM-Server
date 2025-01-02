import clsx from 'clsx';
import { FunctionComponent, PropsWithChildren } from 'react';

interface GridProps extends PropsWithChildren {
    rows?: number;
    columns?: number;
    className?: string;
}

export const Grid: FunctionComponent<GridProps> = ({ rows = 6, columns = 4, className, children }) => {
    return (
        <div
            className={clsx('grid w-full overflow-hidden', className)}
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            }}
        >
            {children}
        </div>
    );
};
