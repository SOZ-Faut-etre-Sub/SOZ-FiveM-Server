import React, { forwardRef } from 'react';

export const Alert: React.FC<any> = forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
            className="flex items-center mx-10 px-4 py-2 bg-black bg-opacity-70 text-gray-300 shadow-md rounded-lg "
            {...props}
        >
            <div
                className={`flex-none h-10 w-10 ${
                    props.severity === 'success' ? 'bg-green-500' : 'bg-red-500'
                } rounded-lg mr-3`}
            />
            <div className="flex-grow">{props.children}</div>
        </div>
    );
});

export default Alert;
