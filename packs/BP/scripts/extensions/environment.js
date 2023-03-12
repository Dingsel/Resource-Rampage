/** @type {GeneratorFunction} */
export const GeneratorFunction = Object.getPrototypeOf(function*(){});
/** @type {GeneratorFunctionConstructor} */
export const GeneratorFunctionConstructor = GeneratorFunction.constructor;
/** @type {Generator} */
export const Generator = GeneratorFunction.prototype;


/** @type {AsyncGeneratorFunction} */
export const AsyncGeneratorFunction = Object.getPrototypeOf(async function*(){});
/** @type {AsyncGeneratorFunctionConstructor} */
export const AsyncGeneratorFunctionConstructor = AsyncGeneratorFunction.constructor;
/** @type {AsyncGenerator} */
export const AsyncGenerator = AsyncGeneratorFunction.prototype;

/** @type {FunctionConstructor} */
export const AsyncFunctionConstructor = Object.getPrototypeOf(async function(){}).constructor;

import { system } from '@minecraft/server';
//@ts-ignore
const {
    assign, create,
    setPrototypeOf: setProto,
    getPrototypeOf: getProto, 
    getOwnPropertyDescriptors: getProperties, 
    defineProperties: setProperties,
} = Object;

assign(Object,{
    clone(object, newObject = create(getProto(object))){return setProperties(newObject, getProperties(object));},
    clear(object){for (const key of Object.getOwnPropertyNames(object).concat(Object.getOwnPropertySymbols(object))) delete object[key]; return object;},
    addPrototypeOf(object, prototype){return setProto(object,setProto(prototype,getProto(object)));},
    applyOwnGetter(ownGetters, source = ownGetters){
        const descriptor = Object.getOwnPropertyDescriptors(ownGetters);
        const newDescriptor = {};
        for (const p of [...Object.getOwnPropertyNames(descriptor), ...Object.getOwnPropertySymbols(descriptor)]) {
            if(descriptor[p].get != undefined){
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
GeneratorFunction.isGenerator = function isGenerator(generator){ return (generator[Symbol.isGenerator] === true); }
assign(globalThis,{
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
    run: function(callBack) { return Promise.resolve().then(callBack) }
});
console.logLike = console.log;
console.log = console.warn;
setProperties(globalThis,{
    nextTick:{get(){return new Promise(res=>setTimeout(()=>res(system.currentTick + 1)));}},
    currentTick:{get(){return system.currentTick;}}
})

assign(Date.prototype,{
    toHHMMSS(){return this.toTimeString().split(' ')[0];}
    //HH:MM:SS  23:15:23
})
assign(Math,{
    deg(number){return (number * 180)*this.PI}, //degresses
    rad(number){return (number * this.PI)/180}, //radians
    randomBetween(max, min = 0){
        const [n,x] = max > min?[max,min]:[min,max]
        return this.random() * (x - n) + n;
    }
});

Number.unitTypes = ['', 'k', 'M', 'G', 'T', 'E'];
// 56,485 -> 56.4k
assign(Number.prototype,{
    unitFormat: function (place = 1, space = "", exponent = 3, component = 1) {
        for (let i = 0, n = this, c = 10**(exponent + component), e = 10**exponent; true; i++) {
            if(n >= c){
                n /= e;
                continue;
            }
            return n.toFixed(place) + space +  (Number.unitTypes[i]??"");
        }
    }
});
setProperties(Array.prototype, {
    randomElement:{get(){ return this[Math.floor(Math.random()*this.length)];}}
});