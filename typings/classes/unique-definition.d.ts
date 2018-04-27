export default class UniqueDefinition {
    _name: string;
    _alias: string;
    _action?: 'ADD' | 'DROP';
    constructor(key: string, alias: string);
    add(): void;
    drop(): void;
    readonly name: string;
    readonly alias: string;
    readonly action: "ADD" | "DROP" | undefined;
}
