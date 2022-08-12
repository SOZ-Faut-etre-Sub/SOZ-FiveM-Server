import React, { FunctionComponent, memo } from 'react';

export const AppIcon: FunctionComponent<{ title: string; icon: React.FC<any> }> = memo(({ title, icon: Icon }) => {
    return (
        <div className="flex flex-col items-center w-full h-full text-white overflow-hidden">
            <div className="flex justify-center items-center overflow-hidden text-ellipsis w-4/5 aspect-square mt-1">
                <Icon className="h-16 w-16 rounded-[1rem]" />
            </div>
            <span className="overflow-hidden text-ellipsis text-sm w-full whitespace-nowrap text-center" title={title}>
                {title}
            </span>
        </div>
    );
});
