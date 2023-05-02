import classNames from 'classnames';
import { FunctionComponent, PropsWithChildren } from 'react';

export type StatusBarProps = {
    percent: number;
    backgroundPrimary: string;
    backgroundSecondary: string;
    showThreshold?: number;
    reverse?: boolean;
};

export const StatusBar: FunctionComponent<PropsWithChildren<StatusBarProps>> = ({
    percent,
    backgroundPrimary,
    backgroundSecondary,
    children,
    showThreshold = 0,
    reverse = false,
}) => {
    const hide = (!reverse && percent <= showThreshold) || (reverse && percent >= showThreshold);

    const classes = classNames(
        'transition-all duration-500 flex h-full w-full rounded bg-black p-[0.3rem] mx-0 my-[0.3rem]',
        {
            'opacity-0': hide,
            'opacity-60': !hide,
        }
    );

    return (
        <div className={classes}>
            {children}
            <div className="flex ml-1 grow-1 w-full rounded overflow-hidden" style={{ background: backgroundPrimary }}>
                <div
                    className="flex flex-col transition-width duration-1000 "
                    style={{ background: backgroundSecondary, width: `${percent}%` }}
                />
            </div>
        </div>
    );
};
