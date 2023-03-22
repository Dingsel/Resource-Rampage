import { world } from "@minecraft/server"

const spawnPoints = Object.entries({
	"x+": { x: 260, y: 75, z: 95 },
	"x-": { x: -120, y: 75, z: 28 },
	"z+": { x: 120, y: 75, z: 275 },
	"z-": { x: 70, y: 74, z: -100 }
})


const randNum = (min, max) => Math.floor(Math.random() * (max - min)) + min

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
		new Mob("minecraft:zombie", 1, 0),
		new Mob("minecraft:skeleton", 1, 2)
	]
	/** @param {number} waveNumber */
	constructor(waveNumber) {
		this.waveNumber = waveNumber
		this.enemyDirections = this.directions()
	}
	/**@returns {[Mob, import("@minecraft/server").Vector3]} */
	*generateEnemies() {
		const availableMobs = Wave.enemies.filter((mob) => mob.minWave <= this.waveNumber)
		const totalWeight = availableMobs.reduce((total, mob) => total + mob.weight, 0);
		const mobCount = this.waveNumber * 5
		console.warn(mobCount)
		for (let i = 0; i < mobCount; i++) {
			let randomWeight = Math.floor(Math.random() * totalWeight);
			for (let j = 0; j < availableMobs.length; j++) {
				randomWeight -= availableMobs[j].weight;
				if (randomWeight < 0) {

					yield [availableMobs[j].id, this.enemyDirections[randNum(0, this.enemyDirections.length - 1)][1]];
					break;
				}
			}
		}
	}
	/**@private */
	directions() {
		let from = []
		const directions = Math.floor((this.waveNumber + 4) / 5)
		for (let i = 0; i < directions; i++) {
			const randInt = Math.floor(Math.random() * 4)
			const v = spawnPoints[randInt]
			console.warn("Coming from " + v[0])
			from.push(v)
		}
		return from
	}
}

const spawner = new EnemySpawner()
spawner.waveNumber = 6
const wave = spawner.nextWave()

for (const [enemy, location] of wave.generateEnemies()) {
	//console.warn(enemy, location.x)
	runCommand(`summon ${enemy} ${location.x} ${location.y} ${location.z}`)
	runCommand(`execute as @e[type=${enemy},x=${location.x},y=${location.y},z=${location.z},c=1] at @s run spreadplayers ~ ~ 10 11 @s`)
}
