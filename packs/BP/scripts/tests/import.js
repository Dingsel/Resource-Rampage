import {MessageSourceType, Player, system} from '@minecraft/server';
import {tests} from './tests.js'; 

system.events.scriptEventReceive.subscribe(async (any)=>{
    let test = any.id.split(':')[1]
    if(test in tests){
        try {
            var a = await tests[test](any);
        } catch (error) {
            console.error(`§cTest "${any.id}" failed.\n${error}\n${error.stack}`);
        }
        if(a) console.warn(`§2Test "${any.id}" was susccessfully executed.`)
        else console.error(`§cTest "${any.id}" failed.`);
    }
    else console.error("Test can't be found, available tests: §l§2\n" + Object.keys(tests).map(n=>`tests:${n}`).join('\n'));
},{namespaces:["tests"]});