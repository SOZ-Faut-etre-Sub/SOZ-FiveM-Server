import { FunctionComponent, RefObject, useLayoutEffect, useState } from 'react';

import { useInterval } from '../../../hook/useInterval';

type ConnectorProp = {
    container: RefObject<HTMLDivElement> | null;
    origin: RefObject<SVGSVGElement> | null;
    target: RefObject<HTMLDivElement> | null;
    targetAnchor?: 'left' | 'right';
    originAnchor?: 'left' | 'center' | 'right';
    color?: string;
};

export const TargetConnector: FunctionComponent<ConnectorProp> = ({
    container,
    origin,
    target,
    targetAnchor = 'left',
    originAnchor = 'center',
    color,
}) => {
    const [, setRerender] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect>(target.current?.getBoundingClientRect());

    const [containerRect, originRect] = [
        container.current?.getBoundingClientRect(),
        origin.current?.getBoundingClientRect(),
    ];

    useInterval(
        () => {
            const targetBounding = target.current?.getBoundingClientRect();
            if (targetRect?.y === targetBounding?.y) return;

            setTargetRect(targetBounding);
        },
        20,
        [target]
    );

    useLayoutEffect(() => {
        setRerender(rerender => rerender + 1);
    }, [container, origin, target]);

    const offset = (): { x: number; y: number } => {
        switch (originAnchor) {
            case 'left':
                return { x: -10, y: -15 };
            case 'center':
                return { x: 0, y: -18 };
            case 'right':
                return { x: 10, y: -15 };
        }
    };

    const start = {
        x: offset().x + originRect?.x - containerRect?.x + originRect?.width / 2,
        y: offset().y + originRect?.y - containerRect?.y + originRect?.height / 2,
    };

    const end = {
        x: targetRect?.x - containerRect?.x + (targetAnchor === 'right' ? targetRect?.width - 1 : 1),
        y: targetRect?.y - containerRect?.y + targetRect?.height / 2,
    };

    if (!start.x || !start.y || !end.x || !end.y) {
        return null;
    }

    return (
        <svg className="absolute" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path d={`M ${start?.x} ${start?.y} L ${end?.x} ${end?.y}`} stroke={color} strokeWidth={4} />
        </svg>
    );
};
