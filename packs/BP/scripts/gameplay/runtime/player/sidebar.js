import { InfoMapProperties } from "resources";


const separator = '\uE130\uE131\uE132\uE133\uE134\uE135\uE136\uE137\uE138\uE139\uE130\uE131\uE139\uE130\uE134\uE132';
const shuffle = str => [...str].sort(() => Math.random() - .5).join('');
const g = '§g', r = '§r';
const obj = scoreboard.getObjective('online') ?? scoreboard.addObjective('online', 'online');


system.events.gameInitialize.subscribe(()=>{
    setInterval(onInterval,15);
});
async function onInterval(){
    const text = getSidebar();
    for (const p of world.getPlayers()) await p.onScreenDisplay.setActionBar(text);
}
function getSidebar(){const {coins,stone,session,wood,infoMap} = global;
    return [,
        shuffle(separator),
        `§r\uE112 ${coins.unitFormat()} §r\uE110 ${wood.unitFormat()} §r\uE111 ${stone.unitFormat()}`,
        g + `Wave: ` + infoMap.get(InfoMapProperties.level),
        g + `Enemies: ` + overworld.getEntities({families:["enemy"]}).length,
        shuffle(separator),
        g + `Game Time: ` + r + session.time.toHHMMSS(),
        g + `Online Players: §a${world.getAllPlayers().length}/§2${obj.getParticipants().length}`,
        shuffle(separator)
    ].join('\n')
}

