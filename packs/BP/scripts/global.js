import { GameDatabase, ScoreboardMap, SessionGameElement } from 'utils';

/**@type {{castle:import('utilities/import').Castle,initialized:boolean,infoMap: ScoreboardMap, session:SessionGameElement,database:GameDatabase}}*/
const global = globalThis.global??{
    initialized:false
};
globalThis.global = global;
export { global };
export default global;
//use import {global} from 'global.js';
//or import global from 'global.js'