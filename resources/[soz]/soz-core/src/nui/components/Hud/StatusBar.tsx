import classNames from 'classnames';
import { FunctionComponent, PropsWithChildren } from 'react';

export type StatusBarProps = {
    percent: number;
    backgroundPrimary: string;
    backgroundSecondary: string;
    hideCondition?: (value: number) => boolean;
};

export const StatusBar: FunctionComponent<PropsWithChildren<StatusBarProps>> = ({
    percent,
    backgroundPrimary,
    backgroundSecondary,
    children,
    hideCondition = value => value < 0.01,
}) => {
    const hide = hideCondition(percent);

    const classes = classNames(
        'transition-all duration-500 flex h-full w-full rounded bg-black p-[0.2rem] mx-0 my-[0.3rem]',
        {
            'opacity-0': hide,
            'opacity-60': !hide,
        }
    );

    if (hide) {
        return null;
    }

    return (
        <div className={classes}>
            {children}
            <div className="flex ml-1 grow-1 w-full rounded overflow-hidden" style={{ background: backgroundPrimary }}>
                <div
                    className="flex h-full flex-col transition-width duration-100"
                    style={{ background: backgroundSecondary, width: `${percent}%` }}
                />
            </div>
        </div>
    );
};
