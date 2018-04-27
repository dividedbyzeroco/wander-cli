export default class IndexDefinition {
    _name: string;
    _action?: 'ADD' | 'DROP';
    constructor(key: string);
    add(): void;
    drop(): void;
    readonly name: string;
    readonly action: "ADD" | "DROP" | undefined;
}
