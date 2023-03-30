/** @type {GeneratorFunction} */
export const GeneratorFunction = Object.getPrototypeOf(function* () { });
/** @type {GeneratorFunctionConstructor} */
export const GeneratorFunctionConstructor = GeneratorFunction.constructor;
/** @type {Generator} */
export const Generator = GeneratorFunction.prototype;

/** @type {AsyncGeneratorFunction} */
export const AsyncGeneratorFunction = Object.getPrototypeOf(async function* () { });
/** @type {AsyncGeneratorFunctionConstructor} */
export const AsyncGeneratorFunctionConstructor = AsyncGeneratorFunction.constructor;
/** @type {AsyncGenerator} */
export const AsyncGenerator = AsyncGeneratorFunction.prototype;

/** @type {FunctionConstructor} */
export const AsyncFunctionConstructor = Object.getPrototypeOf(async function () { }).constructor;

import { MinecraftDimensionTypes, system, world } from '@minecraft/server';
import './events.js';
//@ts-ignore
const {
    assign, create,
    setPrototypeOf: setProto,
    getPrototypeOf: getProto,
    getOwnPropertyDescriptors: getProperties,
    defineProperties: setProperties,
} = Object,
    { scoreboard, events } = world,
    overworld = world.getDimension(MinecraftDimensionTypes.overworld),
    nether = world.getDimension(MinecraftDimensionTypes.nether),
    theEnd = world.getDimension(MinecraftDimensionTypes.theEnd)
assign(Object.prototype, {
    formatXYZ() { return `§2X§8:§q${this.z} §4Y§8:§c${this.z} §tZ§8:§9${this.z}`; }
});
assign(Object, {
    clone(object, newObject = create(getProto(object))) { return setProperties(newObject, getProperties(object)); },
    clear(object) { for (const key of Object.getOwnPropertyNames(object).concat(Object.getOwnPropertySymbols(object))) delete object[key]; return object; },
    addPrototypeOf(object, prototype) { return setProto(object, setProto(prototype, getProto(object))); },
    applyOwnGetter(ownGetters, source = ownGetters) {
        const descriptor = Object.getOwnPropertyDescriptors(ownGetters);
        const newDescriptor = {};
        for (const p of [...Object.getOwnPropertyNames(descriptor), ...Object.getOwnPropertySymbols(descriptor)]) {
            if (descriptor[p].get != undefined) {
                newDescriptor[p] = {
                    value: descriptor[p].get.call(source)
                }
            }
        }
        return Object.defineProperties(source, newDescriptor);
    }
});
Symbol.isGenerator = Symbol('Symbol.isGenerator');
GeneratorFunction.prototype[Symbol.isGenerator] = true;
GeneratorFunction.isGenerator = function isGenerator(generator) { return (generator[Symbol.isGenerator] === true); }
const ovw = world.getDimension('overworld')
assign(globalThis, {
    GeneratorFunction,
    GeneratorFunctionConstructor,
    AsyncGeneratorFunction,
    AsyncGeneratorFunctionConstructor,
    AsyncFunctionConstructor,
    print: console.warn,
    setInterval: system.runInterval.bind(system),
    setTimeout: system.runTimeout.bind(system),
    clearInterval: system.clearRun.bind(system),
    clearTimeout: system.clearRun.bind(system),
    run: function (callBack) { return Promise.resolve().then(callBack) },
    runCommand: ovw.runCommandAsync.bind(ovw),
    sleep: (n) => new Promise(res => setTimeout(res, n)),
    errorHandle: er => console.error(er?.name ?? er, er?.message ?? '', er?.stack ?? ""),
    system, world, events,scoreboard,
    worldInitialized: new Promise(res => events.worldInitialize.subscribe(res)), overworld, nether, theEnd,
    gameInitialized: new Promise(res => system.events.gameInitialize.subscribe(res))
});

console.logLike = console.log;
console.log = console.warn;
setProperties(globalThis, {
    nextTick: { get() { return new Promise(res => setTimeout(() => res(system.currentTick + 1))); } },
    currentTick: { get() { return system.currentTick; } },
    objectives: {
        value(obj, remove = false) {
            return !remove ? scoreboard.getObjective(obj) ?? scoreboard.addObjective(obj, obj) : scoreboard.removeObjective(obj)
        }
    },
    tier: {
        get() {
            return (world.getDynamicProperty("tier") ?? 0)
        },
        set(n) {
            world.setDynamicProperty("tier", n)
        }
    }
})

assign(Date.prototype, {
    toHHMMSS() { return this.toTimeString().split(' ')[0]; }
    //HH:MM:SS  23:15:23
})
assign(Math, {
    deg(number) { return (number * 180) * this.PI }, //degresses
    rad(number) { return (number * this.PI) / 180 }, //radians
    randomBetween(max, min = 0) {
        const [n, x] = max > min ? [max, min] : [min, max]
        return this.random() * (x - n) + n;
    }
});

Number.unitTypes = ['', 'k', 'M', 'G', 'T', 'E'];
Number.createUID = function () { return `${~~(__date_clock() / 1000000)}-${system.currentTick}-${~~(Math.random() * 900 + 100)}`; }
// 56,485 -> 56.4k
assign(Number.prototype, {
    unitFormat: function (place = 1, space = "", exponent = 3, component = 1) {
        for (let i = 0, n = this, c = 10 ** (exponent + component), e = 10 ** exponent; true; i++) {
            if (n >= c) {
                n /= e;
                continue;
            }
            return nFix(n, place) + space + (Number.unitTypes[i] ?? "");
        }
    },
    floor() { return ~~this },
    toHHMMSS() { return new Date(this).toHHMMSS(); }
});
function nFix(num, place) {
    let n = "" + num;
    let n2 = n.split('.');
    if (n2.length == 1) return n;
    else if (n2[1]?.length < place) return n;
    else return num.toFixed(place);

}
setProperties(Array.prototype, {
    x: { get() { return this[0] } },
    y: { get() { return this[1] } },
    z: { get() { return this[2] } },
    randomElement: { get() { return this[Math.floor(Math.random() * this.length)]; } },
    remove: {
        value(value) {
            let i = this.indexOf(value);
            if (i > -1) this.splice(i, 1);
            return this;
        }
    },
    removeAll: {
        value(value) {
            let i = 0;
            while (i < this.length) {
                if (this[i] === value) this.splice(i, 1);
                else ++i;
            }
            return this;
        }
    }
});