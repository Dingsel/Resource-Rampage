import {MessageSourceType, Player, system} from '@minecraft/server';
import {tests} from './tests.js'; 

system.events.scriptEventReceive.subscribe(async (any)=>{
    let test = any.id.split(':')[1]
    if(test in tests){
        try {
            var a = await tests[test](any);
        } catch (error) {
            console.error(`§4Test "${any.id}" faild.\n${error}`);
        }
        if(a) console.warn(`§2Test "${any.id}" was susccessfully executed.`)
        else console.error(`§4Test "${any.id}" faild.`);
    }
    else console.error("Test cant be found, available tests: §l§2\n" + Object.keys(tests).map(n=>`tests:${n}`).join('\n'));
},{namespaces:["tests"]});