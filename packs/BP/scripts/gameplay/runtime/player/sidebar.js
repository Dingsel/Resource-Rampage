import { ScreenDisplay } from "@minecraft/server";
import { InfoMapProperties } from "resources";

const {
    parse, stringify, Array: { from: map, isArray }, Object: { assign }, n_, u,
    InfoMapProperties: { coins, kills, level }, Date: { now }
} = {
    parse: JSON.parse.bind(JSON), stringify: JSON.stringify.bind(JSON), Array, Object, n_: '§r\n',
    InfoMapProperties, Date,
    u: function (n, a, s, e = 3, c = 1) { return n.unitFormat(a, s, e, c) }
};
const { scoreboard, overworld: ovw } = world;
const obj = scoreboard.getObjective('online') ?? scoreboard.addObjective('online', 'online')
const getAllPlayers = world.getAllPlayers.bind(world);
const getEntities = ovw.getEntities.bind(ovw);
function getTowers() { return global.database.getTowerIDsAsync(); }

const interval = 15;
let dateStamp = now();
/**@returns {Promise<[string,string]>} */
function playerDate({ name }, pts = scoreboard.getParticipants()) {
    return new Promise(async (res, rej) => {
        for (const pt of pts) {
            let { displayName: n } = pt
            if (!n.endsWith('§r' + name)) continue
            return res([(pt.getScore(obj)).toHHMMSS(), n.split('§r')[1]])
        } rej()
    })
};
const wa = (a, b = 6) => {
    const c = b ? stringify(a, 0, b) : a
    a.stack ? console.warn(a.message, a.stack) : console.warn(c);;
};


system.events.gameInitialize.subscribe(() => {
    const objId = `"${obj.id}"`
    setInterval((players = getAllPlayers()) => {
        const dateNow = now();
        let msScore = dateNow - dateStamp;
        dateStamp = dateNow;
        players.forEach(async ({ name }) => {
            for (const { displayName: n } of obj.getParticipants()) {
                if (!n.endsWith('§r' + name)) continue
                return await runCommand(`scoreboard players add "${n}" ${objId} ${msScore}`)
            }
        })
    })
    setInterval(async ({ infoMap, session } = global) => {
        const players = getAllPlayers();
        const mobs = getEntities({ families: ["enemy"] });
        const participants = obj.getParticipants();
        const builds = (await getTowers())
        const info = {
            session: {
                time: (session.time).toHHMMSS()
            },
            iMap: [infoMap.get(coins), infoMap.get(kills), infoMap.get(level)],
            online: players.length,
            all: participants.length,
            enemies: mobs.length,
            towers: builds.length
        };
        for (const player of players) {
            await nextTick;
            if (!player.isOnline) continue;
            const myTime = await playerDate(player, participants).catch(errorHandle)
            const { onScreenDisplay, scores, selectedTower } = player;
            const tips = player.getTips();
            tips.forEach(tip => tip.timeout -= interval);;
            const ui = player.getTags().find(t => t.match(/,ui/)) ?? ',';
            const playerInfo = { scores, selectedTower, ui, myTime, tips: tips.map(tip => tip.content) };
            await setDisplay(onScreenDisplay, playerInfo, info);
            player.setTips(tips.filter(tip => tip.timeout > 0));
        }
    }, interval)
});



const { wood, stone, coin, colon } = {
    wood: '\uE110', stone: '\uE111', coin: '\uE112', colon: '§8:§r '
}
/** @param {ScreenDisplay} screen @param {playerInfo} playerInfo @param {otherInfo} info */
async function setDisplay(screen,
    { ui, myTime: [myTime, name], tips },
    { session, iMap: [c, k, lvl], online, all, enemies, towers }
) {
    const [a, b] = ui.split(',')
    const mini = /§´/.test(a) ? '§´' : '';
    const indent = mini + `§u-<(====: BAO JAM :====)>-`;
    const indent2 = mini + `§u-<(====: Tips :====)>-`;
    const ind2 = indent.replace(' BAO JAM ', '----');
    const S = '§p'

    return await (async () =>
        screen.setActionBar([
            , indent,
            `${S + b}Player${colon + a + name}`,
            `${S + b}Playtime${colon + myTime}`,
            ,
            `${S + b}Online Players${colon}§a${online}§r/§2${all}`,
            `${S + b}Session${colon + session.time}`,
            , ind2,
            `${S + b}Coin${c > 1 ? 's' : ''}${colon + u(c, 1, S)}${coin}`,
            // `${St+b}Wood${colon + u(w, 1, S)}`,
            // `${St+b}Stone${colon + u(s, 1, S)}`,
            `${S + b}Kills${colon + u(k, 1, S)}`,
            `${S + b}Level${colon + u(lvl, 1, S)}`,
            , ind2,
            `${S + b}Enemies${colon + enemies}`,
            `${S + b}Towers${colon + towers}`
            , indent2,
            ...tips
        ].join(n_))
    )()
};


export { };



/**
 * @typedef {Object} playerInfo
 * @property {TowerDefenition} selectedTower
 * @property {string} nameTag
 * @property {[string,string]} myTime
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

