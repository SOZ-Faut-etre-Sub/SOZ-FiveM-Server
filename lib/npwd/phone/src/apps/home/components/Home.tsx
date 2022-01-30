import React from 'react';
import { AppWrapper } from '@ui/components';
import { Box } from '@mui/material';
import { GridMenu } from '@ui/components/GridMenu';
import { useApps } from '@os/apps/hooks/useApps';
import {useMySocietyPhoneNumber} from "@os/simcard/hooks/useMyPhoneNumber";

const AppQuickClass = {
    borderRadius: '40px',
    background: 'rgba(255, 255, 255, .25)',
    marginBottom: '40px'
};

export const HomeApp: React.FC = () => {
  const { apps } = useApps();
  const societyNumber = useMySocietyPhoneNumber();

  const filteredApps = (societyNumber === null) ? apps.filter((app) => app.home !== true && app.id !== 'SOCIETY_MESSAGES') : apps.filter((app) => app.home !== true)
  const homeApps = apps.filter((app) => app.home === true)

  return (
    <AppWrapper style={{justifyContent: "space-between"}}>
      <Box component="div" mt={6} px={1}>
        {filteredApps && <GridMenu xs={3} items={filteredApps} />}
      </Box>
      <Box sx={AppQuickClass} component="div" mb={1} pt={1} mx={2}>
          {homeApps && <GridMenu xs={3} items={homeApps} />}
      </Box>
    </AppWrapper>
  );
};
