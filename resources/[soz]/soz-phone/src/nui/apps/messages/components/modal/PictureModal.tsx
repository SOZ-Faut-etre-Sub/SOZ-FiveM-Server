import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import cn from 'classnames';
import React, { Fragment } from 'react';
import { createPortal } from 'react-dom';

import { useConfig } from '../../../../hooks/usePhone';

export function PictureModal({ open, setOpen, children }) {
    const config = useConfig();

    return createPortal(
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className={cn(
                                    'relative transform overflow-hidden rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 w-full max-w-[90%] sm:p-6',
                                    {
                                        'bg-black': config.theme.value === 'dark',
                                        'bg-ios-50': config.theme.value === 'light',
                                    }
                                )}
                            >
                                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                                    <button
                                        type="button"
                                        className={cn(
                                            'rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                                            {
                                                'bg-black': config.theme.value === 'dark',
                                                'bg-ios-50': config.theme.value === 'light',
                                            }
                                        )}
                                        onClick={() => setOpen(false)}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-center">{children}</div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>,
        document.getElementById('external_modal')
    );
}
