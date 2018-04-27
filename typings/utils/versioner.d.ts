export default class Versioner {
    major: number;
    minor: number;
    patch: number;
    constructor(major: number, minor: number, patch: number);
    readonly fileString: string;
    readonly dotString: string;
}
