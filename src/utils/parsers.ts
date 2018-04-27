import parseUrl from 'parse-url';
import path from 'path';
import { Delimiters } from './constants';
import Versioning from './versioning';

export const extractVersion = (dir: string, filename: string) => {
    const versionString = filename.replace(path.join(dir, '/v'), '').replace('.js', '').split(Delimiters.Separator)[0];
    const [ major, minor, patch ] = versionString.split(Delimiters.FileSafe).map(item => parseInt(item));
    return new Versioning(major, minor, patch);
};

export const extractDatabaseConfig = (databaseURI: string) => {
    const parsedURI = parseUrl(databaseURI);
    const identity = parsedURI.user.split(':');

    return {
        protocol: parsedURI.protocol,
        host: parsedURI.resource,
        port: parsedURI.port,
        user: identity[0],
        password: identity[1],
        schema: parsedURI.pathname.slice(1)
    };
};

export const toCamelCase = (value: string, delimiter: string = '') => {
    return value.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(delimiter);
};

export const toPascalCase = (value: string, delimiter: string = '') => {
    value = toCamelCase(value, delimiter);
    value = value[0].toUpperCase() + value.slice(1);
    return value;
};

export const toSpaceSeparated = (value: string) => {
    return toCamelCase(value, ' ').toLowerCase();
};
