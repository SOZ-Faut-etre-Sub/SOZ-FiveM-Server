import { Fragment, FunctionComponent } from 'react';

import { useAssetPath } from '../../../../../hook/assets';

interface RowRendererProps {
    data: string[][] | null;
}

export const RowRenderer: FunctionComponent<RowRendererProps> = ({ data }) => {
    const { getPath } = useAssetPath();

    const stateToImage = (state: string) => {
        switch (state) {
            case 'snakeleftright':
                return getPath('images/phone/apps/snake/ui/leftright.webp');
            case 'snakeupdown':
                return getPath('images/phone/apps/snake/ui/updown.webp');
            case 'snakeheadup':
                return getPath('images/phone/apps/snake/ui/headup.webp');
            case 'snakedownleft':
                return getPath('images/phone/apps/snake/ui/downleft.webp');
            case 'snakedownright':
                return getPath('images/phone/apps/snake/ui/downright.webp');
            case 'snakeupleft':
                return getPath('images/phone/apps/snake/ui/upleft.webp');
            case 'snakeupright':
                return getPath('images/phone/apps/snake/ui/upright.webp');
            case 'snakeheaddown':
                return getPath('images/phone/apps/snake/ui/headdown.webp');
            case 'snakeheadleft':
                return getPath('images/phone/apps/snake/ui/headleft.webp');
            case 'snakeheadright':
                return getPath('images/phone/apps/snake/ui/headright.webp');
            case 'snaketailup':
                return getPath('images/phone/apps/snake/ui/tailup.webp');
            case 'snaketaildown':
                return getPath('images/phone/apps/snake/ui/taildown.webp');
            case 'snaketailleft':
                return getPath('images/phone/apps/snake/ui/tailleft.webp');
            case 'snaketailright':
                return getPath('images/phone/apps/snake/ui/tailright.webp');
            case 'food':
                return getPath('images/phone/apps/snake/ui/fruit.webp');
            case 'wall':
                return getPath('images/phone/apps/snake/ui/wall.webp');
            default:
                return '';
        }
    };

    if (!data) {
        return null;
    }

    return data.map((row, i) => (
        <Fragment key={'row-' + i}>
            {row.map((state, j) => (
                <div key={'column-' + j} className="w-1/10 aspect-square bg-ios-700 opacity-75">
                    {state !== 'blank' && <img src={stateToImage(state)} alt={state} />}
                </div>
            ))}
        </Fragment>
    ));
};
