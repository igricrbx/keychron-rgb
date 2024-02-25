import * as Keychron from '../src/keychron';

const keyboard = new Keychron.Keychron();

type Sphere = {
    center: Keychron.Vector2;
    radius: number;
    velocity: Keychron.Vector2;
    color: Keychron.Color;
}

const WIDTH = 22;
const HEIGHT = 6;

const spheres: Sphere[] = [
    {
        center: {x: 3, y: 3},
        radius: 1,
        velocity: {x: 0.13, y: 0.14},
        color: {r: 255, g: 100, b: 0},
    },
    {
        center: {x: 18, y: 3},
        radius: 1,
        velocity: {x: -0.16, y: 0.13},
        color: {r: 0, g: 255, b: 0},
    },
    {
        center: {x: 7, y: 3},
        radius: 1,
        velocity: {x: 0.13, y: -0.14},
        color: {r: 0, g: 0, b: 255},
    },
    {
        center: {x: 14, y: 3},
        radius: 1,
        velocity: {x: -0.16, y: -0.13},
        color: {r: 255, g: 0, b: 0},
    }
];

// Makes sure we release the keyboard when the process is interrupted
process.on('SIGINT', () => {
    keyboard.setKeyboardMode();

    process.exit();
});

async function main() {
    await keyboard.setDirectMode();

    const Strip: Keychron.Color[] = [];

    while (true) {
        Strip.fill({r: 0, g: 0, b: 0});

        for (const key of Keychron.Grid) {
            const {x, y} = key.position;
            for (const sphere of spheres) {
                const dx = x - sphere.center.x;
                const dy = y - sphere.center.y;
                const distance2 = dx * dx + dy * dy;
                if (distance2 < sphere.radius*sphere.radius) {
                    let intensity = 1 - Math.sqrt(distance2) / sphere.radius;
                    Strip[key.id] = {r: sphere.color.r * intensity, g: sphere.color.g * intensity, b: sphere.color.b * intensity};
                }
            }
        }

        await keyboard.setStrip(Strip);

        for (const sphere of spheres) {
            if (sphere.center.x + sphere.velocity.x >= WIDTH-0.5 - sphere.radius || sphere.center.x + sphere.velocity.x <= -0.5 + sphere.radius) {
                sphere.velocity.x = -sphere.velocity.x;
            } else {
                sphere.center.x += sphere.velocity.x;
            }

            if (sphere.center.y + sphere.velocity.y >= HEIGHT-0.5 - sphere.radius || sphere.center.y + sphere.velocity.y <= -0.5 + sphere.radius) {
                sphere.velocity.y = -sphere.velocity.y;
            } else {
                sphere.center.y += sphere.velocity.y;
            }

            for (const sphere2 of spheres) {
                if (sphere !== sphere2) {
                    const dx = sphere.center.x - sphere2.center.x;
                    const dy = sphere.center.y - sphere2.center.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < sphere.radius + sphere2.radius) {
                        const nx = dx / distance;
                        const ny = dy / distance;
                        const p = 2 * (sphere.velocity.x * nx + sphere.velocity.y * ny - sphere2.velocity.x * nx - sphere2.velocity.y * ny) / (sphere.radius + sphere2.radius);
                        sphere.velocity.x -= p * sphere2.radius * nx;
                        sphere.velocity.y -= p * sphere2.radius * ny;
                        sphere2.velocity.x += p * sphere.radius * nx;
                        sphere2.velocity.y += p * sphere.radius * ny;
                    }
                }
            }
        }

        await new Promise(resolve => setTimeout(resolve, 10));
    }
}

main();