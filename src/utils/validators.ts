const isValidMigrationName = name => {
    return /^[a-zA-Z\_0-9]*$/.test(name);
};

export {
    isValidMigrationName
};