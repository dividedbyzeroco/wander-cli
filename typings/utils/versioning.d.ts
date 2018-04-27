export default class Versioning {
    major: number;
    minor: number;
    patch: number;
    constructor(major: number, minor: number, patch: number);
    readonly fileSafe: string;
    readonly standard: string;
}
export declare const getNextVersion: (dir: string, versionType: string) => Versioning;
