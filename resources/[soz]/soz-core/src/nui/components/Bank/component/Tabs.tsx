import { Tab } from '@headlessui/react';
import classnames from 'classnames';
import cn from 'classnames';
import { Fragment, FunctionComponent } from 'react';

import { useHudColor } from '../../Hud/hooks/useHudColor';

type TabsProps = {
    selected: number;
    onChange: (index: number) => void;
    tabs: string[];
    className?: string;
    reverseColor?: boolean;
};

export const Tabs: FunctionComponent<TabsProps> = ({ selected, onChange, tabs, reverseColor, className = 'p-1.5' }) => {
    const { glassmorphismColors, card, color } = useHudColor();

    const listBackgroundColor = reverseColor ? card : glassmorphismColors.background;
    const tabBackgroundColor = reverseColor ? glassmorphismColors.background : card;

    return (
        <Tab.Group selectedIndex={selected} onChange={onChange}>
            <Tab.List
                className={cn('grid gap-3 h-full shadow-sm rounded-xl backdrop-blur-xl', className)}
                style={{
                    gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
                    backgroundColor: listBackgroundColor,
                }}
            >
                {tabs.map(tab => (
                    <Tab key={tab} as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={classnames('font-semibold text-center p-2 rounded-lg focus:outline-none')}
                                style={{
                                    backgroundColor: selected && tabBackgroundColor,
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
