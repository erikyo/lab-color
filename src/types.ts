export interface OPTIONS {
	refWhite?: number;
	rgbModel?: number;
	gamma?: number;
	adaptationMethod?: number;
}

export type LAB = { l: number; a: number; b: number };
export type RGB = { r: number; g: number; b: number };
export type XYZ = { X: number; Y: number; Z: number };

export enum WHITE {
	A = 0,
	B = 1,
	C = 2,
	D50 = 3,
	D55 = 4,
	D65 = 5,
	D75 = 6,
	E = 7,
	F2 = 8,
	F7 = 9,
	F11 = 10,
}

export enum MODEL {
	AdobeRGB = 0,
	AppleRGB = 1,
	BestRGB = 2,
	BetaRGB = 3,
	BruceRGB = 4,
	CI = 5,
	ColorMatch = 6,
	DonRGB = 7,
	ECI_RGB_v2 = 8,
	EktaSpacePS5 = 9,
	NTSC = 10,
	PAL_SECAM = 11,
	ProPhoto = 12,
	SMPTE_C = 13,
	sRGB = 14,
	WideGamut = 15,
}

export enum GAMMA {
	G1_0 = 0,
	G1_8 = 1,
	G2_2 = 2,
	sRGB = 3,
	L = 4,
}

export enum ADAPTATION {
	Bradford = 0,
	von_Kries = 1,
	XYZ_Scaling = 2,
	None = 3,
}
