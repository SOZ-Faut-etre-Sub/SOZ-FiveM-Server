import Alert from '@ui/components/Alert';
import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationAlert = () => {
  const { currentAlert } = useNotifications();

  return (
    <div >
      <div>
        <Alert
          // action={
            // <IconButton
            //   color="primary"
            //   size="small"
            //   onClick={(e) => {
            //     e.stopPropagation();
            //     currentAlert?.onCloseAlert(e);
            //   }}
            // >
            //   <CloseIcon fontSize="small" />
            // </IconButton>

          onClick={(e) => currentAlert?.onClickAlert(e)}
          icon={currentAlert?.icon || false}

          elevation={6}
        >
          {/*<AlertTitle>*/}
          {/*  <Box width="282px" whiteSpace="nowrap">*/}
          {/*    <Box overflow="hidden" component="div" textOverflow="ellipsis">*/}
          {/*      {currentAlert?.title}*/}
          {/*    </Box>*/}
          {/*  </Box>*/}
          {/*</AlertTitle>*/}
          {/*<Box component="div"  textOverflow="ellipsis">*/}
          {/*  {currentAlert?.content}*/}
          {/*</Box>*/}
        </Alert>
      </div>
    </div>
  );
};
