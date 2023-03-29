import { ScreenDisplay } from "@minecraft/server";
import { InfoMapProperties } from "resources";

const {
    parse, stringify, Array: { from: map, isArray }, Object: { assign }, n_, u,
    InfoMapProperties: { coins, kills, level, stones, woods }, Date: { now }
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
            iMap: infoMap.getAll(),
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

const separator = '\uE130\uE131\uE132\uE133\uE134\uE135\uE136\uE137\uE138\uE139\uE130\uE131\uE139\uE130'
const shuffle = str => [...str].sort(() => Math.random() - .5).join('');
/** @param {ScreenDisplay} screen @param {playerInfo} playerInfo @param {otherInfo} info */
async function setDisplay(screen,
    { ui, myTime: [myTime, name], tips },
    { session, iMap: { coins: c, kills: k, level: lvl, stones: s, woods: w }, online, all, enemies, towers }
) {
    const gold = '§p'
    const light_green = '§a'
    const dark_green = '§2'
    const reset = '§r'

    return await (async () =>
        screen.setActionBar([
            ,
            shuffle(separator),
            `§r\uE112 ` + u(c, 1, "") + ` ` + reset + `\uE110 ` + u(w, 1, "") + ` §r\uE111 ` + u(s, 1, ""),
            gold + `Wave: ` + u(lvl, 1, gold),
            gold + `Enemies: ` + enemies,
            shuffle(separator),
            gold + `Game Time: ` + reset + session.time,
            gold + `Online Players: ` + light_green + online + reset + `/` + dark_green + all,
            shuffle(separator)
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

