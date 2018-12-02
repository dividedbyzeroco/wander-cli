import KeyDefinition from './key-definition';
import IndexDefinition from './index-definition';
import UniqueDefinition from './unique-definition';
import PrimaryDefinition from './primary-definition';
export default class Table {
    _tableName: string;
    _keys: KeyDefinition[];
    _primary: PrimaryDefinition;
    _indexes: IndexDefinition[];
    _uniques: UniqueDefinition[];
    constructor(tableName: string);
    id(key?: string): KeyDefinition;
    timestamps(): void;
    string(key: string, length?: number): KeyDefinition;
    text(key: string, length?: number): KeyDefinition;
    integer(key: string): KeyDefinition;
    decimal(key: string, length?: number, precision?: number): KeyDefinition;
    double(key: string, length?: number, precision?: number): KeyDefinition;
    float(key: string, length?: number, precision?: number): KeyDefinition;
    pointer(key: string): KeyDefinition;
    boolean(key: string): KeyDefinition;
    date(key: string): KeyDefinition;
    datetime(key: string): KeyDefinition;
    json(key: string): KeyDefinition;
    primary(key: string): PrimaryDefinition;
    pointerIndex(key: string, alias?: string): IndexDefinition;
    index(key: string, alias?: string): IndexDefinition;
    unique(key: string, alias?: string): UniqueDefinition;
}
