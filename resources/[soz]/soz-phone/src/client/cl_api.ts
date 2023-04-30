import { ApiEvents } from '../../typings/api';
import { RegisterNuiCB } from './cl_utils';

RegisterNuiCB<void>(ApiEvents.LOAD_API, async (_, cb) => {
    cb({
        apiEndpoint: `${GetConvar('soz_public_api_endpoint', 'https://api.soz.zerator.com')}/graphql`,
        publicEndpoint: GetConvar('soz_public_endpoint', 'https://soz.zerator.com'),
        token: LocalPlayer.state.SozJWTToken,
    });
});

RegisterNuiCB<void>(ApiEvents.FETCH_TOKEN, async (_, cb) => {
    cb(LocalPlayer.state.SozJWTToken);
});
