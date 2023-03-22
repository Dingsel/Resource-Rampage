import { ScreenDisplay } from "@minecraft/server";
import { InfoMapProperties } from "resources";
//import { TowerDefenition } from "gameplay/building";
import { GameDatabase } from "utils";

const {
    parse, stringify, Array: { from: map, isArray }, Object: { assign }
} = {
    parse: JSON.parse.bind(JSON), stringify: JSON.stringify.bind(JSON), Array, Object
};

system.events.gameInitialize.subscribe(() => {
    setInterval(() => {
        for (const player of world.getPlayers()) {

            player.onScreenDisplay.setTitle([
                ``,
                `Coins: ${global.infoMap.get(InfoMapProperties.coins)}`
            ].join('\n'))

            const { onScreenDisplay, nameTag, scores, selectedTower } = player;
            const playerInfo = { nameTag, scores, selectedTower }
            setDisplay(onScreenDisplay,playerInfo)
        }
    }, 10)
});

/**
 * @param {ScreenDisplay} screen
 * @param {playerInfo} playerInfo
 * */
async function setDisplay(screen, playerInfo) {
    const {nameTag} = playerInfo
    assign(this, {
        setTitle:[
            , ,
            `§gCoin${global.infoMap.get(InfoMapProperties.coins) > 1 ? 's' : ''}§8:§r ${global.infoMap.get(InfoMapProperties.coins).unitFormat(1, '§g')}`,
            ``,
        ],
        setActionBar: [

        ]
    })
    for (const k in this) screen[k](this[k].join('\n'))
    return true;
}
///const d = GameDatabase.getDatabase(objectives.gameplay).entries() -> this could broke whole system please use global.infoMap or global.databse
// print(stringify(d))

export { };



/**
 * @typedef {Object} playerInfo
 * @property {TowerDefenition} selectedTower
 * @property {string} nameTag
 * @property {{[key:string]:number}} scores
 */