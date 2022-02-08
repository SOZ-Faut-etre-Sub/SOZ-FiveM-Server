import React from 'react';

const CellSignal = (props) => {
    return (
        <svg {...props} viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="9" width="3" height="4" rx="0.5" fill="currentColor"/>
            <rect x="6" y="7" width="3" height="6" rx="0.5" fill="currentColor"/>
            <rect x="11" y="4" width="3" height="9" rx="0.5" fill="currentColor" fillOpacity="0.5"/>
            <rect x="16" y="1" width="3" height="12" rx="0.5" fill="currentColor" fillOpacity="0.5"/>
        </svg>
    );
};

export default CellSignal;
