import assert from "node:assert";
import test from "node:test";
import { clamp } from "../lib/utils.js";

test("clamp positive", () => {
	assert.equal(clamp(1 * 255, -255, 255), 255);
	assert.equal(clamp(300, 0, 255), 255);
});

test("clamp negative", () => {
	assert.equal(clamp(-300, -255, 255), -255);
	assert.equal(clamp(-1, -255, 255), -1);
});

test("clamp decimals", () => {
	assert.equal(clamp(-0.2, 0, 255), 0);
	assert.equal(clamp(-0.4, -255, 255), -0.4);
	assert.equal(clamp(-56.66661, -255, 255, 5), -56.66661);
	assert.equal(clamp(0.222222, -1, 1, 5), 0.22222);
});
