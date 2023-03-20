import { CommandResult, ScoreboardObjective } from "@minecraft/server";

const sets = new Map();
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
        this.id = objective.id;
        objective.getParticipants().forEach(e => super.set(e.displayName.split("_")[0].replaceAll(/\\"/g, '"'), JSON.parse(e.displayName.split("_").filter((v, i) => i > 0).join("_").replaceAll(/\\"/g, '"'))));
    }
    /**
     * Set a value from a key
     * @param {string} key Key to set
     * @param {any} value The value
     */
    async set(key, value) {
        if (key.includes('_'))
            throw new TypeError(`Database keys can't include "_"`);
        if ((JSON.stringify(value).replaceAll(/"/g, '\\"').length + key.replaceAll(/"/g, '\\"').length + 1) > 32000)
            throw new Error(`Database setter to long... somehow`);
        if (this.has(key))
            await runCommand(`scoreboard players reset "${key.replaceAll(/"/g, '\\"')}_${JSON.stringify(super.get(key)).replaceAll(/"/g, '\\"')}" "${this.id}"`);
        await runCommand(`scoreboard players set "${key.replaceAll(/"/g, '\\"')}_${JSON.stringify(value).replaceAll(/"/g, '\\"')}" "${this.id}" 0`);
        super.set(key, value);
    }
    /**
     * Delete a key from the database 
     * @param {string} key Key to delete from the database
     */
    async delete(key) {
        if (!this.has(key)) return false;
        await runCommand(`scoreboard players reset "${key.replaceAll(/"/g, '\\"')}_${JSON.stringify(super.get(key)).replaceAll(/"/g, '\\"')}" "${this.id}"`);
        return super.delete(key);
    }
    clear() {
        scoreboard.removeObjective(this.#objective);
        this.#objective = scoreboard.addObjective(this.id,this.id);
        return super.clear();
    }
    #objective;
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