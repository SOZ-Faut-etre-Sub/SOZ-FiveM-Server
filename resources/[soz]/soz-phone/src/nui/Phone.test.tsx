import { shallow } from 'enzyme';
import React from 'react';
import { RecoilRoot } from 'recoil';

import { PhoneProviders } from './PhoneProviders';

it('renders Phone', () => {
    shallow(
        <RecoilRoot>
            <PhoneProviders />
        </RecoilRoot>
    );
});
