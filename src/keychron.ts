import { Device, OutEndpoint, findByIds } from "usb";
import { promisify } from "util";

const VENDOR_ID = 0x3434;
const PRODUCT_ID = 0x02A0;
const INTERFACE_ID = 0x01;

const BATCH_SIZE = 9;
const LED_COUNT = 108;

enum Modes {
	WRITE = 0x24,
	DIRECT = 0x25,
	KEYBOARD = 0x26
}

export type Vector2 = {
	x: number;
	y: number;
}

export type Color = {
	r: number;
	g: number;
	b: number;
}

type Led = {
	id: number;
	position: Vector2;
	size: Vector2;
	color: Color;
}

export const Grid: Array<Led> = [{ id: 0, position: { x: 0, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 17, position: { x: 19.5, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 95, position: { x: 0.12, y: 5.25 }, size: { x: 1.25, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 78, position: { x: 0.62, y: 4.25 }, size: { x: 2.25, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 62, position: { x: 0.37, y: 3.25 }, size: { x: 1.75, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 41, position: { x: 0.25, y: 2.25 }, size: { x: 1.5, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 20, position: { x: 0, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 96, position: { x: 1.37, y: 5.25 }, size: { x: 1.25, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 63, position: { x: 1.75, y: 3.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 42, position: { x: 1.5, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 21, position: { x: 1, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 97, position: { x: 2.62, y: 5.25 }, size: { x: 1.25, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 80, position: { x: 3.25, y: 4.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 79, position: { x: 2.25, y: 4.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 64, position: { x: 2.75, y: 3.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 43, position: { x: 2.5, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 23, position: { x: 3, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 22, position: { x: 2, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 2, position: { x: 3, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 1, position: { x: 2, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 81, position: { x: 4.25, y: 4.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 65, position: { x: 3.75, y: 3.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 44, position: { x: 3.5, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 24, position: { x: 4, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 3, position: { x: 4, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 82, position: { x: 5.25, y: 4.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 67, position: { x: 5.75, y: 3.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 66, position: { x: 4.75, y: 3.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 46, position: { x: 5.5, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 45, position: { x: 4.5, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 26, position: { x: 6, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 25, position: { x: 5, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 4, position: { x: 5, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 98, position: { x: 6.37, y: 5.25 }, size: { x: 6.25, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 102, position: { x: 13.87, y: 5.25 }, size: { x: 1.25, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 101, position: { x: 12.62, y: 5.25 }, size: { x: 1.25, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 99, position: { x: 10.12, y: 5.25 }, size: { x: 1.25, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 100, position: { x: 11.37, y: 5.25 }, size: { x: 1.25, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 83, position: { x: 6.25, y: 4.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 84, position: { x: 7.25, y: 4.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 69, position: { x: 7.75, y: 3.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 68, position: { x: 6.75, y: 3.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 48, position: { x: 7.5, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 47, position: { x: 6.5, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 28, position: { x: 8, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 27, position: { x: 7, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 103, position: { x: 15.25, y: 5.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 104, position: { x: 16.25, y: 5.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 105, position: { x: 17.25, y: 5.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 106, position: { x: 19, y: 5.25 }, size: { x: 2, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 94, position: { x: 21.5, y: 4.75 }, size: { x: 1, y: 2 }, color: {r: 0, g: 0, b: 0} }, { id: 107, position: { x: 20.5, y: 5.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 5, position: { x: 6.5, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 6, position: { x: 7.5, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 89, position: { x: 13.12, y: 4.25 }, size: { x: 2.75, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 87, position: { x: 10.25, y: 4.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 88, position: { x: 11.25, y: 4.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 85, position: { x: 8.25, y: 4.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 86, position: { x: 9.25, y: 4.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 71, position: { x: 9.75, y: 3.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 70, position: { x: 8.75, y: 3.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 49, position: { x: 8.5, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 50, position: { x: 9.5, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 29, position: { x: 9, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 30, position: { x: 10, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 90, position: { x: 16.25, y: 4.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 92, position: { x: 19.5, y: 4.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 91, position: { x: 18.5, y: 4.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 93, position: { x: 20.5, y: 4.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 7, position: { x: 8.5, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 8, position: { x: 9.5, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 74, position: { x: 13.37, y: 3.25 }, size: { x: 2.25, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 73, position: { x: 11.75, y: 3.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 72, position: { x: 10.75, y: 3.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 52, position: { x: 11.5, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 53, position: { x: 12.5, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 51, position: { x: 10.5, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 31, position: { x: 11, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 32, position: { x: 12, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 77, position: { x: 20.5, y: 3.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 76, position: { x: 19.5, y: 3.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 75, position: { x: 18.5, y: 3.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 9, position: { x: 11, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 10, position: { x: 12, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 54, position: { x: 13.75, y: 2.25 }, size: { x: 1.5, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 33, position: { x: 13.5, y: 1.25 }, size: { x: 2, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 61, position: { x: 21.5, y: 2.75 }, size: { x: 1, y: 2 }, color: {r: 0, g: 0, b: 0} }, { id: 60, position: { x: 20.5, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 59, position: { x: 19.5, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 16, position: { x: 18.5, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 18, position: { x: 20.5, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 19, position: { x: 21.5, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 15, position: { x: 17.25, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 14, position: { x: 16.25, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 12, position: { x: 14, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 11, position: { x: 13, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 13, position: { x: 15.25, y: 0 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 35, position: { x: 16.25, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 34, position: { x: 15.25, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 36, position: { x: 17.25, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 56, position: { x: 16.25, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 55, position: { x: 15.25, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 57, position: { x: 17.25, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 37, position: { x: 18.5, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 38, position: { x: 19.5, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 39, position: { x: 20.5, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 40, position: { x: 21.5, y: 1.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }, { id: 58, position: { x: 18.5, y: 2.25 }, size: { x: 1, y: 1 }, color: {r: 0, g: 0, b: 0} }]

export class Keychron {
	device: Device | undefined;
	endpoint: OutEndpoint | undefined;
	transferAsync: (payload: Buffer) => Promise<void>;

	constructor() {
		this.device = findByIds(VENDOR_ID, PRODUCT_ID);
		if (!this.device) {
			throw new Error('Device not found');
		}
		this.device.open();

		const deviceInterface = this.device.interface(INTERFACE_ID);
		deviceInterface.claim();

		for (let ep of deviceInterface.endpoints) {
			if (ep.direction === 'out') {
				this.endpoint = ep as OutEndpoint;
				break;
			}
		}

		if (!this.endpoint) {
			throw new Error('No valid endpoint found');
		}

		this.transferAsync = async (payload: Buffer) => {
			if (this.endpoint) {
				await promisify(this.endpoint.transfer.bind(this.endpoint))(payload);
			}
		};
	}

	async close() {
		await new Promise(resolve => setTimeout(resolve, 10));
		this.device?.close();
	}

	async #setMode(mode: Modes) {
		const payload = Buffer.alloc(3 + BATCH_SIZE * 3 + 2);
		payload.writeUInt8(mode, 0);
		payload.writeUInt8(0x00, 1);
		payload.writeUInt8(BATCH_SIZE, 2);
		for (let i = 0; i < BATCH_SIZE; i++) {
			payload.writeUInt8(0x00, 3 + i * 3);
			payload.writeUInt8(0x00, 3 + i * 3 + 1);
			payload.writeUInt8(0x00, 3 + i * 3 + 2);
		}
		payload.writeUInt8(0x00, 3 + BATCH_SIZE * 3);
		payload.writeUInt8(0x00, 3 + BATCH_SIZE * 3 + 1);

		await this.transferAsync(payload);
	}

	async setDirectMode() {
		this.#setMode(Modes.DIRECT);
	}

	async setKeyboardMode() {
		this.#setMode(Modes.KEYBOARD);
	}

	async setAllLeds(color: Color) {
		const { r, g, b } = color;
		for (let batch = 0; batch < LED_COUNT; batch += BATCH_SIZE) {
			const payload = Buffer.alloc(3 + BATCH_SIZE * 3 + 2);
			payload.writeUInt8(Modes.WRITE, 0);
			payload.writeUInt8(batch, 1);
			payload.writeUInt8(BATCH_SIZE, 2);
			for (let i = 0; i < BATCH_SIZE; i++) {
				payload.writeUInt8(r, 3 + i * 3);
				payload.writeUInt8(g, 3 + i * 3 + 1);
				payload.writeUInt8(b, 3 + i * 3 + 2);
			}
			payload.writeUInt8(0x00, 3 + BATCH_SIZE * 3);
			payload.writeUInt8(0x00, 3 + BATCH_SIZE * 3 + 1);

			await this.transferAsync(payload);
		}
	}

	async setStrip(strip: Array<Color>) {
		for (let batch = 0; batch < LED_COUNT; batch += BATCH_SIZE) {
			const payload = Buffer.alloc(3 + BATCH_SIZE * 3 + 2);
			payload.writeUInt8(Modes.WRITE, 0);
			payload.writeUInt8(batch, 1);
			payload.writeUInt8(BATCH_SIZE, 2);
			for (let i = 0; i < BATCH_SIZE; i++) {
				const { r, g, b } = strip[batch + i] || { r: 0, g: 0, b: 0 };
				payload.writeUInt8(r, 3 + i * 3);
				payload.writeUInt8(g, 3 + i * 3 + 1);
				payload.writeUInt8(b, 3 + i * 3 + 2);
			}

			payload.writeUInt8(0x00, 3 + BATCH_SIZE * 3);
			payload.writeUInt8(0x00, 3 + BATCH_SIZE * 3 + 1);

			await this.transferAsync(payload);
		}
	}
}