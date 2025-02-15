import { FunctionComponent, memo } from 'react';

import { IconComponentProps } from '../../../system/phone.types';

interface AppIconProps {
    icon: FunctionComponent<IconComponentProps>;
    title?: string;
    badge?: number;
}

export const AppIcon: FunctionComponent<AppIconProps> = memo(({ title, icon: Icon, badge }) => {
    return (
        <div className="flex flex-col items-center w-full h-full text-white overflow-hidden">
            <div className="relative flex justify-center items-center text-ellipsis w-4/5 aspect-square mt-1">
                {Icon && <Icon className="size-16 rounded-[1rem]" />}

                {Number(badge) > 0 && (
                    <span className="absolute flex justify-center items-center top-0 right-0 py-1 px-2 text-xs font-light transform rounded-full bg-red-500 ">
                        {badge}
                    </span>
                )}
            </div>

            {title && (
                <span
                    className="overflow-hidden text-ellipsis text-sm w-full whitespace-nowrap text-center"
                    title={title}
                >
                    {title}
                </span>
            )}
        </div>
    );
});
