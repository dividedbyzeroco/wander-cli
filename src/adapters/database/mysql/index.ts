import Client from './client';
import { DatabaseConfigType, IDatabaseAdapter, ITransaction } from '../../../types/database';
import { stripIndents } from 'common-tags';
import enforce from 'enforce-js';
import Table from '../../../classes/table';
import KeyDefinition from '../../../classes/key-definition';
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
    constructor(config: DatabaseConfigType) {
        // Prepare parameters
        this._client = new Client(config);
    }

    async query(statement: string) {
        return await this._client.query(statement);
    }

    Transaction = class implements ITransaction {
        _scripts: string[] = ['SET autocommit = 0;', 'START TRANSACTION;'];
    
        create = (tableName: string, definition: TableDefinition) => {
            // Enforce
            enforce`${{ tableName }} as a string`;
            enforce`${{ definition }} as a function`;

            // Prepare statement
            const statement = new CreateStatement(tableName, Client);
            
            // Bind table
            definition = definition.bind(statement.table);
    
            // Run definition
            definition(statement.table);
    
            // Add the statement
            this._scripts.push(statement.toString());
        };
    
        alter = (tableName: string, definition: TableDefinition) => {
            // Enforce
            enforce`${{ tableName }} as a string`;
            enforce`${{ definition }} as a function`;

            // Prepare statement
            const statement = new AlterStatement(tableName, Client);
    
            // Bind table
            definition = definition.bind(statement.table);
    
            // Run definition
            definition(statement.table);
    
            // Add the statement
            this._scripts.push(statement.toString());
        };
    
        drop = (tableName: string) => {
            // Enforce
            enforce`${{ tableName }} as a string`;

            // Prepare statement
            const statement = new DropStatement(tableName, Client);
    
            // Add the statement
            this._scripts.push(statement.toString());
        };
    
        seed = (tableName: string, seeds: {[key: string]: any}[]) => {
            // Enforce
            enforce`${{ tableName }} as a string`;
            enforce`${{ seeds }} as an array`;

            // Prepare statement
            const statement = new SeedStatement(tableName, seeds, Client);
    
            // Add the statement
            this._scripts.push(statement.toString());
        };

        truncate = (tableName: string) => {
            // Enforce
            enforce`${{ tableName }} as a string`;

            // Prepare statement
            const statement = new TruncateStatement(tableName, Client);

            // Add the statement
            this._scripts.push(statement.toString());
        };
    
        execute = (query: string) => {
            // Enforce
            enforce`${{ query }} as a string`;

            // Prepare statement
            const statement = new ExecuteStatement(query);
    
            // Add the statement
            this._scripts.push(statement.toString());
        };

        escape = (value: string) => {
            // Enforce
            enforce`${{ value }} as a string`;

            // Return escaped value
            return Client.escape(value);
        };

        escapeKey = (key: string) => {
            // Enforce
            enforce`${{ key }} as a string`;

            // Return escaped key
            return Client.escapeKey(key);
        };
    
        commit() {
            // Add commit statement
            this._scripts.push('COMMIT;');
        }
    
        toString() {
            return this._scripts.join('\n\n');
        }
    }
}

class CreateStatement {

    _table: Table;
    _client: typeof Client;

    constructor(tableName: string, client: typeof Client) {
        this._table = new Table(tableName);
        this._client = client;
    }

    get table() {
        return this._table;
    }

    _getKeyOptions(key: KeyDefinition) {
        return [
            key._nullable? '' : 'NOT NULL',
            key._increments? 'AUTO_INCREMENT': '',
            key._charset? `CHARSET ${key._charset}` : '',
            key._collation? `COLLATE ${key._collation}` : ''
        ].join(' ').trim();
    }

    _getKeys() {
        return this.table._keys.map(key => {
            return (`${this._client.escapeKey(key.name)} ${key.type} ${this._getKeyOptions(key)}`).trim();
        }).join(',\n');
    }

    _getPrimary() {
        if(this.table._primary && this.table._primary.action === 'ADD')
            return `,\nPRIMARY KEY (${this._client.escapeKey(this.table._primary.name)})`;
        else
            return '';
    }

    _getIndexes() {
        return this.table._indexes.length > 0? stripIndents`,
            ${this.table._indexes
                .filter(index => index.action === 'ADD')
                .map(index => `INDEX ${this._client.escapeKey(index.alias)} (${this._client.escapeKey(index.name)})`).join(',\n')}
        ` : '';
    }

    _getUniques() {
        return this.table._uniques.length > 0? stripIndents`,
            ${this.table._uniques
                .filter(unique => unique.action === 'ADD')
                .map(unique => `CONSTRAINT ${this._client.escapeKey(unique.alias)} UNIQUE (${this._client.escapeKey(unique.name)})`)
                .join('\n')
            }
        ` : '';
    }

    toString() {
        return stripIndents`
            CREATE TABLE IF NOT EXISTS ${this._client.escapeKey(this.table._tableName)} (
            ${this._getKeys()}${this._getPrimary()}${this._getIndexes()}${this._getUniques()});
        `;
    }
}

class AlterStatement {

    _table: Table;
    _client: typeof Client;

    constructor(tableName: string, client: typeof Client) {
        this._table = new Table(tableName);
        this._client = client;
    }

    get table() {
        return this._table;
    }

    _getKeyAction(key: KeyDefinition) {
        switch(key.action) {
            case 'ADD': return 'ADD';
            case 'MODIFY': return 'MODIFY';
            case 'DROP': return 'DROP';
        }
    }

    _getKeyOptions(key: KeyDefinition) {
        return [
            key._nullable? '' : 'NOT NULL',
            key._increments? 'AUTO_INCREMENT': '',
            key._charset? `CHARSET ${key._charset}` : '',
            key._collation? `COLLATE ${key._collation}` : '',
            key._before? `BEFORE ${this._client.escapeKey(key._before)}` : '',
            key._after? `AFTER ${this._client.escapeKey(key._after)}` : ''
        ].join(' ').trim();
    }

    _getKeys() {
        return this.table._keys.map(key => {
            const keyName = this._client.escapeKey(key.name);
            const options = this._getKeyOptions(key);
            if(this._getKeyAction(key) === 'DROP')
                return `DROP COLUMN ${keyName}`;
            else
                return `${this._getKeyAction(key)} COLUMN ${keyName} ${key.type} ${options}`.trim();
        }).join(',\n');
    }

    _getPrimary() {
        if(this._table._primary && this._table._primary.action === 'ADD')
            return `ADD PRIMARY KEY (${this._client.escapeKey(this.table._primary.name)})\n`;
        else if(this._table._primary && this._table._primary.action === 'DROP')
            return `DROP PRIMARY KEY\n`;
        else return '';
    }

    _getIndexes() {
        return this.table._indexes.length > 0? stripIndents`
            ${this.table._indexes.map(index => {
                if(index.action === 'ADD')
                    return `ADD INDEX ${this._client.escapeKey(index.alias)} (${this._client.escapeKey(index.name)})`;
                else
                    return `DROP INDEX ${this._client.escapeKey(index.alias)}`;
            }).join(',\n')}
        ` : '';
    }

    _getUniques() {
        return this.table._uniques.length > 0? stripIndents`
            ${this.table._uniques.map(unique => {
                if(unique.action === 'ADD')
                    return `ADD CONSTRAINT ${this._client.escapeKey(unique.alias)} UNIQUE (${this._client.escapeKey(unique.name)})`;
                else
                    return `DROP INDEX ${this._client.escapeKey(unique.alias)}`;
            }).join(',\n')}
        ` : '';
    }

    toString() {
        return stripIndents`
            ALTER TABLE \`${this.table._tableName}\`
            ${[this._getKeys(), this._getPrimary(), this._getIndexes(), this._getUniques()].join(',\n')};
        `;
    }
}

class DropStatement {

    _table: Table;
    _client: typeof Client;

    constructor(tableName: string, client: typeof Client) {
        this._table = new Table(tableName);
        this._client = client;
    }

    get table() {
        return this._table;
    }

    toString() {
        return stripIndents`
            DROP TABLE IF EXISTS ${this._client.escapeKey(this.table._tableName)};
        `;
    };
}

class SeedStatement {
    
    _table: Table;
    _seeds: {[name: string]: any}[];
    _client: typeof Client;

    constructor(tableName: string, seeds: {[name: string]: any}[], client: typeof Client) {
        this._table = new Table(tableName);
        this._seeds = seeds;
        this._client = client;
    }

    get table() {
        return this._table;
    }

    _getSeeds() {
        const seedList: string[] = [];
        let isFirst = true;
        let seedKeys: string[] = [];

        for(let seed of this._seeds) {
            // Get the list of keys from the first item
            if(isFirst) {
                seedKeys = seedKeys.concat(Object.keys(seed));
                isFirst = false;
            }

            // Prepare key values
            const keyValues: any[] = [];
            for(let key of seedKeys) {
                const value = seed[key];
                keyValues.push(value? `'${value}'` : 'NULL');
            }

            // Concatenate key values
            seedList.push(`(${keyValues.join(', ')})`)
        }

        // Return seed list
        return {
            keys: seedKeys.map(key => `\`${key}\``).join(', '),
            values: seedList.join(',\n')
        };
    }

    toString() {
        const { keys, values } = this._getSeeds();

        return stripIndents`
            INSERT INTO ${this._client.escapeKey(this.table._tableName)}
            (${keys})
            VALUES
            ${values};
        `;
    }
}

class TruncateStatement {

    _table: Table;
    _client: typeof Client;

    constructor(tableName: string, client: typeof Client) {
        this._table = new Table(tableName);
        this._client = client;
    }

    get table() {
        return this._table;
    }

    toString() {
        return stripIndents`
            TRUNCATE TABLE ${this._client.escapeKey(this.table._tableName)};
        `;
    }
}

class ExecuteStatement {

    _query: string;

    constructor(query: string) {
        this._query = query;
    }

    toString() {
        // Created intermediate function to avoid tsc conflicts
        const indentStrip: (query: any) => string = stripIndents;
        return indentStrip(this._query);
    }
}