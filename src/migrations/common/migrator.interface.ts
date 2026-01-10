export interface IMigrator {
    init(): Promise<void>;
    up(): Promise<void>;
    down(): Promise<void>;
    test(): Promise<void>;
    close(): Promise<void>;
}
