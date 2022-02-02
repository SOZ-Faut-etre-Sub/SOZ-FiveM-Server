import React from 'react';


export default function MessageSkeleton({ height, isMine = false }) {

  const marginLeft = isMine ? '60px' : '8px';
  return (
    <div style={{ marginLeft, height: `${height}px` }}>
      <div />
    </div>
  );
}
