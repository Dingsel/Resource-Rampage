import { ScreenDisplay } from "@minecraft/server";
import { InfoMapProperties, uiFormat } from "resources";
import { GameDatabase } from "utils";

const {
    parse, stringify, Array: { from: map, isArray }, Object: { assign }, n_, u,
    InfoMapProperties: { coins: c, kills: k, level: lvl },
    uiFormat: { Bold: bold, Italic: italic, Obfuscated: obfus, Special: special, color }
} = {
    parse: JSON.parse.bind(JSON), stringify: JSON.stringify.bind(JSON), Array, Object, n_: '\n',
    InfoMapProperties,
    uiFormat, u: function (n, a, s) { return n.unitFormat(a, s) }
};

const wa = (a, b = 6) => {
    const c = b ? stringify(a, 0, b) : a
    a.stack ? console.warn(a, a.stack) : console.warn(c);;
}


system.events.gameInitialize.subscribe(() => {
    setInterval(async ({ infoMap } = global) => {
        const [coins, kills, level] = [infoMap.get(c), infoMap.get(k), infoMap.get(lvl)]

        // wa({ coins, kills, level })

        for (const player of world.getPlayers()) {
            const { onScreenDisplay, nameTag, scores, selectedTower } = player;
            const ui = player.getTags().find(t => t.match(/,ui/)) ?? ','
            const playerInfo = { nameTag, scores, selectedTower, ui }
            await setDisplay(onScreenDisplay, playerInfo, { coins, kills, level })
        }
    }, 10)
});

/**
 * @param {ScreenDisplay} screen
 * @param {playerInfo} playerInfo
 * @param {otherInfo} info
 * */
async function setDisplay(screen, playerInfo, info) {
    const { nameTag, ui } = playerInfo, { coins, kills, level } = info;
    const [a, b] = ui.split(',')
    screen.setTitle([,
        `${a}Coin${coins > 1 ? 's' : ''}§8:§r ${u(coins, 1, b)}`,
        `${a}Kills§8:§r ${u(kills, 1, b)}`,
        `${a}Level§8:§r ${u(level, 1, b)}`,
    ].join(n_))
    return true;
}
///const d = GameDatabase.getDatabase(objectives.gameplay).entries() -> this could broke whole system please use global.infoMap or global.databse
// print(stringify(d))

export { };



/**
 * @typedef {Object} playerInfo
 * @property {TowerDefenition} selectedTower
 * @property {string} nameTag
 * @property {'§,§,'} ui
 * @property {{[key:string]:number}} scores
 */

/**
 * @typedef {Object} otherInfo
 * @property {number} coins
 * @property {number} kills
 * @property {number} level
 */

