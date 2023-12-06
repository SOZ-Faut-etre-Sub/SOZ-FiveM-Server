import { FishWithCompletion } from '../sozedex';

export interface NuiSozedexMethodMap {
    ShowSozedex: ShowSozedexData;
    HideSozedex: never;
}

type ShowSozedexData = {
    playerRewards: any;
    fishesWithCompletion: Array<FishWithCompletion>;
};
