import { METHODS } from "http";

export default class KeyDefinition {
    _name: string;
    _type: string;
    _action?: 'ADD' | 'MODIFY' | 'DROP';
    _nullable = true;
    _increments = false;
    _charset: string;
    _collation?: string;
    _before?: string;
    _after?: string;

    constructor(key: string, type: string) {
        this._name = key;
        this._type = type;
    }

    nullable(flag: boolean = true) {
        this._nullable = flag;
        return this;
    }

    increments(flag: boolean = false) {
        this._increments = flag;
        return this;
    }

    charset(name: string, collation?: string) {
        this._charset = name;
        this._collation = collation;
        return this;
    }

    before(column: string) {
        this._before = column;
        return this;
    }

    after(column: string) {
        this._after = column;
        return this;
    }

    add() {
        this._action = 'ADD';
    }

    modify() {
        this._action = 'MODIFY';
    }

    drop() {
        this._action = 'DROP';
    }

    get name() {
        return this._name;
    }

    get type() {
        return this._type;
    }

    get action() {
        return this._action;
    }
}