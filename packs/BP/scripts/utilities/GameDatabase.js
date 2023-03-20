import { ScoreboardObjective } from '@minecraft/server';
import {Database} from './ObjectiveDatabase.js';

const gameKey = "session_id";
const {scoreboard} = world;

export class DisposableHandle{
    #disposed;
    #onUpdate;
    #onDispose;
    constructor(onUpdate, onDispose){
        this.#disposed = false;
        this.#onUpdate = onUpdate;
        this.#onDispose = onDispose;
    }
    async update(){
        if(this.isDisposed) throw new ReferenceError("This object handle is disposed, you can´t update it.");
        else return await this.#onUpdate(this);
    }
    dispose(){
        const close = this.#onDispose;
        this.#disposed = true;
        this.#onUpdate = undefined;
        this.#onDispose = undefined; 
        close(this); }
    get isDisposed(){return this.#disposed};
}

export class ElementDatabase extends Database{
    #elements;
    constructor(objective){
        if(typeof objective == 'string') objective = scoreboard.getObjective(objective)??scoreboard.addObjective(objective,objective);
        if(!objective instanceof ScoreboardObjective) throw new TypeError("Is not instanceof of ScoreboardObjective");
        super(objective);
        this.#elements = new Map();
    }
    async createElement(value,construct = Element){
        const uid = Number.createUID();
        await this.set(uid,value);
        const element = new construct(this,uid);
        this.#elements.set(uid,element);
        return element;
    }
    getElement(elementId,construct = Element){
        if(!this.has(elementId)) throw new ReferenceError(`Element for id: ${elementId} does not exist.`);
        return this.#elements.get(elementId)??new construct(this,elementId);
    }
    hasElement(elementId){return this.has(elementId);}
    async delete(elementId){
        if(this.#elements.has(key)) {
            this.#elements.get(key).dispose();
            this.#elements.delete(key);
        }
        return super.delete(elementId);
    }
    async deleteElement(elementId){return await this.delete(elementId);}
}

export class Element extends DisposableHandle{
    #data;
    #id;
    #database;
    /**@param {ElementDatabase} elementDatase @param {string} elementId */
    constructor(elementDatase, elementId){
        super(
            async ()=>{await elementDatase.set(elementId,this.#data);},
            ()=>{this.#database = undefined;}
        );
        this.#database = elementDatase;
        this.#id = elementId;
        this.#data = elementDatase.get(elementId);
    }
    get(key){return this.#data[key];}
    has(key){return Object.prototype.hasOwnProperty.call(this.#data,key);}
    async set(key,value){this.#data[key] = value; await this.update();}
    async delete(key){this.#data[key] = undefined; await this.update();}

    getId(){return this.#id;}
    getDatabase(){return this.#database;}
    async setData(value){this.#data = value; return await this.update(); }
    getData(){return this.#data;}
}


export class GameDatabase extends ElementDatabase{
    static async Start(objective){
        if(typeof objective == 'string') objective = scoreboard.getObjective(objective)??scoreboard.addObjective(objective,objective);
        if(!objective instanceof ScoreboardObjective) throw new TypeError("Is not instanceof of ScoreboardObjective");
        return new GameDatabase(objective).init();
    }
    #id;
    /**@private */
    async init(){
        if(!this.has(gameKey)) await this.set(gameKey,Number.createUID());
        const sessionId = this.get(gameKey);
        this.#id = sessionId;
        return this;
    }
    /**@returns {Promise<SessionGameElement>} */
    async getSession(){
        if(this.hasElement(this.#id)) return this.getElement(this.#id,SessionGameElement);
        else {
            await this.set(this.#id, {});
            return await this.getSession();
        }
    }
    getSessionId(){return this.#id;}
}

export class SessionGameElement extends Element{
    constructor(db,id){
        super(db,id);
    }
    /**@returns {string} */
    get levelName(){return this.get("levelName")??"";}
    async setLevelName(name){await this.set("levelName",name);}
    get time(){system.currentTick*50;}
}


