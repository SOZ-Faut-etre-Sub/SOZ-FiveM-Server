export type LokiEvent = {
    stream: Record<string, string>;
    values: [string, string][];
};
