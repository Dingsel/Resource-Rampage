export const promise = Start();

async function Start(){
    await worldInitialized;
    if(!(await overworld.runCommandAsync('function onStart')).successCount) console.error("Faild to execute onStart function.");
}