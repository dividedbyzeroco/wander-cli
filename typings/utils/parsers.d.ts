import Versioning from './versioning';
export declare const extractVersion: (dir: string, filename: string) => Versioning;
export declare const extractDatabaseConfig: (databaseURI: string) => {
    protocol: any;
    host: any;
    port: any;
    user: any;
    password: any;
    schema: any;
};
export declare const toCamelCase: (value: string, delimiter?: string) => string;
export declare const toPascalCase: (value: string, delimiter?: string) => string;
export declare const toSpaceSeparated: (value: string) => string;
