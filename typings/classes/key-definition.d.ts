export default class KeyDefinition {
    _name: string;
    _type: string;
    _action?: 'ADD' | 'MODIFY' | 'DROP';
    _nullable: boolean;
    _increments: boolean;
    _charset: string;
    _collation?: string;
    _before?: string;
    _after?: string;
    constructor(key: string, type: string);
    nullable(flag?: boolean): this;
    increments(flag?: boolean): this;
    charset(name: string, collation?: string): this;
    before(column: string): this;
    after(column: string): this;
    add(): void;
    modify(): void;
    drop(): void;
    readonly name: string;
    readonly type: string;
    readonly action: "ADD" | "MODIFY" | "DROP" | undefined;
}
