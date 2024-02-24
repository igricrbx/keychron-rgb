import * as Keychron from '../src/keychron';

const keyboard = new Keychron.Keychron();

const red : Keychron.Color = {r: 0xff, g: 0x00, b: 0x00};

async function main() {
    await keyboard.setDirectMode();

    await keyboard.setAllLeds(red);

    await new Promise(resolve => setTimeout(resolve, 5000));

    await keyboard.setKeyboardMode();
    
    await keyboard.close();
}

main();