import { CheckIcon } from '@heroicons/react/solid';
import { FunctionComponent } from 'react';

import { MenuItemText } from '../Styleguide/Menu';

export type CraftProps = {
    inputs: {
        label: string;
        hasRequiredAmount: boolean;
        amount: number;
    }[];
};

export const CraftList: FunctionComponent<CraftProps> = ({ inputs }) => {
    if (!inputs) {
        return null;
    }
    return (
        <MenuItemText>
            {inputs.map(input => (
                <div className="flex items-center my-0.5" key={input.label}>
                    <div className="mr-1.5 border border-white w-5 h-5 rounded bg-black/20">
                        {input.hasRequiredAmount && (
                            <CheckIcon className="w-full h-full text-white" aria-hidden="true" focusable="false" />
                        )}
                    </div>
                    <h3>
                        {input.amount} {input.label}
                    </h3>
                </div>
            ))}
        </MenuItemText>
    );
};
