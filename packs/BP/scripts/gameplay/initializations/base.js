import { config } from "config";

export const promise = Start();
world.setDefaultSpawn(config.default_spawn_point);

async function Start(){
    await worldInitialized;
    if(!(await overworld.runCommandAsync('function onStart')).successCount) console.error("Faild to execute onStart function.");
}