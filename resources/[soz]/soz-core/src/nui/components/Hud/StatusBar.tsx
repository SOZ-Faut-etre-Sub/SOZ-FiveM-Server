import { FunctionComponent, PropsWithChildren } from 'react';

export type StatusBarProps = {
    percent: number;
    backgroundPrimary: string;
    backgroundSecondary: string;
};

export const StatusBar: FunctionComponent<PropsWithChildren<StatusBarProps>> = ({
    percent,
    backgroundPrimary,
    backgroundSecondary,
    children,
}) => {
    return (
        <div className="flex h-full w-full rounded bg-black opacity-60 p-1 my-0">
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
