export function* buildWall(from, to, levelDefinitionGenerator) {

}
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