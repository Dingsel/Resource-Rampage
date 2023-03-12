import * as mc from '@minecraft/server';

declare module "@minecraft/server" {
    interface Entity {
        readonly inventory: mc.EntityInventoryComponent;
        readonly container: mc.Container;
        health: number;
        readonly viewBlock?: mc.Block;
        readonly viewEntities: mc.Entity[];
        readonly scores: { [key: string]: number };
    }
    interface Player {
        readonly mainhand: mc.ContainerSlot;
        coins: number;
    }
    interface World {
        readonly overword: mc.Dimension;
        readonly nether: mc.Dimension;
        readonly theEnd: mc.Dimension;
        time: number;
        find(entity: mc.Entity, query: mc.EntityQueryOptions): mc.Entity | false;
    }
    interface System {
        readonly nextTick: Promise
    }
    interface Dimension {
        setBlock(location: mc.Vector3, type: mc.BlockType | mc.BlockPermutation): number
    }
    interface Block {
        readonly canBeWaterlogged: boolean
        readonly container?: mc.BlockInventoryComponentContainer
    }
    interface ItemStack {
        enchantments: mc.EnchantmentList
    }
}
declare module "@minecraft/server-ui" {
    interface FormResponse {
        readonly output: (number | (string | number)[])
    }
}
declare global {
    var nextTick: Promise;
    var currentTick: number;
    var run: PromiseConstructor['prototype']['then']
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
    interface Number {
        static unitTypes: string[]
        unitFormat(place?: number, space?: string): string
    }
    interface Array<T> {
        readonly randomElement: T
    }
}