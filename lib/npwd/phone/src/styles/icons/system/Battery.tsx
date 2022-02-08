import React from 'react';

const BatteryIcon = (props) => {
    return (
        <svg {...props} viewBox="0 0 28 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.5" y="1.5" width="23" height="11" rx="1.5" stroke="currentColor"/>
            <rect x="3" y="3" width="12" height="8" rx="1" fill="currentColor"/>
            <path d="M26 5V5C26.5523 5 27 5.44772 27 6V8C27 8.55228 26.5523 9 26 9V9V5Z" fill="currentColor"/>
        </svg>
    );
};

export default BatteryIcon;
