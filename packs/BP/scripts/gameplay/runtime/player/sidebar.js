import { ScreenDisplay } from "@minecraft/server";
import { InfoMapProperties, uiFormat } from "resources";
import { GameDatabase } from "utils";

const {
    parse, stringify, Array: { from: map, isArray }, Object: { assign }, n_, u,
    InfoMapProperties: { coins, kills, level }
} = {
    parse: JSON.parse.bind(JSON), stringify: JSON.stringify.bind(JSON), Array, Object, n_: '§r\n',
    InfoMapProperties,
    u: function (n, a, s,e=3,c=1) { return n.unitFormat(a, s,e,c) }
};
const { scoreboard, overworld: ovw } = world;
const obj = scoreboard.getObjective('online') ?? scoreboard.addObjective('online', 'online')
const getAllPlayers = world.getAllPlayers.bind(world);
const getEntities = ovw.getEntities.bind(ovw);
function getTowers() { return global.database.getTowerIDsAsync(); }
const wa = (a, b = 6) => {
    const c = b ? stringify(a, 0, b) : a
    a.stack ? console.warn(a.message, a.stack) : console.warn(c);;
}
const interval = 15;


system.events.gameInitialize.subscribe(() => {
    setInterval(async ({ infoMap } = global) => {
        const [c, k, lvl] = [infoMap.get(coins), infoMap.get(kills), infoMap.get(level)];
        const players = getAllPlayers();
        const { length: online } = players;
        const enemies = getEntities({ families: ["enemy"] }).length;
        const participants = scoreboard.getObjective('online').getParticipants();
        const all = participants.length;
        const towers = (await getTowers()).length

        for (const player of players) {
            await nextTick;
            if(!player.isOnline) continue;
            const { onScreenDisplay, nameTag, scores, selectedTower } = player, tips = player.getTips(); 
            tips.forEach(tip=>tip.timeout-=interval);
            const ui = player.getTags().find(t => t.match(/,ui/)) ?? ',';
            const playerInfo = { nameTag, scores, selectedTower, ui, tips:tips.map(tip=>tip.content) };
            const info = { c, k, lvl, online, all, enemies, towers }
            await setDisplay(onScreenDisplay, playerInfo, info,).catch(errorHandle)
            player.setTips(tips.filter(tip=>tip.timeout>0));
        }
    }, interval)
});
const { wood, stone, coin } = {
    wood: '\uE110', stone: '\uE111', coin: '\uE112'
}

/**
 * @param {ScreenDisplay} screen
 * @param {playerInfo} playerInfo
 * @param {otherInfo} info
 * */
async function setDisplay(screen, playerInfo, info) {
    const { nameTag, ui, tips } = playerInfo,
        { c, k, lvl, online, all, enemies, towers } = info;
    const [a, b] = ui.split(',')
    const indent = (/§´/.test(a) ? '§´' : '') + `§u-<(====: BAO JAM §r§u:====)>-`;
    const indent2 = (/§´/.test(a) ? '§´' : '') + `§u-<(====: Tips §r§u:====)>-`;
    const ind2 = indent.replace(' BAO JAM ', '----');
    screen.setActionBar([
        , indent,
        `${b}Player§8:§r ${a + nameTag}`,
        `${b}Coin${c > 1 ? 's' : ''}§8:§r ${u(c, 1, a)}${coin}`,
        // `${b}Wood§8:§r ${u(w, 1, a)}`,
        // `${b}Stone§8:§r ${u(s, 1, a)}`,
        `${b}Kills§8:§r ${u(k, 1, a)}`,
        `${b}Level§8:§r ${u(lvl, 1, a)}`,
        , ind2,
        `${b}Online Players§8:§r §a${online}§r/§2${all}`,
        , ind2,
        `${b}Enemies§8:§r ${enemies}`,
        `${b}Towers§8:§r ${towers}`
        , indent2, ...tips
    ].join(n_))

    return true;
};


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
 * @property {number} online
 * @property {number} all
 * @property {number} enemies
 * @property {number} towers
 * 
 */

