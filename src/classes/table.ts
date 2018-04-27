import KeyDefinition from './key-definition';
import { Keys } from '../utils/constants';
import IndexDefinition from './index-definition';
import UniqueDefinition from './unique-definition';
import PrimaryDefinition from './primary-definition';

export default class Table {
    _tableName: string;
    _keys: KeyDefinition[] = [];
    _primary: PrimaryDefinition;
    _indexes: IndexDefinition[] = [];
    _uniques: UniqueDefinition[] = [];

    constructor(tableName: string) {
        this._tableName = tableName;
    }

    id(key?: string) {
        // Get id key
        const id = key || Keys.Id;

        // Create key definition
        const keyDefinition = new KeyDefinition(id, 'int');
        keyDefinition.nullable(false);
        keyDefinition.increments(true);
        this._keys.push(keyDefinition);

        // Set primary key
        this.primary(id);

        // Return key definition
        return keyDefinition;
    }

    timestamps() {
        // Loop through each timestamp and create datetime keys
        for(let timestamp of Keys.Timestamps) this.datetime(timestamp);
    }

    string(key: string, length: number = 30) {
        const keyDefinition = new KeyDefinition(key, `varchar(${length})`);
        this._keys.push(keyDefinition);
        return keyDefinition;
    }

    text(key: string, length: number = 30) {
        const keyDefinition = new KeyDefinition(key, `text`);
        keyDefinition.charset('utf8mb4', 'utf8mb4_unicode_ci');
        this._keys.push(keyDefinition);
        return keyDefinition;
    }

    integer(key: string) {
        const keyDefinition = new KeyDefinition(key, 'int');
        this._keys.push(keyDefinition);
        return keyDefinition;
    }

    decimal(key: string, length: number = 8, precision: number = 2) {
        const keyDefinition = new KeyDefinition(key, `decimal(${length}, ${precision})`);
        this._keys.push(keyDefinition);
        return keyDefinition;
    }

    double(key: string, length: number = 8, precision: number = 2) {
        const keyDefinition = new KeyDefinition(key, `double(${length}, ${precision})`);
        this._keys.push(keyDefinition);
        return keyDefinition;
    }

    float(key: string, length: number = 8, precision: number = 2) {
        const keyDefinition = new KeyDefinition(key, `float(${length}, ${precision})`);
        this._keys.push(keyDefinition);
        return keyDefinition;
    }

    pointer(key: string) {
        return this.integer(key + `_${Keys.Id}`);
    };

    boolean(key: string) {
        const keyDefinition = new KeyDefinition(key, 'bit');
        this._keys.push(keyDefinition);
        return keyDefinition;
    }

    date(key: string) {
        const keyDefinition = new KeyDefinition(key, 'date');
        this._keys.push(keyDefinition);
        return keyDefinition;
    }

    datetime(key: string) {
        const keyDefinition = new KeyDefinition(key, 'datetime');
        this._keys.push(keyDefinition);
        return keyDefinition;
    }

    json(key: string) {
        const keyDefinition = new KeyDefinition(key, 'json');
        this._keys.push(keyDefinition);
        return keyDefinition;
    }

    primary(key: string) {
        const primary = new PrimaryDefinition(key);
        this._primary = primary;
        return primary;
    }

    index(key: string, alias = key) {
        const index = new IndexDefinition(key, alias);
        this._indexes.push(index);
        return index;
    }

    unique(key: string, alias = key) {
        const unique = new UniqueDefinition(key, alias);
        this._uniques.push(unique);
        return unique;
    }
}