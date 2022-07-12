import { FunctionComponent, memo } from 'react';

export const AppIcon: FunctionComponent<{ title: string; icon: JSX.Element }> = memo(({ title, icon }) => {
    return (
        <div className="flex flex-col items-center w-full h-full text-white overflow-hidden">
            <div className="flex justify-center items-center overflow-hidden text-ellipsis w-4/5 aspect-square mt-1">
                {icon}
            </div>
            <span className="overflow-hidden text-ellipsis text-sm w-full whitespace-nowrap text-center" title={title}>
                {title}
            </span>
        </div>
    );
});
