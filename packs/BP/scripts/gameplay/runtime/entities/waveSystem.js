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