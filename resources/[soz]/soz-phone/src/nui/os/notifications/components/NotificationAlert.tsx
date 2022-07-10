import { Transition } from '@headlessui/react';
import Alert from '@ui/components/Alert';
import React from 'react';

import { useNotifications } from '../hooks/useNotifications';

export const NotificationAlert = () => {
    const { currentAlert } = useNotifications();

    // TODO: improve notification hook
    const isPosition = /vec2\((-?[0-9.]+),(-?[0-9.]+)\)/g.test(currentAlert?.content.toString());

    return (
        <Transition
            appear={true}
            show={!!currentAlert}
            className="absolute inset-x-0 z-40"
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-y-0"
            leaveTo="-translate-y-full"
        >
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

                    onClick={e => currentAlert?.onClickAlert(e)}
                    icon={currentAlert?.icon || undefined}
                >
                    {isPosition ? 'Destination' : currentAlert?.content}

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
        </Transition>
    );
};
