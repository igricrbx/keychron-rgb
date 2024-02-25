# KeychronRGB

A simple TypeScript library which allows you to control the RGB lighting on the [Keychron K10 Pro](https://www.keychron.com/products/keychron-k10-pro-qmk-via-wireless-mechanical-keyboard) keyboard.

## Requirements

Before you can use this library, you need to install its dependencies. This can be done by running the following command:

```sh
npm install
```

Additionally, a custom firmware has to be flashed onto the keyboard's microcontroller which allows LEDs to be adressed individually. The up-to-date list of compatible firmwares can be found on [SRGBmods' repository](https://github.com/SRGBmods/QMK-Binaries/tree/main/QMK%2BVIA-Firmware/0.14.29-keychron) and the [flashing instructions](https://www.keychron.com/blogs/archived/k10-pro-factory-reset-and-firmware-flash) are provided by Keychron.

## Usage

To use this library, import the ``Keychron`` class from the ``src/keychron.ts`` file in your TypeScript code:

```ts
import * as Keychron from '../src/keychron';
```

Then, you can create a new ``Keychron.Keychron`` object and use its methods to control the RGB lighting on your keyboard.

## Examples

This library includes several examples that demonstrate how to use the library. You can run these examples with the following command:

```sh
npm run example-[example_name]
```

Replace ``[example_name]`` with the name of the example you want to run. The available examples are:
- [colorfill](examples/colorfill.ts)
- [rainbowstripes](examples/rainbowstripes.ts)
- [spheres](examples/spheres.ts)
- [snake](examples/snake.ts)

Colorfill
https://github.com/igricrbx/keychron-rgb/assets/114947694/1132bab7-22fd-4556-82ee-16084c1b98fb

Snake (Can your gaming keyboard do THAT?)
https://github.com/igricrbx/keychron-rgb/assets/114947694/6154ff05-a556-4369-a8ee-7965159a1713

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
