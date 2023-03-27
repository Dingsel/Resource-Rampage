import { MessageSourceType, Player, system, world } from '@minecraft/server';
import { tests } from './tests.js';

system.events.scriptEventReceive.subscribe(async (any) => {
    console.warn("Test");
    const { id } = any;
    let test = id.split(':')[1];
    if (test in tests) {
        try {
            var a = await tests[test](any);
        } catch (error) {
            if (error instanceof Error) (({ name, message, stack }) => {
                console.error(`§cTest "${id}" failed with error:\n    [${name}]: ${message}\n${stack}`)
            })(error)
            else {
                console.error(`§cTest "${id}" failed with error:\n    ${error}`);

            }
        }
        if (a) console.warn(`§2Test "${id}" was susccessfully executed.`)
        else console.error(`§cTest "${id}" failed.`);
    }
    else console.error("Test cannot be found, available tests: §l§2\n" + Object.keys(tests).map(n => `tests:${n}`).join('\n'));
}, { namespaces: ["tests"] });