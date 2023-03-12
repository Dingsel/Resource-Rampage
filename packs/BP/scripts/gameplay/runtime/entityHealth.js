import { world } from "@minecraft/server";

world.events.entitySpawn.subscribe(({ entity })            => { entity.updateName() })
world.events.entityHurt.subscribe (({ hurtEntity: entity })=> { entity.updateName() })