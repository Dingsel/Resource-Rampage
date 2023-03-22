import { GameDatabase, ScoreboardMap, SessionGameElement } from 'utils';
import { config } from 'config';

/**@type {{castle:import('utilities/import').Castle,initialized:boolean,config:typeof config, infoMap: ScoreboardMap, session:SessionGameElement,database:GameDatabase}}*/
const global = globalThis.global??{
    initialized:false,
    config
};
globalThis.global = global;
export { global };
export default global;
//use import {global} from 'global.js';
//or import global from 'global.js'