export declare const getConfig: () => any;
export declare const writeToConfig: (config: any) => void;
export declare const writeToGitIgnore: () => void;
export declare const getHistory: () => any;
export declare const writeToHistory: (environmentHistory: any) => void;
export declare const getPendingMigrations: (dir: string) => any[];
export declare const getLatestMigrations: (dir: string, count?: number | undefined) => any[];
