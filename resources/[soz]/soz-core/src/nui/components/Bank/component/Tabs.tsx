import { Tab } from '@headlessui/react';
import classnames from 'classnames';
import { Fragment, FunctionComponent } from 'react';

import { useHudColor } from '../../Hud/hooks/useHudColor';

type TabsProps = {
    selected: number;
    onChange: (index: number) => void;
    tabs: string[];
};

export const Tabs: FunctionComponent<TabsProps> = ({ selected, onChange, tabs }) => {
    const { glassmorphismColors, color } = useHudColor();

    return (
        <Tab.Group selectedIndex={selected} onChange={onChange}>
            <Tab.List
                className="grid grid-cols-2 gap-3 p-1 text-gray-200 rounded-md"
                style={{
                    backgroundColor: glassmorphismColors.background,
                }}
            >
                {tabs.map(tab => (
                    <Tab key={tab} as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={classnames('font-semibold text-center p-2 rounded-md focus:outline-none')}
                                style={{
                                    backgroundColor: selected && glassmorphismColors.background,
                                    color,
                                }}
                            >
                                {tab}
                            </button>
                        )}
                    </Tab>
                ))}
            </Tab.List>
        </Tab.Group>
    );
};
