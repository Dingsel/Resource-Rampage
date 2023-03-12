const global = globalThis.global??{
    coinId:"dest:coin"
};
globalThis.global = global;
export {global};
export default global;
//use import {global} from 'global.js';
//or import global from 'global.js'