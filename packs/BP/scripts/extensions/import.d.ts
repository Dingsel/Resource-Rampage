import * as mc from '@minecraft/server';
import { TowerDefenition } from "../gameplay/building/towers"

declare module "@minecraft/server" {
    namespace Enchantment {
        var Custom: {
            [key: string]: { [key: number]: Enchantment }
        }
    }
    interface Entity {
        readonly inventory?: EntityInventoryComponent;
        readonly container?: Container;
        readonly armor?: EntityEquipmentInventoryComponent;
        health: number;
        cd: number;
        scale: number;
        readonly maxHealth?: number;
        readonly viewBlock?: Block;
        readonly viewEntities: Entity[];
        readonly scores: { [key: string]: number };
        readonly isValidHandle: boolean;
        updateHealths(): void
    }
    interface Container extends IterableIterator<ContainerSlot>{
        [Symbol.iterator](): Generator<ContainerSlot>
    }
    interface Player {
        mainhand: ContainerSlot;
        getGameMode(): GameMode;
        setGameMode(gamemode: Gamemode): Promise<CommandResult>;
        selectedTower?: TowerDefenition;
        readonly isOnline: boolean;
        confirm(body:string, title?:string): Promise<boolean>
        info(body: string, title?: string): Promise<ActionFormResponse>
        sendTip(message: string, timeout?: number): void
        getTips(): ({content:string,timeout:number})[]
        setTips(tips: ({content:string,timeout:number})[]): void
        blueXp: number;
        armorLevel: number;
        swordLevel: number;
        toolsLevel: number;
        shieldLevel: number;
    }
    interface World {
        readonly overworld: Dimension;
        readonly nether: Dimension;
        readonly theEnd: Dimension;
        time: number;
        find(entity: Entity, query: EntityQueryOptions): Entity | false;
        db: Array<structureEntry>;
        round : number
    }
    interface System {
        readonly nextTick: Promise
    }
    interface Dimension {
        setBlock(location: Vector3, type: BlockType | BlockPermutation): number
    }
    interface Block {
        readonly canBeWaterlogged: boolean;
        readonly inventory?: BlockInventoryComponent;
        readonly container?: BlockInventoryComponentContainer;
        setTo(type: mc.BlockType | mc.BlockPermutation): void

    }
    interface ItemStack {
        enchantments: EnchantmentList;
        damage: number;
        setLockMode(lock: ItemLockMOde): this;
        setNameTag(name: string): this;
        setKeepOnDeath(keep: boolean): this;
        setCanDestroy(blockTypes: string[]): this;
    }
    interface SystemEvents {
        readonly gameInitialize: EventSignal;
        readonly tick: EventSignal<[{currentTick:number,deltaTime:number}]>;
    }
    namespace Vector {
        var from: (loc: Vector3) => Vector
        var normalized: (loc: Vector3) => Vector
        var dot: (loc1: Vector3, loc2: Vector3) => Vector3
        var equals:(loc1: Vector3, loc2: Vector3) => boolean
    }
}
declare module "@minecraft/server-ui" {
    interface FormResponse {
        readonly output: (number | (string | number)[])
    }
}

interface structureEntry {
    location: mc.Vector3,
    size: [number, number],
    type: string,
    tier: number,
    /**
     * Returns entity's id, which is a numeric string.
     */
    entity: string
}

declare global {
    var errorHandle: (er) => void;
    var worldInitialized: Promise<void>;
    var gameInitialized: EventSignal;
    var world: mc.World;
    var system: mc.System;
    var events: mc.Events;
    var overworld: mc.Dimension;
    var nether: mc.Dimension;
    var theEnd: mc.Dimension;
    var nextTick: Promise;
    var currentTick: number;
    var scoreboard: Scoreboard
    var run: PromiseConstructor['prototype']['then'];
    var objectives: (key: string, remove?:boolean|undefined)=> mc.ScoreboardObjective ;
    var sleep: (delay: number) => Promise<void>;
    var tier: number
    interface Generator<T = unknown, TReturn = any, TNext = unknown> extends Iterator<T, TReturn, TNext> {
        // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
        next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
        return(value: TReturn): IteratorResult<T, TReturn>;
        throw(e: any): IteratorResult<T, TReturn>;
        [Symbol.iterator](): Generator<T, TReturn, TNext>;
    }
    interface GeneratorFunction {
        /**
         * Creates a new Generator object.
         * @param args A list of arguments the function accepts.
         */
        new(...args: any[]): Generator;
        /**
         * Creates a new Generator object.
         * @param args A list of arguments the function accepts.
         */
        (...args: any[]): Generator;
        /**
         * The length of the arguments.
         */
        readonly length: number;
        /**
         * Returns the name of the function.
         */
        readonly name: string;
        /**
         * A reference to the prototype.
         */
        readonly prototype: Generator;
        isGenerator: (generator: Generator) => generator is Generator
    }
    interface GeneratorFunctionConstructor {
        /**
         * Creates a new Generator function.
         * @param args A list of arguments the function accepts.
         */
        new(...args: string[]): GeneratorFunction;
        /**
         * Creates a new Generator function.
         * @param args A list of arguments the function accepts.
         */
        (...args: string[]): GeneratorFunction;
        /**
         * The length of the arguments.
         */
        readonly length: number;
        /**
         * Returns the name of the function.
         */
        readonly name: string;
        /**
         * A reference to the prototype.
         */
        readonly prototype: GeneratorFunction;
    }
    interface AsyncGenerator<T = unknown, TReturn = any, TNext = unknown> extends AsyncIterator<T, TReturn, TNext> {
        // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
        next(...args: [] | [TNext]): Promise<IteratorResult<T, TReturn>>;
        return(value: TReturn | PromiseLike<TReturn>): Promise<IteratorResult<T, TReturn>>;
        throw(e: any): Promise<IteratorResult<T, TReturn>>;
        [Symbol.asyncIterator](): AsyncGenerator<T, TReturn, TNext>;
    }
    interface AsyncGeneratorFunction {
        /**
         * Creates a new AsyncGenerator object.
         * @param args A list of arguments the function accepts.
         */
        new(...args: any[]): AsyncGenerator;
        /**
         * Creates a new AsyncGenerator object.
         * @param args A list of arguments the function accepts.
         */
        (...args: any[]): AsyncGenerator;
        /**
         * The length of the arguments.
         */
        readonly length: number;
        /**
         * Returns the name of the function.
         */
        readonly name: string;
        /**
         * A reference to the prototype.
         */
        readonly prototype: AsyncGenerator;
    }
    interface AsyncGeneratorFunctionConstructor {
        /**
         * Creates a new AsyncGenerator function.
         * @param args A list of arguments the function accepts.
         */
        new(...args: string[]): AsyncGeneratorFunction;
        /**
         * Creates a new AsyncGenerator function.
         * @param args A list of arguments the function accepts.
         */
        (...args: string[]): AsyncGeneratorFunction;
        /**
         * The length of the arguments.
         */
        readonly length: number;
        /**
         * Returns the name of the function.
         */
        readonly name: string;
        /**
         * A reference to the prototype.
         */
        readonly prototype: AsyncGeneratorFunction;
    }
    interface AsyncFunctionConstructor extends FunctionConstructor {
        /**
            * Creates a new AsyncGenerator function.
            * @param args A list of arguments the function accepts.
            */
        new(...args: string[]): AsyncFunction;
        /**
            * Creates a new AsyncGenerator function.
            * @param args A list of arguments the function accepts.
            */
        (...args: string[]): AsyncFunction;
        /**
            * The length of the arguments.
            */
        readonly length: number;
        /**
            * Returns the name of the function.
            */
        readonly name: string;
        /**
            * A reference to the prototype.
            */
        readonly prototype: AsyncFunction;
    }
    interface AsyncFunction extends Function {
        (): Promise
        readonly prototype: Promise
    }
    interface Object {
        static clone(arg: any): object;
        static clear<T extends object>(arg: T): T;
        static addPrototypeOf<T extends object>(arg: T, proto: object): T;
        static applyOwnGetters<T extends object>(ownGetters: object, source: T): T;
        formatXYZ(): string;
    }
    interface Symbol {
        static isGenerator: Symbol
    }
    interface Date {
        toHHMMSS(): string
    }
    interface Math {
        rad(deg: number): number
        deg(rad: number): number
        randomBetween(max: number, min?: number): number
    }
    interface NumberConstructor {
        unitTypes: string[]
        createUID(): number
    }
    interface Number {
        unitFormat(place?: number, space?: string,exponent:?number,component?:number): string,
        floor(): number,
        toHHMMSS(): string
    }
    interface Array<T> {
        readonly randomElement: T,
        readonly x:number,
        readonly y:number,
        readonly z:number,
        remove(element: any): this;
        removeAll(element: any): this;
    }
    function runCommand(command: string): Promise<CommandResult>;
}
type EventSignal<arguments = []> = {
    trigger(...params: arguments): Promise<number>
    subscribe<k extends (...args: arguments) => any>(method: k): k
    unsubscribe<k extends (...args: arguments) => any>(method: k): k
}