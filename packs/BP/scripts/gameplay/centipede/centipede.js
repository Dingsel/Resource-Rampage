import { world, Vector, EntityDamageCause } from "@minecraft/server"
import { spawnBoss } from "./boss";

const dimension = world.getDimension("overworld")

//literally just the dot product
function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

//moves an entity via impulse when nearby, and via teleportaion when far away
function moveTo(entity, position, position2) {
    entity.clearVelocity()
    let ab = Vector.subtract(position, entity.location)
    if (ab.length() > 1.2) {
        entity.teleport(position, dimension, 0, 0)
    } else {
        entity.applyImpulse(Vector.multiply(ab, 1.2))
    }
}

//rotates an entity to look in a vector direction
function setLookingDir(entity, direction) {
    direction = direction.normalized()
    let xz = new Vector(direction.x, 0, direction.z).normalized()
    let pitch = Math.acos(Math.min(Math.max(dot(direction, xz), -1), 1)) * 180 / Math.PI
    let yaw = 90 + Math.atan2(xz.z, xz.x) * 180 / Math.PI
    entity.setRotation(pitch, yaw)
}

//dimension.runCommandAsync("say " + Object.getOwnPropertyNames(Array.prototype))
//get centipede parts
let centipede_parts = dimension.getEntities({ tags: ["centipede"] })

//group loose centipede parts into centipedes
let centipedes = []
let heads = []
for (let i = 0; i < centipede_parts.length; i++) {
    let headid = centipede_parts[i].getTags()[1]
    if (!heads.includes(headid)) {
        heads.push(headid)
        centipedes.push([centipede_parts[i]])
    } else {
        centipedes[heads.indexOf(headid)].push(centipede_parts[i])
    }
}

//sort centipedes to go from head to tail
for (let i = 0; i < centipedes.length; i++) {
    centipedes[i].sort(function compareFn(a, b) {
        let ia = parseInt(a.getTags()[2])
        let ib = parseInt(b.getTags()[2])
        if (ia < ib) {
            return -1
        }
        if (ia > ib) {
            return 1
        }
        return 0
    })
}

//kills a centipede
async function kill_centipede(centipedeidx) {
    for (let i = 0; i < centipedes[centipedeidx].length; i++) {
        centipedes[centipedeidx][i].kill()
    }
    centipedes.pop(centipedeidx)
}

//spawns a centipede
export function summonCentipede(length, position) {
    let centipede = []
    for (let i = 0; i < length; i++) {
        if (i == 0) {
            centipede.push(dimension.spawnEntity("dest:centipede_head", Vector.add(position, { x: 0, y: 0, z: i })))
        } else if (i == length - 1) {
            centipede.push(dimension.spawnEntity("dest:centipede_tail", Vector.add(position, { x: 0, y: 0, z: i })))
        } else {
            centipede.push(dimension.spawnEntity("dest:centipede_body", Vector.add(position, { x: 0, y: 0, z: i })))
        }
        //centipede[i].runCommandAsync("tag @s add \"" + i + "\"")
        centipede[i].addTag("centipede")
        centipede[i].addTag(centipede[0].id + "")
        centipede[i].addTag(i + "")
    }
    centipedes.push(centipede)
    return centipede
}

//shitty command interface to spawn centipede
const chatCallback = world.events.beforeChat.subscribe((eventData) => {
    if (eventData.message == "$summon centipede") {
        dimension.runCommandAsync("say centipede summoned")
        spawnBoss(eventData.sender.location, 10)
    } else if (eventData.message == "list centipedes") {
        for (let i = 0; i < centipedes.length; i++) {
            for (let j = 0; j < centipedes[i].length; j++) {
                dimension.runCommandAsync("say \'" + centipedes[i][j].typeId + "\'")
            }
        }
    }
});

//applies damage to all in centipede when one is damaged
const damageCallback = world.events.entityHurt.subscribe((eventData) => {
    if (eventData.damageSource.cause != "none") {
        for (let i = 0; i < centipedes.length; i++) {
            let entity_idx = centipedes[i].findIndex(entity => entity.id == eventData.hurtEntity.id)
            if (entity_idx != -1) {
                if (eventData.damageSource.cause == "suffocation") {
                    moveTo(eventData.hurtEntity, Vector.add(eventData.hurtEntity.location, { x: 0, y: 1, z: 0 }))
                }
                for (let j = 0; j < centipedes[i].length; j++) {
                    if (j != entity_idx) {
                        //console.log("hurt, dmg: " + eventData.damage)
                        centipedes[i][j].applyDamage(eventData.damage, { cause: "none" })
                    }
                }
            }
        }
    }
})

//run fabrik each tick
setInterval(() => { updateCentipedes() }, 1)

function updateCentipedes() {
    for (let i = 0; i < centipedes.length; i++) {
        updateCentipede(i)
    }
}

//the reaching part of fabrik
//where se is a vector pointing from the head to the tail
function reach(s, e) {
    let d = Vector.subtract(e, s) //s-e (vector from s to e)
    if (d == Vector.zero) {
        d = Vector.one
    }
    return Vector.add(Vector.multiply(d.normalized(), 2.75), s)
}

function updateCentipede(idx) {
    let centipede = centipedes[idx]
    for (let i = 0; i < centipede.length; i++) {
        if (centipede[i].getComponent("minecraft:health").current <= 0) {
            kill_centipede(idx)
            return
        } else {
            if (i != 0) {
                let newpos = Vector.add(centipede[i].location, { x: 0, y: -9.8 / 60, z: 0 })
                newpos = reach(centipede[i - 1].location, newpos)
                moveTo(centipede[i], newpos)
                setLookingDir(centipede[i], Vector.subtract(centipede[i - 1].location, centipede[i].location))
            }
        }
    }
    centipedes[idx] = centipede
}