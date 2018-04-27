"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delimiters = Object.freeze({
    FileSafe: '_',
    Standard: '.',
    Separator: '__'
});
exports.Environments = Object.freeze({
    Default: 'default',
    Production: 'production',
    Staging: 'staging',
    Development: 'development'
});
exports.Filenames = Object.freeze({
    Config: 'wrconfig.json',
    History: 'wrhistory.json',
    GitIgnore: '.gitignore'
});
exports.Directories = Object.freeze({
    Root: './',
    Migrations: './migrations'
});
exports.Keys = Object.freeze({
    Id: 'id',
    Timestamps: [
        'created_at',
        'updated_at',
        'deleted_at'
    ]
});
//# sourceMappingURL=constants.js.map