export default class UniqueDefinition {
    _name: string;
    _action?: 'ADD' | 'DROP';
    constructor(key: string);
    add(): void;
    drop(): void;
    readonly name: string;
    readonly action: "ADD" | "DROP" | undefined;
}
