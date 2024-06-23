export interface ClickhouseMigration {
    migrate(): Promise<void>;

    get name(): string;

    get priority(): number;
}
