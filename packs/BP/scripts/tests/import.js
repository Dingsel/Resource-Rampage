import { MessageSourceType, Player, system, world } from '@minecraft/server';
import { tests } from './tests.js';

system.events.scriptEventReceive.subscribe(async (any) => {
    const { id } = any;
    let test = id.split(':')[1];
    if (test in tests) {
        try {
            var a = await tests[test](any);
        } catch (error) {
            console.error(`§cTest "${id}" failed with error: \n${error}\n${error.stack}`);
        }
        if (a) console.warn(`§2Test "${id}" was susccessfully executed.`)
        else console.error(`§cTest "${id}" failed.`);
    }
    else console.error("Test cannot be found, available tests: §l§2\n" + Object.keys(tests).map(n => `tests:${n}`).join('\n'));
}, { namespaces: ["tests"] });