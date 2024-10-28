import { Inject, Injectable } from '@public/core/decorators/injectable';
import { Feature } from '@public/shared/features';

import { FeatureProvider } from '../feature/feature.provider';
import { ResourceLoader } from '../repository/resource.loader';

const arachnophobeKvPKey = 'soz/arachnophobe';
const spider = GetHashKey('spider');

const spiderlocations = [
    [8.688249, -715.2358, 55.9801826],
    [-174.295288, -1263.73755, 41.4207],
    [-663.233459, -930.9396, 45.4198341],
    [-174.0742, -1283.95032, 41.2478676],
    [1918.69067, 3092.23682, 58.19184],
    [-1978.44116, 2037.557, 156.384048],
    [1740.29846, 3306.915, 46.5518379],
    [-554.537354, -612.870544, 57.71183],
    [343.188538, -1398.7627, 59.57147],
    [292.900757, -979.819946, 50.8219566],
    [124.337204, -888.1047, 65.6977539],
    [672.31366, -67.72764, 74.47151],
    [-557.2844, 5226.172, 74.41047],
    [693.1661, -1014.31415, 20.5452137],
    [-1083.57483, -243.228546, 47.75348],
];

@Injectable()
export class HalloweenSpiderService {
    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    private arachnophobe = !!GetResourceKvpInt(arachnophobeKvPKey);

    public async init() {
        if (this.arachnophobe && this.featureProvider.isFeatureEnabled(Feature.Halloween)) {
            for (const spiderLoc of spiderlocations) {
                CreateModelHide(spiderLoc[0], spiderLoc[1], spiderLoc[2], 38.2, spider, true);
            }
        }
    }

    public isArachnophobeMode() {
        return this.arachnophobe;
    }

    public async updateArachnophobeMode(value: boolean) {
        this.arachnophobe = value;
        SetResourceKvpInt(arachnophobeKvPKey, this.arachnophobe ? 1 : 0);

        for (const spiderLoc of spiderlocations) {
            if (this.arachnophobe) {
                CreateModelHide(spiderLoc[0], spiderLoc[1], spiderLoc[2], 38.2, spider, true);
            } else {
                RemoveModelHide(spiderLoc[0], spiderLoc[1], spiderLoc[2], 38.2, spider, false);
            }
        }
    }
}
