import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const DialerNavBar: React.FC = () => {
  const { pathname } = useLocation();
  const [page, setPage] = useState(pathname);
  const [t] = useTranslation();

  const handleChange = (_e, newPage) => {
    setPage(newPage);
  };

  return (<div></div>
    // <BottomNavigation value={page} onChange={handleChange} showLabels >
    //   <BottomNavigationAction
    //     label={t('DIALER.NAVBAR_HISTORY')}
    //     value="/phone"
    //     component={NavLink}
    //     icon={<HistoryIcon />}
    //     to="/phone"
    //   />
    //   <BottomNavigationAction
    //     label={t('DIALER.NAVBAR_DIAL')}
    //     value="/phone/dial"
    //     color="secondary"
    //     component={NavLink}
    //     icon={<PhoneIcon />}
    //     to="/phone/dial"
    //   />
    //   <BottomNavigationAction
    //     label={t('DIALER.NAVBAR_CONTACTS')}
    //     value="/phone/contacts"
    //     color="secondary"
    //     component={NavLink}
    //     icon={<PersonIcon />}
    //     to="/phone/contacts"
    //   />
    // </BottomNavigation>
  );
};

export default DialerNavBar;
