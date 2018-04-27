import Versioning from '../utils/versioning';
import { stripIndent } from 'common-tags';
import { toSpaceSeparated } from '../utils/parsers';

export default (version: Versioning, name) => { 
    return stripIndent`
        module.exports = {
            version() {
                return '${version.standard}';
            },
            description() {
                return '${toSpaceSeparated(name)}';
            },
            up({}) {

            },
            down({}) {
                
            }
        };`;
}