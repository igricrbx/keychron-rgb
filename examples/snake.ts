import * as Keychron from '../src/keychron';
import * as readline from 'readline';

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

let snakeDirection: Keychron.Vector2 = { x: 1, y: 0 };
let debounce = false;

const keyboard = new Keychron.Keychron();

process.stdin.on('keypress', (str, key) => {
    if (key.name === 'up' && snakeDirection.y !== 1 && !debounce) {
        snakeDirection = { x: 0, y: -1 }
        debounce = true;
    } else if (key.name === 'down' && snakeDirection.y !== -1 && !debounce) {
        snakeDirection = { x: 0, y: 1 }
        debounce = true;
    } else if (key.name === 'left' && snakeDirection.x !== 1 && !debounce) {
        snakeDirection = { x: -1, y: 0 }
        debounce = true;
    } else if (key.name === 'right' && snakeDirection.x !== -1 && !debounce) {
        snakeDirection = { x: 1, y: 0 }
        debounce = true;
    }

    if (key.ctrl && key.name === 'c') {
        keyboard.setKeyboardMode();
        process.exit();
    }
});

setInterval(() => {debounce = false}, 10);

function getNewHead(head: number) {
    if (snakeDirection.x === 1) {
        if (head == 30 || head == 51 || head == 72 || head == 88) {
            return head - 9;
        } else {
            return head + 1;
        }
    } else if (snakeDirection.x === -1) {
        if (head == 21 || head == 42 || head == 63 || head == 79) {
            return head + 9;
        } else {
            return head - 1;
        }
    } else if (snakeDirection.y === -1) {
        if (head >= 21 && head <= 30) {
            return head + 58;
        } else if (head >= 79 && head <= 88) {
            return head - 16;
        } else {
            return head - 21;
        }
    } else if (snakeDirection.y === 1) {
        if (head >= 79 && head <= 88) {
            return head - 58;
        } else if (head >= 63 && head <= 72) {
            return head + 16;
        } else {
            return head + 21;
        }
    }

    return -1;
}

async function main() {
    let snake = [65];
    let foods = [48, 80];

    await keyboard.setDirectMode();

    const Strip: Keychron.Color[] = [];

    while (true) {
        Strip.fill({ r: 0, g: 0, b: 0 });

        for (const snakePart of snake) {
            Strip[snakePart] = { r: 255, g: 255, b: 255 };
        }

        for (const food of foods) {
            Strip[food] = { r: 170, g: 90, b: 0 };
        }

        const head = snake[0];
        let newHead = getNewHead(head);

        await keyboard.setStrip(Strip);

        if (foods.includes(newHead)) {
            foods.splice(foods.indexOf(newHead), 1);

            let randomLocation = -1;
            do {
                const random = Math.floor(Math.random() * 4);
                if (random == 0) {
                    randomLocation = Math.floor(Math.random() * 9) + 21;
                } else if (random == 1) {
                    randomLocation = Math.floor(Math.random() * 9) + 42;
                } else if (random == 2) {
                    randomLocation = Math.floor(Math.random() * 9) + 63;
                } else if (random == 3) {
                    randomLocation = Math.floor(Math.random() * 9) + 79;
                }
            } while (snake.includes(randomLocation) || foods.includes(randomLocation));
            foods.push(randomLocation);
        } else {
            snake.pop();
        }

        await new Promise(resolve => setTimeout(resolve, 300));

        if (newHead === -1 || newHead < 0 || newHead >= 108 || snake.includes(newHead)) {
            Strip.fill({ r: 255, g: 0, b: 0 });
            await keyboard.setStrip(Strip);

            await new Promise(resolve => setTimeout(resolve, 2000));

            snake = [65];
            foods = [48, 80];
            snakeDirection = { x: 1, y: 0 };
        }

        snake.unshift(newHead);
    }
}

process.on('SIGINT', () => {
    keyboard.setKeyboardMode();

    process.exit();
});

main();