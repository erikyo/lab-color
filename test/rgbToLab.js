import assert from "node:assert";
import test from "node:test";
import { rgbToLab, rgbToXyz } from "../lib/index.js";
import { ADAPTATION, GAMMA, MODEL, WHITE } from "../lib/types.js";

test("rgb to XYZ", () => {
	assert.deepEqual(rgbToXyz({ r: 255, g: 255, b: 255 }), {
		X: 0.9642200000000002,
		Y: 1,
		Z: 0.8252100000000002,
	});
	assert.deepEqual(rgbToXyz({ r: 0, g: 0, b: 0 }), { X: 0, Y: 0, Z: 0 });
	assert.deepEqual(rgbToXyz({ r: 0, g: 0, b: 255 }), {
		X: 0.1430803944176984,
		Y: 0.06061693607782029,
		Z: 0.7141732856442008,
	});
	assert.deepEqual(rgbToXyz({ r: 255, g: 0, b: 0 }), {
		X: 0.43607470368794105,
		Y: 0.2225044693295454,
		Z: 0.0139321786352729,
	});
});

test("rgb to lab", () => {
	assert.deepEqual(rgbToLab({ r: 255, g: 255, b: 255 }), {
		l: 100,
		a: 0,
		b: 0,
	});
	assert.deepEqual(rgbToLab({ r: 0, g: 0, b: 0 }), { l: 0, a: 0, b: 0 });
	assert.deepEqual(rgbToLab({ r: 0, g: 0, b: 255 }), {
		l: 29.57,
		a: 68.3,
		b: 0,
	});
	assert.deepEqual(rgbToLab({ r: 255, g: 0, b: 0 }), {
		l: 54.29,
		a: 80.81,
		b: 69.89,
	});
});

test("rgb to lab with options", () => {
	assert.deepEqual(
		rgbToLab(
			{ r: 120, g: 120, b: 120 },
			{
				refWhite: WHITE.D75,
				rgbModel: MODEL.AdobeRGB,
				gamma: GAMMA.G1_0,
				adaptationMethod: ADAPTATION.None,
			},
		),
		{ l: 74.23, a: 0.1, b: 6.05 },
	);
});
