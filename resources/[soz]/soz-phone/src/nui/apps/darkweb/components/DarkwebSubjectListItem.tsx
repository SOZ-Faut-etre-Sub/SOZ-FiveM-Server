import { LockClosedIcon } from '@heroicons/react/outline';
import { DarkwebConversation } from '@typings/app/darkweb';
import { memo } from 'react';

interface DarkWebSubjectListItemProps {
    onClick(): void;
    data: Partial<DarkwebConversation>;
    readStatus: boolean;
}

export const DarkWebSubjectListItem = memo(({ onClick, data, readStatus }: DarkWebSubjectListItemProps) => {
    return (
        <div
            className={`border-[0.2vh] rounded-lg my-3 mx-2 cursor-pointer ${
                !readStatus ? 'border-teal-500  hover:bg-teal-900' : 'border-green-500  hover:bg-green-900'
            } `}
            onClick={onClick}
        >
            <div className="m-auto py-3 flex flex-row w-5/6 text-left justify-between items-start">
                <span className="text-teal-500">{data.label}</span>{' '}
                <span>{data.password ? <LockClosedIcon className="w-6 h-6 text-teal-500" /> : ''}</span>
            </div>
        </div>
    );
});
