# KeychronRGB

KeychronRGB is a TypeScript library that allows you to control the RGB lighting on Keychron K10 Pro keyboards.

## Installation

Before you can use this library, you need to install its dependencies. You can do this by running the following command in your terminal:

```sh
npm install
```

## Usage

To use this library, import the ``Keychron`` class from the ``src/keychron.ts`` file in your TypeScript code:

```ts
import * as Keychron from '../src/keychron';
```

Then, you can create a new ``Keychon.Keychron`` object and use its methods to control the RGB lighting on your keyboard.

## Building

To build the library, use the following command:

```
npm build
```

This will generate JavaScript files in the ``dist`` directory.

## Examples

This library includes several examples that demonstrate how to use it. You can run these examples with the following command:

```sh
npm run example-[example_name]
```
Replace ``[example_name]`` with the name of the example you want to run. The available examples are:
- [colorfill](examples/colorfill.ts)
- [rainbowstripes](examples/rainbowstripes.ts)
- [spheres](examples/spheres.ts)
- [snake](examples/snake.ts)

https://github.com/igricrbx/keychron-rgb/assets/114947694/1132bab7-22fd-4556-82ee-16084c1b98fb

https://github.com/igricrbx/keychron-rgb/assets/114947694/6154ff05-a556-4369-a8ee-7965159a1713

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
