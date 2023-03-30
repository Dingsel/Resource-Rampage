
const { random, floor } = Math, { entries, assign } = Object

const spawnPoints = entries({
	"x+": { x: 260, y: 75, z: 95 },
	"x-": { x: -120, y: 75, z: 28 },
	"z+": { x: 120, y: 75, z: 275 },
	"z-": { x: 70, y: 74, z: -100 }
});


const randNum = (min, max) => floor(random() * (max - min)) + min

class Mob {
	constructor(id, weight, minWave) {
		this.id = id
		this.weight = weight
		this.minWave = minWave
	}
}

export class EnemySpawner {
	constructor() {
		this.waveNumber = 1
	}
	/**
	 * @returns {Wave}
	 */
	nextWave() {
		return new Wave(this.waveNumber++)
	}
}

class Wave {
	/**@type {Mob[]} */
	static enemies = [
		new Mob("dest:ant", 20, 0),
		new Mob("dest:pow_bug", 5, 3),
		new Mob("dest:spit_bug", 3, 5),
		new Mob("dest:ladybug", 1, 10),
		new Mob("dest:crawler", 5, 13),
		new Mob("dest:mosquito", 2, 15),
		//new Mob("minecraft:skeleton", 1, 2)
	]
	/** @param {number} waveNumber */
	constructor(waveNumber) {
		this.waveNumber = waveNumber
		this.enemyDirections = this.directions()
	}
	/**@returns {[Mob, import("@minecraft/server").Vector3]} */
	*generateEnemies() {
		const { enemyDirections, waveNumber } = this
		const availableMobs = Wave.enemies.filter(({ minWave }) => minWave <= waveNumber)
		const totalWeight = availableMobs.reduce((total, { weight }) => total + weight, 0);
		const mobCount = Math.pow(waveNumber * 10, 1.15);
		const { length } = availableMobs;
		const directions = enemyDirections.length
		//console.warn(mobCount)
		for (let i = 0; i < mobCount; i++) {
			let randomWeight = floor(random() * totalWeight);
			for (let j = 0, mob = availableMobs[j]; j < length; mob = availableMobs[++j]) {
				randomWeight -= mob.weight;
				if (randomWeight < 0) {
					yield [mob.id, enemyDirections[randNum(0, directions)][1]];
					break;
				}
			}
		}
	}
	/**@private */
	directions() {
		let from = []
		const directions = floor((this.waveNumber + 4) / 5)
		for (let i = 0; i < directions; i++) {
			const randInt = floor(random() * 4)
			const v = spawnPoints[randInt]
			//console.warn("Coming from " + v[0])
			from.push(v)
		}
		return from
	}
}