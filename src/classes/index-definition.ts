export default class IndexDefinition {
    _name: string;
    _action?: 'ADD' | 'DROP' = 'ADD';

    constructor(key: string) {
        this._name = key;
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

    get action() {
        return this._action;
    }
}