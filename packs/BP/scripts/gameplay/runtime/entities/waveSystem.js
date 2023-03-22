import { world } from "@minecraft/server"

export class EnemySpawner {
	/**
	 * @param {Wave[]} waves
	 */
	constructor(waves = []) {
		this.waves = waves
	}
	/**
	 * @param {Wave} wave
	 * @returns {EnemySpawner}
	 */
	addWave(wave) {
		this.waves.push(wave)
		return this
	}
	/**
	 * @returns {Wave}
	 */
	nextWave() {
		return this.waves.shift()
	}
}

export class Wave {
	/**
	 * @param {WaveOptions} options
	 */
	constructor(options) {
		this.options = options
	}
	*generateEnemies() {
		for (const option of Object.entries(this.options.enemies)) {
			for (let i = 0; i < option.amount; i++) {
				yield Array.from({ length: option.enemyAmount }).map(() => world.overworld.spawnEntity(option.id, this.options.location))
			}
		}
	}
}

/**
 * @typedef {{ location: Vector3, enemies: [{ id: string, amount: number, enemyAmount: number }] }} WaveOptions
 */


class Mob {
	constructor(id, minWave, weight) {
		this.id = id
		this.minWave = minWave
		this.weight = weight
	}
}


const mobTypes = [
	new Mob("minecraft:zombie", 0, 100),
	new Mob("minecraft:skeleton", 2, 1)
]



function generateWave(roundNumber) {
	const waveOptions = { location: { x: 37, y: 130, z: 68 }, enemies: [] };

	// Determine which types of mobs can spawn in this wave
	const availableMobs = mobTypes.filter((mob) => mob.minWave <= roundNumber);

	// Calculate the total weight of available mobs
	const totalWeight = availableMobs.reduce((total, mob) => total + mob.weight, 0);

	// Choose a random subset of mobs to spawn in this wave based on their weights
	const mobCount = roundNumber * 5
	for (let i = 0; i < mobCount; i++) {
		let randomWeight = Math.floor(Math.random() * totalWeight);
		let chosenMob;
		for (let j = 0; j < availableMobs.length; j++) {
			randomWeight -= availableMobs[j].weight;
			if (randomWeight < 0) {
				chosenMob = availableMobs[j];
				chosenMob.amount = 1
				chosenMob.enemyAmount = 1
				break;
			}
		}
		waveOptions.enemies.push(chosenMob);
	}

	return waveOptions;
}

function asyncTickTimeout(delay) {
	return new Promise((resolve) => { system.runTimeout(resolve, delay) })
}

let options = generateWave(3)


;(async function spawn(){
	for (const e of options.enemies) {
		world.overworld.spawnEntity(e.id, options.location)
		await asyncTickTimeout(100)
	}
})