import React, { FunctionComponent, memo } from 'react';

export const AppIcon: FunctionComponent<{ title: string; icon: React.FC<any>; badge?: any }> = memo(
    ({ title, icon: Icon, badge }) => {
        return (
            <div className="flex flex-col items-center w-full h-full text-white overflow-hidden">
                <div className="relative flex justify-center items-center text-ellipsis w-4/5 aspect-square mt-1">
                    <Icon className="h-16 w-16 rounded-[1rem]" />

                    {badge > 0 && (
                        <span className="absolute flex justify-center items-center -top-1 -right-1 block py-1 px-2 text-xs font-light transform rounded-full bg-red-500">
                            {badge}
                        </span>
                    )}
                </div>
                <span
                    className="overflow-hidden text-ellipsis text-sm w-full whitespace-nowrap text-center"
                    title={title}
                >
                    {title}
                </span>
            </div>
        );
    }
);
