export default class UniqueDefinition {
    _name: string;
    _alias: string;
    _action?: 'ADD' | 'DROP' = 'ADD';

    constructor(key: string, alias: string) {
        this._name = key;
        this._alias = alias;
    }

    add() {
        this._action = 'ADD';
    }

    drop() {
        this._action = 'DROP';
    }

    get name() {
        return this._name;
    }

    get alias() {
        return this._alias;
    }

    get action() {
        return this._action;
    }
}