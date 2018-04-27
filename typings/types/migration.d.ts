export interface IMigration {
    version: string;
    description: string;
    up(options: MigrationOptions): Promise<any>;
    down(options: MigrationOptions): Promise<any>;
}
export declare type TableDefinition = (context: any) => void;
export declare type SeedData = Array<{
    [name: string]: any;
}>;
export declare type MigrationOptions = {
    create: (tableName: string, definition: TableDefinition) => void;
    alter: (tableName: string, definition: TableDefinition) => void;
    drop: (tableName: string) => void;
    clear: (tableName: string) => void;
    seed: (tableName: string, data: SeedData) => void;
    escape: (value: string) => string;
    escapeKey: (key: string) => string;
    execute: (statement: string) => void;
};
