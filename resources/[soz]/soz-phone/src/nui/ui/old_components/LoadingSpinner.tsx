import { RefreshIcon } from '@heroicons/react/outline';
import React from 'react';

export const LoadingSpinner: React.FC<any> = ({ ...props }) => (
    <div {...props} className="flex flex-col justify-center items-center h-full min-h-[720px]">
        <RefreshIcon className="animate-spin text-white h-20 w-20" />
    </div>
);
