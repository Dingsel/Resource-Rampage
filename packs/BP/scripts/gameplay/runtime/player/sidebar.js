import { ScreenDisplay } from "@minecraft/server";
import { InfoMapProperties, uiFormat } from "resources";
import { GameDatabase } from "utils";

const {
    parse, stringify, Array: { from: map, isArray }, Object: { assign }, n_, u,
    InfoMapProperties: { coins, kills, level },
    uiFormat: { Bold: bold, Italic: italic, Obfuscated: obfus, Special: special, color }
} = {
    parse: JSON.parse.bind(JSON), stringify: JSON.stringify.bind(JSON), Array, Object, n_: '§r\n',
    InfoMapProperties,
    uiFormat, u: function (n, a, s) { return n.unitFormat(a, s) }
};

const wa = (a, b = 6) => {
    const c = b ? stringify(a, 0, b) : a
    a.stack ? console.warn(a, a.stack) : console.warn(c);;
}


system.events.gameInitialize.subscribe(() => {
    setInterval(async ({ infoMap } = global) => {
        const [c, k, lvl] = [infoMap.get(coins), infoMap.get(kills), infoMap.get(level)]

        // wa({ coins, kills, level })

        for (const player of world.getPlayers()) {
            const { onScreenDisplay, nameTag, scores, selectedTower } = player;
            const ui = player.getTags().find(t => t.match(/,ui/)) ?? ','
            const playerInfo = { nameTag, scores, selectedTower, ui }
            await setDisplay(onScreenDisplay, playerInfo, { c, k, lvl })
        }
    }, 10)
});

/**
 * @param {ScreenDisplay} screen
 * @param {playerInfo} playerInfo
 * @param {otherInfo} info
 * */
async function setDisplay(screen, playerInfo, info) {
    const { nameTag, ui } = playerInfo, { c, k, lvl } = info;
    const [a, b] = ui.split(',')
    //left screen
    screen.setActionBar([,
        `${b+nameTag}`,
        `${a}Coin${c > 1 ? 's' : ''}§8:§r ${u(c, 1, b)}`,
        `${a}Kills§8:§r ${u(k, 1, b)}`,
        `${a}Level§8:§r ${u(lvl, 1, b)}`
    ].join(n_))

    return true;
}


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
 * @property {number} c
 * @property {number} k
 * @property {number} lvl
 */

