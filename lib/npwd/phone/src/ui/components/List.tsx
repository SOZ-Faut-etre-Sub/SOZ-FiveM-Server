import React from 'react';

export const List = ({ ...props }) => (
    <div className="mx-2 my-4 bg-[#1C1C1E] shadow overflow-hidden rounded-[.8rem]">
        <ul role="list" className="divide-y divide-[#3D3D3F]">
            {props.children}
        </ul>
    </div>
  // <div className="bg-[#1C1C1E] m-2 p-2 rounded-lg" {...props}>
  // </div>
);
