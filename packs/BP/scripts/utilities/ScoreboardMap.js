import { CommandResult, ScoreboardObjective } from "@minecraft/server";

export class ScoreboardMap extends Map{
    #objective;
    /** @param {ScoreboardObjective} objective */
    constructor(objective){
        if(!objective instanceof ScoreboardObjective) throw new TypeError("Must be objective class!");
        super();
        this.#objective = objective;
        this.update();
    }
    getAll(){
        const o  = {};
        for (const k of this.keys()) o[k] = this.get(k);
        return o;
    }
    /** @param {string} key @returns {number} */
    get(key){if(this.has(key)) return this.#objective.getScore(super.get(key));}
    /**@param {string} key @param {number?} score @returns {number}  */
    set(key, score = 0){
        if(this.has(key)) {
            this.#objective.setScore(super.get(key),score);
            return score;
        }
    }
    /**@param {string} key @returns {boolean}  */
    reset(key){
        if(!this.had(key)) return false;
        const p = this.get(key);
        const sus = this.delete(key);
        this.#objective.removeParticipant(p);
        return sus;
    }
    relative(key, score=0){
        if(this.has(key)) {
            const c = this.get(key) + score;
            this.#objective.setScore(super.get(key),c);
            return c;
        }
    }
    /**@param {string} key @param {number?} score @returns {CommandResult}  */
    async addAsync(key, score = 0){
        const n = await runCommand(`scoreboard players add "${key.replaceAll('"','\\"')}" "$${this.#objective.id}" ${score}`);
        this.update();
        return n;
    }
    /**@param {string} key @param {number?} score @returns {CommandResult}  */
    addAsyncNoUpdate(key, score = 0){
        return runCommand(`scoreboard players add "${key.replaceAll('"','\\"')}" "${this.#objective.id}" ${score}`);
    }
    update(){
        this.clear();
        for(const p of this.#objective.getParticipants())
        {
            super.set(p.displayName,p);
        }
    }
}