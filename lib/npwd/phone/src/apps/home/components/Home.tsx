import React from 'react';
import { AppWrapper } from '@ui/components';
import { Box } from '@mui/material';
import { GridMenu } from '@ui/components/GridMenu';
import { useApps } from '@os/apps/hooks/useApps';
import {useMySocietyPhoneNumber} from "@os/simcard/hooks/useMyPhoneNumber";

export const HomeApp: React.FC = () => {
  const { apps } = useApps();
  const societyNumber = useMySocietyPhoneNumber();

  const filteredApps = (societyNumber === null) ? apps.filter((app) => app.id !== 'SOCIETY_MESSAGES') : apps

  return (
    <AppWrapper>
      <Box component="div" mt={6} px={1}>
        {apps && <GridMenu xs={3} items={filteredApps} />}
      </Box>
    </AppWrapper>
  );
};
