import * as Keychron from '../src/keychron';

const keyboard = new Keychron.Keychron();


async function main() {
    await keyboard.setDirectMode();

    const Strip: Keychron.Color[] = [];
    
    for (const key of Keychron.Grid) {
        const {x, y} = key.position;

        switch (Math.floor(y) % 6) {
            case 0:
                Strip[key.id] = {r: 0xff, g: 0x00, b: 0x00};
                break;
            case 1:
                Strip[key.id] = {r: 0xff, g: 90, b: 0x00};
                break;
            case 2:
                Strip[key.id] = {r: 0xff, g: 180, b: 0x00};
                break;
            case 3:
                Strip[key.id] = {r: 0x00, g: 128, b: 0x00};
                break;
            case 4:
                Strip[key.id] = {r: 0x00, g: 0x00, b: 0xff};
                break;
            case 5:
                Strip[key.id] = {r: 75, g: 0x00, b: 130};
                break;
        }
    }

    await keyboard.setStrip(Strip);

    await new Promise(resolve => setTimeout(resolve, 5000));

    await keyboard.setKeyboardMode();
    
    await keyboard.close();
}

main();