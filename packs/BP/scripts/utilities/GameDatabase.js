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
        close?.(this);
    }
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
        if(this.#elements.has(elementId)){return this.#elements.get(elementId);}
        else{
            this.#elements.set(elementId, new construct(this,elementId));
            return this.#elements.get(elementId);
        }
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
    async getDefault(property, defaultValue=0){
        if(!this.has(property)) await this.set(property,defaultValue);
        return this.get(property);
    }
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
    get session(){return this.getSession()};
    /**@returns {Promise<SessionGameElement>} */
    async getSession(){
        if(this.hasElement(this.#id)) return this.getElement(this.#id, SessionGameElement);
        else {
            await this.set(this.#id, {});
            return await this.getSession();
        }
    }
    async getTowerIDsAsync(){return (await this.getSession()).getTowerIDs()}
    /**@param {string} @returns {Promise<boolean>} */
    async hasTower(towerId){
        const session = await this.getSession();
        return (session.get("towers")??[]).includes(towerId);
    }
    /**@param {Promise<TowerElement>} */
    async addTowerAsync(){
        const session = await this.getSession();
        const id = Number.createUID();
        await this.set(id,{});
        const tower = this.getElement(id,TowerElement);
        const towers = session.get("towers")??[];
        towers.push(id);
        await session.set("towers",towers);
        return tower;
    }
    /**@param {Promise<TowerElement>} */
    async getTowerAsync(towerId){
        if(!await this.hasTower(towerId)) throw new ReferenceError("No tower found with id: " + towerId);
        else return this.getElement(towerId,TowerElement);
    }
    async removeTowerAsync(towerId){
        if(!await this.hasTower(towerId)) return false;
        else{
            const session = await this.getSession();
            await session.set('towers',session.get("towers").remove(towerId));
            return await this.deleteElement(towerId);
        }
    }
    getSessionId(){return this.#id;}
}
export class TowerElement extends Element{
    getTowerId(){return this.getId();}

    /**@returns {string} */
    getTowerName(){ return this.get("name")??"";}
    /**@param {string} name */
    async setTowerNameAsync(name){ await this.set("name",name); }


    /**@returns {import('@minecraft/server').Vector3?} */
    getTowerLocation(){ return this.get("location")}
    /**@param {import('@minecraft/server').Vector3} position */
    async setTowerLocationAsync(position){ await this.set("location",position); }

    
    /**@returns {number} */
    getTowerPower(){ return this.get("power")??1;}
    /**@param {number} power */
    async setTowerPowerAsync(power){ await this.set("power",power); }


    /**@returns {number} */
    getTowerInstantDamage(){ return this.get("damage")??0;}
    /**@param {number} damage */
    async setTowerInstantDamageAsync(damage){ await this.set("damage",damage); }

    /**@returns {number} */
    getTowerLevel(){ return this.get("level")??1;}
    /**@param {number} level */
    async setTowerLevelAsync(level){ await this.set("level",level); }

    
    /**@returns {number} */
    getTowerKnockback(){ return this.get("knockback")??0;}
    /**@param {number} knockback */
    async setTowerKnockbackAsync(knockback){ await this.set("knockback",knockback); }


    /**@returns {number} */
    getTowerInterval(){ return this.get("interval")??1;}
    /**@param {number} interval */
    async setTowerIntervalAsync(interval){ await this.set("interval",interval); }


    /**@returns {{location:import('@minecraft/server').Vector3?,power:number,damage:number,knockback:number,level:number,interval:number}} */
    getRawInfo(){
        const {location, power = 1, damage = 0, knockback = 0, level = 1, interval = 1} = this.getData();
        return {location, power,damage,knockback,level,interval};
    }
}
export class SessionGameElement extends Element{
    /**@returns {number} */
    getCurrentLevel(){return this.get("level")??0;}
    /** @param {number} number @returns {Promise<void>} */
    async setCurrentLevelAsync(number){await this.set("level",number)}


    /**@returns {number} */
    getMobsKilled(){return this.get("killed")??0;}
    /** @param {number} number @returns {Promise<void>} */
    async setMobsKilledAsync(number){await this.set("killed",number)}

    
    /**@returns {number} */
    getMobsKilled(){return this.get("killed")??0;}
    /** @param {number} number @returns {Promise<void>} */
    async setMobsKilledAsync(number){await this.set("killed",number)}



    /**@returns {Promise<number>} */
    async getTowerIDsAsync(){return [...await this.getDefault("towers",[])];}
    get time(){system.currentTick*50;}
}


