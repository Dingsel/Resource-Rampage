import { GameMode, MinecraftEffectTypes, MinecraftEntityTypes,Player,Vector } from "@minecraft/server";
import { centerLocation } from "resources";


const center = global.config.default_spawn_point;
events.playerSpawn.subscribe(({player})=>shield(player));
events.entityDie.subscribe(async ({ deadEntity }) => {
    deadEntity.runCommandAsync('fog @s push dest:death_fog fog');
    deadEntity.setGameMode(GameMode.spectator);
    deadEntity.setMovementPermission(false);
    deadEntity.setCameraPermission(false);
    for (let loc of deathScreen())
    {
        await nextTick;
        if(!deadEntity.isOnline) return;
        if(deadEntity.health > 0) break;
        deadEntity.teleportFacing(loc,overworld,center);
    }
    await deadEntity.setGameMode(global.config.defualt_game_mode);
    await deadEntity.setMovementPermission(true);
    await deadEntity.setCameraPermission(true);
    deadEntity.teleportFacing(world.getDefaultSpawnPosition(),overworld,center);
    await sleep(10);
    await deadEntity.runCommandAsync('fog @s remove fog');
    await shield(deadEntity,120);
}, { entityTypes: [MinecraftEntityTypes.player.id] })

/** @param {Player} player */
async function shield(player, ticks = 20){
    player.addEffect(MinecraftEffectTypes.instantHealth,ticks,255,false);
    player.addEffect(MinecraftEffectTypes.saturation,99999999,255,false);
    while(ticks--){
        await nextTick;
        for (const e of player.dimension.getEntities({location:player.location, families:["enemy"],maxDistance:5})) e.applyImpulse(Vector.multiply(Vector.subtract(e.location,player.location),0.5));
    }
}

function* deathScreen(r=175,angle = 15){
    angle *= 1 + Math.random()*3;
    while(true) for (let loc of MovingPath(r * (Math.random()+0.5),angle * 15,angle,Math.random()*360,(Math.random()-0.5)/20,(Math.random()>=0.5)?1:-1).offSet(Vector.add(center,{x:0,y:Math.random()*20 + 10,z:0}))) yield loc;
}

function* MovingPath(radius = 30, steps = 1,angle = 360, offset=0, motion=0, direction = 1){
    const max = angle*Math.PI / 180;
    const ofset = offset*Math.PI/180;
    for (let x = radius, y = 0, z = 0, i = 0, m = 1; i < max; i+= max/steps*(Math.abs(m)), x = Math.cos((i+ofset)*direction) * radius, z = Math.sin((i+ofset)*direction) * radius, m+=motion) 
    { 
        yield {x,y,z};
    }
}
MovingPath.prototype.offSet = function*({x:x1,y:y1,z:z1}){ for (const {x,y,z} of this) yield {x:x+x1,y:y+y1,z:z+z1}; }