import { CommandResult, ScoreboardObjective } from "@minecraft/server";

const sets = new Map();
const splitKey = '.$_';
const matchRegex = /\.\$\_/g;
const {scoreboard} = world;
/**
 * Database
 */
export class Database extends Map{
    /**@param {string} objective @returns {Database} */
    static createDatabase(name){
        return this.getDatabase(scoreboard.getObjective(name)??scoreboard.addObjective(name,name));
    }
    /**@param {ScoreboardObjective} objective @returns {Database} */
    static getDatabase(objective){
        if(!objective instanceof ScoreboardObjective) throw new TypeError("First Argument must be type of ScoreboardObjective");
        if(sets.has(objective.id)) return sets.get(objective.id);
        const n = new Database(objective);
        sets.set(objective.id,n);
        return n;
    }
    /**@param {Database} databse */
    static deleteDatabase(databse){
        if(sets.has(databse.id)) sets.delete(databse.id);
        world.scoreboard.removeObjective(databse.objective);
        return true;
    }
    /**
     * Create a new database!
     * @protected
     * @param {ScoreboardObjective} objective
     */
    constructor(objective) {
        super();
        this.#objective = objective;
        this.#id = objective.id;
        objective.getParticipants().forEach(e => super.set(e.displayName.split(splitKey)[0].replaceAll(/\\"/g, '"'), JSON.parse(e.displayName.split(splitKey).filter((v, i) => i > 0).join(splitKey).replaceAll(/\\"/g, '"'))));
    }
    /**
     * Set a value from a key
     * @param {string} key Key to set
     * @param {any} value The value
     */
    async set(key, value) {
        if (key.match(matchRegex))
            throw new TypeError(`Database keys can't include "${splitKey}"`);
        if ((JSON.stringify(value).replaceAll(/"/g, '\\"').length + key.replaceAll(/"/g, '\\"').length + 1) > 32000)
            throw new Error(`Database setter to long... somehow`);
        if (this.has(key))
            await runCommand(`scoreboard players reset "${key.replaceAll(/"/g, '\\"')}${splitKey}${JSON.stringify(super.get(key)).replaceAll(/"/g, '\\"')}" "${this.#id}"`);
        await runCommand(`scoreboard players set "${key.replaceAll(/"/g, '\\"')}${splitKey}${JSON.stringify(value).replaceAll(/"/g, '\\"')}" "${this.#id}" 0`);
        super.set(key, value);
    }
    /**
     * Delete a key from the database 
     * @param {string} key Key to delete from the database
     */
    async delete(key) {
        if (key.match(matchRegex))
            throw new TypeError(`Database keys can't include "${splitKey}"`);
        if (!this.has(key)) return false;
        await runCommand(`scoreboard players reset "${key.replaceAll(/"/g, '\\"')}${splitKey}${JSON.stringify(super.get(key)).replaceAll(/"/g, '\\"')}" "${this.#id}"`);
        return super.delete(key);
    }
    clear() {
        scoreboard.removeObjective(this.#objective);
        this.#objective = scoreboard.addObjective(this.#id,this.#id);
        return super.clear();
    }
    #id;
    #objective;
    /**@returns {string} */
    getId(){return this.#id;}
    /**@returns {ScoreboardObjective} */
    getScoreboardObjective(){return this.#objective;}
}
/**
 * Run a command!
 * @param {string} cmd Command to run
 * @returns {Promise<CommandResult>} Whether or not the command errors, and command data
 * @example runCommand(`give @a diamond`)
 */
function runCommand(cmd) {
    return overworld.runCommandAsync(cmd);
}