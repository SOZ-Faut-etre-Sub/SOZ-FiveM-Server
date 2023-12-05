import { CheckIcon } from '@heroicons/react/solid';
import { useItems } from '@public/nui/hook/data';
import { CraftInput } from '@public/shared/craft/craft';
import { FunctionComponent } from 'react';

import { MenuItemText } from '../Styleguide/Menu';

export type CraftProps = {
    inputs: Record<string, CraftInput>;
};

export const CraftInputs: FunctionComponent<CraftProps> = ({ inputs }) => {
    const items = useItems();

    if (!inputs) {
        return null;
    }
    return (
        <MenuItemText>
            {Object.entries(inputs).map(([item, input]) => (
                <div className="flex items-center my-0.5" key={item}>
                    <div className="mr-1.5 border border-white w-5 h-5 rounded bg-black/20">
                        {input.check && (
                            <CheckIcon className="w-full h-full text-white" aria-hidden="true" focusable="false" />
                        )}
                    </div>
                    <h3>
                        {input.count} {items.find(elem => elem.name == item)?.label}
                    </h3>
                </div>
            ))}
        </MenuItemText>
    );
};
