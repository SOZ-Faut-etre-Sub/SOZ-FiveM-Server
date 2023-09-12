import cn from 'classnames';
import { FunctionComponent } from 'react';

type DataContainerProps = {
    title: string;
    value: string | number;
    big?: boolean;
};

export const DataContainer: FunctionComponent<DataContainerProps> = ({ title, value, big = false }) => {
    return (
        <div className="border-2 border-white h-fit w-3/12 ml-2 rounded">
            <div className="bg-white text-center text-[#38428b]">{title}</div>
            <p
                className={cn('p-1 text-center', {
                    'text-2xl': big,
                })}
            >
                {value}
            </p>
        </div>
    );
};
