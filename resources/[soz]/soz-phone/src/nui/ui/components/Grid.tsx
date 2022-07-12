import cn from 'classnames';
import { CSSProperties, FunctionComponent, PropsWithChildren } from 'react';

type Props = { rows?: number; columns?: number; styleRules?: CSSProperties; className?: string };

export const Grid: FunctionComponent<PropsWithChildren<Props>> = ({
    rows = 6,
    columns = 4,
    styleRules,
    className,
    children,
}) => {
    return (
        <div
            className={cn('grid w-full h-fit gap-1.5 overflow-hidden', className)}
            style={{
                ...styleRules,
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            }}
        >
            {children}
        </div>
    );
};
