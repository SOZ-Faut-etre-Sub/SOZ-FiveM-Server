import cn from 'classnames';
import { FunctionComponent, PropsWithChildren } from 'react';

type Props = { rows?: number; columns?: number; className?: string };

export const Grid: FunctionComponent<PropsWithChildren<Props>> = ({ rows = 6, columns = 4, className, children }) => {
    return (
        <div
            className={cn('grid w-full overflow-hidden', className)}
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            }}
        >
            {children}
        </div>
    );
};
