import assert from "node:assert";
import test from "node:test";
import { labToRgb, labToXyz } from "../lib/index.js";
import {ADAPTATION, GAMMA, MODEL, WHITE} from "../lib/types.js";

test("lab to XYZ", () => {
	assert.deepEqual(labToXyz({ l: 100, a: 0, b: 0 }), {
		X: 0.96422,
		Y: 1,
		Z: 0.82521,
	});
	assert.deepEqual(labToXyz({ l: 0, a: 0, b: 0 }), { X: 0, Y: 0, Z: 0 });
	assert.deepEqual(labToXyz({ l: 0.0, a: 100.0, b: 50.0 }), {
		X: 0.03721005987289352,
		Y: 0,
		Z: -0.0264930677764566,
	});
	assert.deepEqual(labToXyz({ l: 0.0, a: 50.0, b: 100.0 }), {
		X: 0.012987615235557012,
		Y: 0,
		Z: -0.0529861355529132,
	});
});

test("lab to rgb", () => {
	assert.deepEqual(labToRgb({ l: 100.0, a: 0, b: 0 }), {
		r: 255,
		g: 255,
		b: 255,
	});
	assert.deepEqual(labToRgb({ l: 0.0, a: 100.0, b: 50.0 }), {
		r: 101,
		g: 0,
		b: 0,
	});
	assert.deepEqual(labToRgb({ l: 0.0, a: 50.0, b: 100.0 }), {
		r: 73,
		g: 0,
		b: 0,
	});
});


test("lab to rgb with options", () => {
	assert.deepEqual(
		labToRgb(
			{ l: 0.0, a: 50.0, b: 100.0 },
			{
				refWhite: WHITE.D75,
				rgbModel: MODEL.AdobeRGB,
				gamma: GAMMA.G1_0,
				adaptationMethod: ADAPTATION.None,
			},
		),
		{
			b: 0,
			g: 0,
			r: 14
		}
	);
});
