import { world } from "@minecraft/server";
import { level_1 } from "resources/wall_definitions";

export async function buildWall(from, to, wallDefinition = level_1, dimension = world.overworld) {
    const gen = path(from, to);
    const defGen = fromDefinitionOverloads(level_1);
    for (const { x: x, y: y, z: z, rotated } of gen) {
        dim.setBlock({x,y,z}, defGen.get())

        dim.setBlock({ x, y, z }, MinecraftBlockTypes.stone);
        if (!rotated) {
            dim.setBlock({ x: x + 1, y, z }, MinecraftBlockTypes.blackstone);
            dim.setBlock({ x: x - 1, y, z }, MinecraftBlockTypes.blackstone);
        } else {
            dim.setBlock({ x, y, z: z - 1 }, MinecraftBlockTypes.blackstone);
            dim.setBlock({ x, y, z: z + 1 }, MinecraftBlockTypes.blackstone);
        }
    }
}
export function* fromDefinitionOverloads(wall_definitions = level_1){
    while(true){
        for (const n of level_1.step_overloads) {
            yield n;
        }
    }
}
fromDefinitionOverloads.prototype.get=function(){return this.next().value;}
export function* path({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }) {
    const x = x2 - x1, y = y2 - y1, z = z2 - z1;
    const maxs = { x: Math.abs(x), y: Math.abs(y), z: Math.abs(z) };
    const rotated = maxs.x > maxs.y;
    const key = maxs.x > maxs.z ? (maxs.x > maxs.y ? "x" : "y") : (maxs.z > maxs.y ? "z" : "y"), n = maxs[key];
    const xd = x / n, yd = y / n, zd = z / n;
    let xc = xd, yc = yd, zc = zd;
    for (let i = 0; i < n; i++) {
        yield { x: x1 + xc, y: y1 + yc, z: z1 + zc, rotated };
        xc += xd, yc += yd, zc += zd;
    }
    yield { x: x1, y: y1, z: z1, rotated };
}

/**@typedef {{step_overloads:WallOverload[]}} WallDefinition*/