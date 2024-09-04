import cn from 'classnames';
import { FunctionComponent, RefObject, useLayoutEffect, useState } from 'react';

type ConnectorProp = {
    container: RefObject<HTMLDivElement> | null;
    origin: RefObject<SVGSVGElement> | null;
    target: RefObject<HTMLDivElement> | null;
    targetAnchor?: 'left' | 'right';
    className?: string;
};

export const TargetConnector: FunctionComponent<ConnectorProp> = ({
    container,
    origin,
    target,
    targetAnchor = 'left',
    className,
}) => {
    const [, setRerender] = useState(0);

    const [containerRect, originRect, targetRect] = [
        container.current?.getBoundingClientRect(),
        origin.current?.getBoundingClientRect(),
        target.current?.getBoundingClientRect(),
    ];

    useLayoutEffect(() => {
        setRerender(rerender => rerender + 1);
    }, [container, origin, target]);

    const start = {
        x: originRect?.x - containerRect?.x + originRect?.width / 2,
        y: -18 + originRect?.y - containerRect?.y + originRect?.height / 2,
    };

    const end = {
        x: targetRect?.x - containerRect?.x + (targetAnchor === 'right' ? targetRect?.width - 1 : 1),
        y: targetRect?.y - containerRect?.y + targetRect?.height / 2,
    };

    if (!start.x || !start.y || !end.x || !end.y) {
        return null;
    }

    return (
        <svg className={cn('absolute', className)} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path d={`M ${start?.x} ${start?.y} L ${end?.x} ${end?.y}`} stroke="currentColor" strokeWidth={3} />
        </svg>
    );
};
