import LabColor from "./LabColor.js";
import type { LAB, OPTIONS, RGB, XYZ } from "./types.js";

/**
 * Converts a rgb color to a lab color
 * @param rgb
 * @param options
 */
export function rgbToLab(rgb: RGB, options?: OPTIONS): LAB {
	const lc = new LabColor(options);
	lc.rgbToXYZ(rgb);
	return lc.XYZToLab();
}

/**
 * Converts a rgb color to a lab color
 * @param rgb
 * @param options
 */
export function rgbToXyz(rgb: RGB, options?: OPTIONS): XYZ {
	const lc = new LabColor(options);
	lc.rgbToXYZ(rgb);
	return lc.XYZ;
}

/**
 * Converts a lab color to a rgb color
 * @param lab
 * @param options
 */
export function labToRgb(lab: LAB, options?: OPTIONS): RGB {
	const lc = new LabColor(options);
	lc.labToXYZ(lab);
	return lc.XYZToRgb();
}

/**
 * Converts a lab color to a rgb color
 * @param lab
 * @param options
 */
export function labToXyz(lab: LAB, options?: OPTIONS): XYZ {
	const lc = new LabColor(options);
	lc.labToXYZ(lab);
	return {
		X: lc.XYZ.X,
		Y: lc.XYZ.Y,
		Z: lc.XYZ.Z,
	};
}
