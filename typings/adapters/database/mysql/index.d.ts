import Client from './client';
import { DatabaseConfigType, IDatabaseAdapter } from '../../../types/database';
import { TableDefinition } from '../../../types/migration';
export default class MySQLDatabaseAdapter implements IDatabaseAdapter {
    /**
     * Private properties
     */
    _client: Client;
    /**
     * Constructor
     * @param {Object} config
     */
    constructor(config: DatabaseConfigType);
    query(statement: string): Promise<any>;
    Transaction: {
        new (): {
            _scripts: string[];
            create: (tableName: string, definition: TableDefinition) => void;
            alter: (tableName: string, definition: TableDefinition) => void;
            drop: (tableName: string) => void;
            seed: (tableName: string, seeds: {
                [key: string]: any;
            }[]) => void;
            clear: (tableName: string) => void;
            execute: (query: string) => void;
            escape: (value: string) => string;
            escapeKey: (key: string) => string;
            commit(): void;
            toString(): string;
        };
    };
}
