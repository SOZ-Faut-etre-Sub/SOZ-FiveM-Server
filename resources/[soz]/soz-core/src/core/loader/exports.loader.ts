import { ExportableMetadataKey } from '../decorators/exports';
import { Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';

@Injectable()
export class ExportLoader {
    public load(provider): void {
        const exportMethodList = getMethodMetadata<string>(ExportableMetadataKey, provider);

        for (const methodName of Object.keys(exportMethodList)) {
            const exportName = exportMethodList[methodName];
            const method = provider[methodName].bind(provider);

            exports(exportName, method);
        }
    }

    public unload(): void {}
}
