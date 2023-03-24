import { GameMode, MinecraftEffectTypes, MinecraftEntityTypes, MolangVariableMap, Player, system, Vector, world, World } from "@minecraft/server";
import { ArcherTowerLevelStructure } from "resources";
import { ImpulseParticlePropertiesBuilder, SquareParticlePropertiesBuilder } from "utilities/MolangVariableMaps";


events.playerSpawn.subscribe(async ({ player, initialSpawn }) => {
    if (!initialSpawn) {
        try {
        } catch (error) {
            errorHandle(error);
        }
    }
});
events.entityDie.subscribe(async ({ deadEntity }) => {
    const { location, dimension } = deadEntity;
    deadEntity.setSpawn(location, dimension);
    await deadEntity.setGameMode(GameMode.spectator);
    deadEntity.setMovementPermission(false);
    deadEntity.setCameraPermission(false);
    await sleep(3);
    const loc1 = {x:82,y:100,z:52};
    let last = -1;
    let pass = true;
    for (let loc of deathScreen())
    {
        if(deadEntity.health > 0 && pass) {
            last = 15;pass = false;
        }
        if (last == 5){
            deadEntity.addEffect(MinecraftEffectTypes.blindness,20,5,false);
            deadEntity.setGameMode(global.config.defualt_game_mode);
        }
        if (last-- == 0) break;
        deadEntity.teleportFacing(loc,overworld,loc1);
        await nextTick;
    }
    await deadEntity.setMovementPermission(true);
    await deadEntity.setCameraPermission(true);
    deadEntity.teleportFacing(world.getDefaultSpawnPosition(),overworld,loc1);
}, { entityTypes: [MinecraftEntityTypes.player.id] })

function* deathScreen(){
    const loc2 = {x:82,y:105,z:52};
    while(true) for (let loc of MovingPath(150,300,15,Math.random()*360,0,Math.random()>0.5?1:-1).offSet(loc2)) yield loc;
}

function* MovingPath(radius = 30, steps = 1,angle = 360, offset=0, motion=0, direction = 1){
    const max = angle*Math.PI / 180;
    const ofset = offset*Math.PI/180;
    for (let x = 0, y = 0, z = 0, i = 0, m = 1; i < max; i+= max/steps*m, x = Math.cos((i+ofset)*direction) * radius, z = Math.sin((i+ofset)*direction) * radius, y = 0, m+=motion) 
    { 
        yield {x,y,z};
    }
}
MovingPath.prototype.offSet = function*({x:x1,y:y1,z:z1}){ for (const {x,y,z} of this) yield {x:x+x1,y:y+y1,z:z+z1}; }