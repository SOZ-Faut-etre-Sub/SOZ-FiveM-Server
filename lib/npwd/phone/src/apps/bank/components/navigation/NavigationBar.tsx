import React, { useState } from 'react';

import { Link } from 'react-router-dom';

export const NavigationBar = () => {
  const [activePage, setActivePage] = useState(0);
  return (
    <div
      style={{
        background: '#262525',
      }}
      // value={activePage}
      // onChange={(event, newPage) => {
      //   setActivePage(newPage);
      // }}
      // showLabels
    >
      {/*<div component={Link} icon={<Home />} to="/bank" />*/}
      {/*<div component={Link} icon={<Payment />} to="/bank/account" />*/}
    </div>
  );
};
