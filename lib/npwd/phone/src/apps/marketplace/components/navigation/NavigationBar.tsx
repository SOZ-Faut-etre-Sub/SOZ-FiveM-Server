import React, { useState } from 'react';
import { Link } from 'react-router-dom';


export const NavigationBar: React.FC = () => {
  const [activePage, setActivePage] = useState(0);
  return ( null
    // <BottomNavigation
    //   value={activePage}
    //   onChange={(event, newPage) => {
    //     setActivePage(newPage);
    //   }}
    //   showLabels
    //
    // >
    //   <BottomNavigationAction component={Link} icon={<Home />} to="/marketplace" />
    //   <BottomNavigationAction component={Link} icon={<AddCircle />} to="/marketplace/new" />
    // </BottomNavigation>
  );
};
