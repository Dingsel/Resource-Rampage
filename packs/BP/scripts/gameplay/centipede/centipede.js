import { world, Vector, EntityDamageCause, Entity } from "@minecraft/server"
import { spawnBoss } from "./boss";

const { min, max, acos, floor, random, atan2, PI } = Math, { values } = Object,
    { add, multiply, subtract, one, zero, dot, up } = Vector,
    ovw = world.getDimension("overworld"),
    spawnEntity = ovw.spawnEntity.bind(ovw),
    getEntity = world.getEntity.bind(world);
//literally just the dot product
// function dot(a, b) {
//     return a.x * b.x + a.y * b.y + a.z * b.z;
// }
export let summonCentipede;
system.events.gameInitialize.subscribe(async() => {
    await sleep(50)
    //moves an entity via impulse when nearby, and via teleportaion when far away
    function moveTo(entity, position, position2) {
        entity.clearVelocity()
        let ab = subtract(position, entity.location)
        if (ab.length() > 1.2) {
            entity.teleport(position, ovw, 0, 0)
        } else {
            entity.applyImpulse(multiply(ab, 1.2))
        }
    }

    //runCommand"say " + Object.getOwnPropertyNames(Array.prototype))
    //get centipede parts
    let centipede_parts = ovw.getEntities({ tags: ["centipede"] })
    let { length: partsLength } = centipede_parts

    //group loose centipede parts into centipedes
    /**@type {Entity[][]} */
    let centipedes = []
    let heads = []
    for (let i = 0; i < partsLength; i++) {
        let headid = centipede_parts[i].getTags()[1]
        if (!heads.includes(headid)) {
            heads.push(headid)
            centipedes.push([centipede_parts[i]])
        } else {
            centipedes[heads.indexOf(headid)].push(centipede_parts[i])
        }
    }

    //sort centipedes to go from head to tail
    const { length: groupsLength } = centipedes
    for (let i = 0; i < groupsLength; i++) {
        centipedes[i].sort(function compareFn(a, b) {
            return (parseInt(a.getTags()[2]) > b.getTags()[2]) ?
                1 : -1
        })
    }

    //kills a centipede
    async function kill_centipede(centipedeidx) {
        const centipede = centipedes[centipedeidx]
        for (let i = 0; i < centipede.length; i++) {
            centipede[i].kill()
        }
        centipedes.pop(centipedeidx)
    }

    //spawns a centipede
    summonCentipede = function (length, position) {
        let centipede = []
        const tailIndex = length - 1
        for (let i = 0, location = add(position, { x: 0, y: 0, z: -(i * 3) });
            i < length;
            location = add(position, { x: 0, y: 0, z: -(++i * 3) })
        ) {
            let typeId = "dest:centipede_body"
            switch (i) {
                case 0: typeId = "dest:centipede_head"; break;
                case tailIndex: typeId = "dest:centipede_tail"; break;
            }
            const limb = spawnEntity(typeId, location)
            centipede.push(limb)
            limb.addTag("centipede")
            limb.addTag(centipede[0].id)
            limb.addTag(i + "")
        }
        centipedes.push(centipede)
        return centipede
    }

    //shitty command interface to spawn centipede
    const chatCallback = world.events.beforeChat.subscribe((eventData) => {
        if (eventData.message == "$summon centipede") {
            runCommand("say centipede summoned")
            spawnBoss(eventData.sender.location, 10)
        } else if (eventData.message == "list centipedes") {
            for (let i = 0; i < centipedes.length; i++) {
                for (let j = 0; j < centipedes[i].length; j++) {
                    runCommand("say \'" + centipedes[i][j].typeId + "\'")
                }
            }
        } else if (eventData.message == "$resource +") {
            global.coins = floor((1 + random()) * 100000)
            global.stone = floor((1 + random()) * 100000)
            global.wood = floor((1 + random()) * 100000)
            world.sendMessage("Resources updated")
        }
    });

    //applies damage to all in centipede when one is damaged
    const damageCallback = world.events.entityHurt.subscribe(async (eventData) => {
        const { damageSource: { cause } } = eventData
        if (cause != "none") {
            const { damage, hurtEntity } = eventData
            const { location, id } = hurtEntity
            const { length: lenght_a } = centipedes
            for (let i = 0, centipede = centipedes[i]; i < lenght_a; i++, centipede = centipedes[i]) {
                let entity_idx = centipede.findIndex(entity => entity.id == id)
                if (entity_idx != -1) {
                    const { length: lenght_b } = centipede
                    if (cause == "suffocation") {
                        moveTo(hurtEntity, add(location, up))
                    }
                    for (let j = 0; j < lenght_b; j++) {
                        if (j != entity_idx) {
                            //console.log("hurt, dmg: " + damage)
                            centipede[j].applyDamage(damage, { cause: 'none' })
                        }
                    }
                }
            }
        }
    })

    setInterval(() => { updateCentipedes() }, 1)

    async function updateCentipedes() {
        const {length} = centipedes;
        for (let i = 0; i < length; i++) {
            await updateCentipede(i)
        }
    }
    //the reaching part of fabrik
    //where se is a vector pointing from the head to the tail
    function reach(s, e) {
        let d = subtract(e, s) //s-e (vector from s to e)
        if (`${values(d)}` !== `${values(zero)}`) d = one
        return add(multiply(d.normalized(), 2.75), s)
    }


    async function updateCentipede(idx) {
        let centipede = centipedes[idx]
        const lenght_a = centipede.length
        for (let i = 0; i < lenght_a; i++) {
            await nextTick
            const limb = centipede[i], { location, health } = limb
            if (health <= 0 || !getEntity(limb.getTags()[1])) return kill_centipede(idx)
            if (i != 0) {
                const {location:locb} = centipede[i - 1]
                let newpos = add(location, { x: 0, y: -9.8 / 60, z: 0 })
                newpos = reach(locb, newpos)
                moveTo(limb, newpos)
                setLookingDir(limb, subtract(locb, location))
            }
        }
        centipedes[idx] = centipede
    }

    //rotates an entity to look in a vector direction
    /**@param {import('@minecraft/server').Entity} entity */
    function setLookingDir(entity, direction) {
        const { x, y, z } = direction.normalized()
        let xz = new Vector(x, 0, z).normalized()
        let pitch = acos(min(max(dot({ x, y, z }, xz), -1), 1)) * 180 / PI
        let yaw = 90 + atan2(xz.z, xz.x) * 180 / PI
        entity.setRotation(pitch, yaw)
    }
})