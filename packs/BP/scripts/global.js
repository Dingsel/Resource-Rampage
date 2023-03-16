import { Castle } from "utilities/import";

/**@type {{castle:Castle}}*/
const global = globalThis.global??{};
globalThis.global = global;
export { global };
export default global;
//use import {global} from 'global.js';
//or import global from 'global.js'