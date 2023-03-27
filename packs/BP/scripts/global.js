import { GameDatabase, ScoreboardMap, SessionGameElement, SafeAreas, RadiusArea } from 'utils';
import config from 'config.js';
import { InfoMapProperties } from 'resources';

const global = {
    initialized:false,
    /**@type {SessionGameElement} */
    session:null,
    /**@type {GameDatabase} */
    database:null,
    config,
    /**@type {ScoreboardMap} */
    infoMap:null,
    safeArea: new SafeAreas(),
    get coins(){return this.infoMap.get(InfoMapProperties.coins)},
    set coins(v){return this.infoMap.set(InfoMapProperties.coins,v)}
};
globalThis.global = global;
export { global };
export default global;
//use import {global} from 'global.js';
//or import global from 'global.js'
