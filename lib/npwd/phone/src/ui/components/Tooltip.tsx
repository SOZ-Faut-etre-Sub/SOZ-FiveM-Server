import React from 'react';

export const Tooltip: React.FC<any> = ({ children, ...props }) => {
  // TODO: Revisit hiding tooltips when phone is hidden
  // const phoneVisible = useRecoilValue(phoneState.visibility);

  return <div {...props}>{children}</div>;
};
