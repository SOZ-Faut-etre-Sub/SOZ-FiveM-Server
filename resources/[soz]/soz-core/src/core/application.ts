import { Container } from './container';
import { OnceStep } from './decorators/event';
import { Inject, Injectable } from './decorators/injectable';
import { ModuleLoader } from './loader/module.loader';
import { OnceLoader } from './loader/once.loader';
import { Logger } from './logger';

@Injectable()
export class Application {
    private running: Promise<boolean> | null = null;
    private resolve: (boolean) => void | null = null;
    private onStopCallback = null;
    private container = Container;
    private modules = [];

    @Inject(ModuleLoader)
    private moduleLoader: ModuleLoader;

    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    @Inject(Logger)
    private logger: Logger;

    static async create(providerTarget: any, ...modules: any[]): Promise<Application> {
        Container.bind(providerTarget).to(providerTarget).inSingletonScope();
        const app = Container.get(Application);

        for (const module of modules) {
            app.addModule(module);
        }

        await app.start();

        return app;
    }

    async start() {
        if (this.running !== null && this.resolve !== null) {
            this.logger.error('soz core applicasion already running');

            return;
        }

        this.running = new Promise<boolean>(resolve => {
            this.resolve = resolve;
        });

        for (const module of this.modules) {
            this.moduleLoader.load(module);
        }

        this.onStopCallback = this.onStop.bind(this);

        addEventListener('onResourceStop', (resourceName: string) => {
            if (resourceName === GetCurrentResourceName()) {
                this.onStopCallback();
            }
        });
        addEventListener('soz_core.__internal__.stop_application', this.onStopCallback, false);

        this.logger.debug('[soz-core] starting application');
        await this.onceLoader.trigger(OnceStep.Start);
    }

    async stop() {
        if (this.running === null || this.resolve === null) {
            this.logger.error('soz core application is not running');

            return;
        }

        const stopped = await this.running;
        await this.onceLoader.trigger(OnceStep.Stop);

        this.logger.debug('[soz-core] stopping application');

        this.moduleLoader.unload();

        this.running = null;
        this.resolve = null;

        return stopped;
    }

    private addModule(module: any) {
        const moduleService = this.container.get(module);

        this.modules.push(moduleService);
    }

    private onStop() {
        if (this.running === null || this.resolve === null) {
            this.logger.error('soz core application is not running');

            return;
        }

        this.resolve(true);

        removeEventListener('soz_core.__internal__.stop_application', this.onStopCallback);
    }
}
