import * as Keychron from '../src/keychron';

// rgb(255, 0, 0)
const red : Keychron.Color = {r: 0xff, g: 0x00, b: 0x00};

// Create a new Keychron instance
const keyboard = new Keychron.Keychron();

async function main() {
    // Change the LED mode to direct mode
    await keyboard.setDirectMode();

    // Set all keys to red
    await keyboard.setAllLeds(red);

    // Wait 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Change the LED mode back to keyboard mode, effectively releasing control of the LEDs
    await keyboard.setKeyboardMode();
    
    // Close the connection to the keyboard
    await keyboard.close();
}

main();