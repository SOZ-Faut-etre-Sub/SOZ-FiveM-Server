export interface NuiFishingMethodMap {
    ShowFishingMinigame: any;
    HideFishingMinigame: boolean;
    SetFishingStatus: {
        activate: boolean;
        bait?: string;
    };
}
