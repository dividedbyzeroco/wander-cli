export const Delimiters = Object.freeze({
    FileSafe: '_',
    Standard: '.',
    Separator: '__'
});

export const Environments = Object.freeze({
    Default: 'default',
    Production: 'production',
    Staging: 'staging',
    Development: 'development'
});

export const Filenames = Object.freeze({
    Config: 'wrconfig.json',
    History: 'wrhistory.json',
    GitIgnore: '.gitignore'
});

export const Directories = Object.freeze({
    Root: './',
    Migrations: './migrations'
});

export const Keys = Object.freeze({
    Id: 'id',
    Timestamps: [
        'created_at',
        'updated_at',
        'deleted_at'
    ]
});