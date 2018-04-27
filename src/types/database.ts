import { TableDefinition, SeedData } from './migration';

export interface IDatabaseAdapter {
    query(statement: string): Promise<any>; 
    Transaction: typeof ITransaction; 
}

export declare const IDatabaseAdapter: {
    new(config: DatabaseConfigType): IDatabaseAdapter;
}

export interface ITransaction {
    create: (tableName: string, definition: TableDefinition) => void,
    alter: (tableName: string, definition: TableDefinition) => void,
    drop: (tableName: string) => void,
    clear: (tableName: string) => void,
    seed: (tableName: string, data: SeedData) => void,
    execute: (statement: string) => void,
    escape: (value: string) => string,
    escapeKey: (key: string) => string,
    commit: () => void
}

export declare const ITransaction: {
    new(): ITransaction;
}

export type DatabaseOptionsType = {
    databaseURI: string,
    keepConnections?: boolean,
    charset?: string,
    timeout?: number
};

export type DatabaseConfigType = {
    host: string,
    port?: number,
    user: string,
    password: string,
    schema?: string,
    charset?: string,
    timeout?: number
};