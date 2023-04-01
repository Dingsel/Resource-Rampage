import { world } from "@minecraft/server";
const ovw = world.getDimension("overworld")
ovw.runCommandAsync("say ran")

const game_spawn = { x: 88, y: 75, z: 88 }

events.dataDrivenEntityTriggerEvent.subscribe(playerTryStartGame)

function playerTryStartGame(eventData){
    if (eventData.id == "dest:start_game"){
        eventData.entity.teleportFacing(game_spawn,ovw,game_spawn)
    }
}
