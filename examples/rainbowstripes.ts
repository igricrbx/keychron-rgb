import * as Keychron from '../src/keychron';

const keyboard = new Keychron.Keychron();

async function main() {
    await keyboard.setDirectMode();

    const Strip: Keychron.Color[] = [];
    
    for (const key of Keychron.Grid) {
        const {x, y} = key.position;

        switch (Math.floor(y) % 6) {
            case 0:
                // Red
                Strip[key.id] = {r: 255, g: 0, b: 0};
                break;
            case 1:
                // Orange
                Strip[key.id] = {r: 255, g: 90, b: 0};
                break;
            case 2:
                // Yellow
                Strip[key.id] = {r: 255, g: 180, b: 0};
                break;
            case 3:
                // Green
                Strip[key.id] = {r: 0, g: 128, b: 0};
                break;
            case 4:
                // Blue
                Strip[key.id] = {r: 0, g: 0, b: 255};
                break;
            case 5:
                // Purple
                Strip[key.id] = {r: 75, g: 0, b: 130};
                break;
        }
    }

    await keyboard.setStrip(Strip);

    await new Promise(resolve => setTimeout(resolve, 5000));

    await keyboard.setKeyboardMode();
    
    await keyboard.close();
}

main();