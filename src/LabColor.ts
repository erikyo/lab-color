import {
	ADAPTATION,
	GAMMA,
	type LAB,
	MODEL,
	type OPTIONS,
	type RGB,
	WHITE,
	type XYZ,
} from "./types.js";
import { clamp } from "./utils.js";

const defaultMtx = {
	m00: 1.0,
	m01: 0.0,
	m02: 0.0,
	m10: 0.0,
	m11: 1.0,
	m12: 0.0,
	m20: 0.0,
	m21: 0.0,
	m22: 1.0,
};

class LabColor {
	MtxAdaptMa = {
		...defaultMtx,
	};
	MtxAdaptMaI = {
		...defaultMtx,
	};
	MtxXYZ2RGB = {
		...defaultMtx,
	};
	MtxRGB2XYZ = {
		...defaultMtx,
	};

	kE = 216.0 / 24389.0;
	kK = 24389.0 / 27.0;
	kKE = 8.0;
	AdaptationMethod = 0;
	RefWhiteRGB: XYZ = { X: 0.0, Y: 0.0, Z: 0.0 };

	Gamma = 1.0;
	GammaRGB = 1.0;
	GammaRGBIndex = 0.0;

	RefWhite: XYZ = { X: 0.0, Y: 0.0, Z: 0.0 };
	XYZ: XYZ = { X: 0.0, Y: 0.0, Z: 0.0 };

	/**
	 * The constructor for the labColor class
	 *
	 * @param {Object} options The options for the class
	 * @constructor
	 */
	constructor(options: OPTIONS = {}) {
		const {
			refWhite = WHITE.D50,
			rgbModel = MODEL.sRGB,
			gamma = GAMMA.sRGB,
			adaptationMethod = ADAPTATION.Bradford,
		} = options;

		this.SetRefWhite(refWhite);
		this.SetRGBModel(rgbModel);
		this.SetGamma(gamma);
		this.SetAdaptation(adaptationMethod);
	}

	/**
	 * Set the reference white
	 *
	 * @param whiteId
	 */
	SetRefWhite(whiteId: number) {
		/**
		 * E = (ASTM E308-01)
		 */
		this.RefWhite.X = 1.0;
		this.RefWhite.Y = 1.0;
		this.RefWhite.Z = 1.0;
		switch (whiteId) {
			case 0: // A (ASTM E308-01)
				this.RefWhite.X = 1.0985;
				this.RefWhite.Z = 0.35585;
				break;
			case 1: // B (Wyszecki & Stiles, p. 769)
				this.RefWhite.X = 0.99072;
				this.RefWhite.Z = 0.85223;
				break;
			case 2: // C (ASTM E308-01)
				this.RefWhite.X = 0.98074;
				this.RefWhite.Z = 1.18232;
				break;
			case 3: // D50 (ASTM E308-01)
				this.RefWhite.X = 0.96422;
				this.RefWhite.Z = 0.82521;
				break;
			case 4: // D55 (ASTM E308-01)
				this.RefWhite.X = 0.95682;
				this.RefWhite.Z = 0.92149;
				break;
			case 5: // D65 (ASTM E308-01)
				this.RefWhite.X = 0.95047;
				this.RefWhite.Z = 1.08883;
				break;
			case 6: // D75 (ASTM E308-01)
				this.RefWhite.X = 0.94972;
				this.RefWhite.Z = 1.22638;
				break;
			case 8: // F2 (ASTM E308-01)
				this.RefWhite.X = 0.99186;
				this.RefWhite.Z = 0.67393;
				break;
			case 9: // F7 (ASTM E308-01)
				this.RefWhite.X = 0.95041;
				this.RefWhite.Z = 1.08747;
				break;
			case 10: // F11 (ASTM E308-01)
				this.RefWhite.X = 1.00962;
				this.RefWhite.Z = 0.6435;
				break;
		}
	}

	/**
	 * Get RGB model
	 *
	 * @param {number} modelId
	 */
	SetRGBModel(modelId: number) {
		this.RefWhiteRGB.Y = 1.0;
		let xr: number;
		let yr: number;
		let xg: number;
		let yg: number;
		let xb: number;
		let yb: number;

		switch (modelId) {
			case 0 /* Adobe RGB (1998) */:
				xr = 0.64;
				yr = 0.33;
				xg = 0.21;
				yg = 0.71;
				xb = 0.15;
				yb = 0.06;

				this.RefWhiteRGB.X = 0.95047;
				this.RefWhiteRGB.Z = 1.08883;

				this.GammaRGB = 2.2;
				this.GammaRGBIndex = 2;
				break;
			case 1 /* AppleRGB */:
				xr = 0.625;
				yr = 0.34;
				xg = 0.28;
				yg = 0.595;
				xb = 0.155;
				yb = 0.07;

				this.RefWhiteRGB.X = 0.95047;
				this.RefWhiteRGB.Z = 1.08883;

				this.GammaRGB = 1.8;
				this.GammaRGBIndex = 1;
				break;
			case 2 /* Best RGB */:
				xr = 0.7347;
				yr = 0.2653;
				xg = 0.215;
				yg = 0.775;
				xb = 0.13;
				yb = 0.035;

				this.RefWhiteRGB.X = 0.96422;
				this.RefWhiteRGB.Z = 0.82521;

				this.GammaRGB = 2.2;
				this.GammaRGBIndex = 2;
				break;
			case 3 /* Beta RGB */:
				xr = 0.6888;
				yr = 0.3112;
				xg = 0.1986;
				yg = 0.7551;
				xb = 0.1265;
				yb = 0.0352;

				this.RefWhiteRGB.X = 0.96422;
				this.RefWhiteRGB.Z = 0.82521;

				this.GammaRGB = 2.2;
				this.GammaRGBIndex = 2;
				break;
			case 4 /* Bruce RGB */:
				xr = 0.64;
				yr = 0.33;
				xg = 0.28;
				yg = 0.65;
				xb = 0.15;
				yb = 0.06;

				this.RefWhiteRGB.X = 0.95047;
				this.RefWhiteRGB.Z = 1.08883;

				this.GammaRGB = 2.2;
				this.GammaRGBIndex = 2;
				break;
			case 5 /* CIE RGB */:
				xr = 0.735;
				yr = 0.265;
				xg = 0.274;
				yg = 0.717;
				xb = 0.167;
				yb = 0.009;

				this.RefWhiteRGB.X = 1.0;
				this.RefWhiteRGB.Z = 1.0;

				this.GammaRGB = 2.2;
				this.GammaRGBIndex = 2;
				break;
			case 6 /* ColorMatch RGB */:
				xr = 0.63;
				yr = 0.34;
				xg = 0.295;
				yg = 0.605;
				xb = 0.15;
				yb = 0.075;

				this.RefWhiteRGB.X = 0.96422;
				this.RefWhiteRGB.Z = 0.82521;

				this.GammaRGB = 1.8;
				this.GammaRGBIndex = 1;
				break;
			case 7 /* Don RGB 4 */:
				xr = 0.696;
				yr = 0.3;
				xg = 0.215;
				yg = 0.765;
				xb = 0.13;
				yb = 0.035;

				this.RefWhiteRGB.X = 0.96422;
				this.RefWhiteRGB.Z = 0.82521;

				this.GammaRGB = 2.2;
				this.GammaRGBIndex = 2;
				break;
			case 8 /* ECI RGB v2 */:
				xr = 0.67;
				yr = 0.33;
				xg = 0.21;
				yg = 0.71;
				xb = 0.14;
				yb = 0.08;

				this.RefWhiteRGB.X = 0.96422;
				this.RefWhiteRGB.Z = 0.82521;

				this.GammaRGB = 0.0;
				this.GammaRGBIndex = 4;
				break;
			case 9 /* Ekta Space PS5 */:
				xr = 0.695;
				yr = 0.305;
				xg = 0.26;
				yg = 0.7;
				xb = 0.11;
				yb = 0.005;

				this.RefWhiteRGB.X = 0.96422;
				this.RefWhiteRGB.Z = 0.82521;

				this.GammaRGB = 2.2;
				this.GammaRGBIndex = 2;
				break;
			case 10 /* NTSC RGB */:
				xr = 0.67;
				yr = 0.33;
				xg = 0.21;
				yg = 0.71;
				xb = 0.14;
				yb = 0.08;

				this.RefWhiteRGB.X = 0.98074;
				this.RefWhiteRGB.Z = 1.18232;

				this.GammaRGB = 2.2;
				this.GammaRGBIndex = 2;
				break;
			case 11 /* PAL/SECAM RGB */:
				xr = 0.64;
				yr = 0.33;
				xg = 0.29;
				yg = 0.6;
				xb = 0.15;
				yb = 0.06;

				this.RefWhiteRGB.X = 0.95047;
				this.RefWhiteRGB.Z = 1.08883;

				this.GammaRGB = 2.2;
				this.GammaRGBIndex = 2;
				break;
			case 12 /* ProPhoto RGB */:
				xr = 0.7347;
				yr = 0.2653;
				xg = 0.1596;
				yg = 0.8404;
				xb = 0.0366;
				yb = 0.0001;

				this.RefWhiteRGB.X = 0.96422;
				this.RefWhiteRGB.Z = 0.82521;

				this.GammaRGB = 1.8;
				this.GammaRGBIndex = 1;
				break;
			case 13 /* SMPTE-C RGB */:
				xr = 0.63;
				yr = 0.34;
				xg = 0.31;
				yg = 0.595;
				xb = 0.155;
				yb = 0.07;

				this.RefWhiteRGB.X = 0.95047;
				this.RefWhiteRGB.Z = 1.08883;

				this.GammaRGB = 2.2;
				this.GammaRGBIndex = 2;
				break;
			case 14 /* sRGB */:
				xr = 0.64;
				yr = 0.33;
				xg = 0.3;
				yg = 0.6;
				xb = 0.15;
				yb = 0.06;

				this.RefWhiteRGB.X = 0.95047;
				this.RefWhiteRGB.Z = 1.08883;

				this.GammaRGB = -2.2;
				this.GammaRGBIndex = 3;
				break;
			case 15 /* Wide Gamut RGB */:
				xr = 0.735;
				yr = 0.265;
				xg = 0.115;
				yg = 0.826;
				xb = 0.157;
				yb = 0.018;

				this.RefWhiteRGB.X = 0.96422;
				this.RefWhiteRGB.Z = 0.82521;

				this.GammaRGB = 2.2;
				this.GammaRGBIndex = 2;
				break;
		}

		const m = {
			m00: xr / yr,
			m01: xg / yg,
			m02: xb / yb,
			m10: 1.0,
			m11: 1.0,
			m12: 1.0,
			m20: (1.0 - xr - yr) / yr,
			m21: (1.0 - xg - yg) / yg,
			m22: (1.0 - xb - yb) / yb,
		};
		const mi = {
			m00: 1.0,
			m01: 0.0,
			m02: 0.0,
			m10: 0.0,
			m11: 1.0,
			m12: 0.0,
			m20: 0.0,
			m21: 0.0,
			m22: 1.0,
		};
		this.MtxInvert3x3(m, mi);

		const sr =
			this.RefWhiteRGB.X * mi.m00 +
			this.RefWhiteRGB.Y * mi.m01 +
			this.RefWhiteRGB.Z * mi.m02;
		const sg =
			this.RefWhiteRGB.X * mi.m10 +
			this.RefWhiteRGB.Y * mi.m11 +
			this.RefWhiteRGB.Z * mi.m12;
		const sb =
			this.RefWhiteRGB.X * mi.m20 +
			this.RefWhiteRGB.Y * mi.m21 +
			this.RefWhiteRGB.Z * mi.m22;

		this.MtxRGB2XYZ.m00 = sr * m.m00;
		this.MtxRGB2XYZ.m01 = sg * m.m01;
		this.MtxRGB2XYZ.m02 = sb * m.m02;
		this.MtxRGB2XYZ.m10 = sr * m.m10;
		this.MtxRGB2XYZ.m11 = sg * m.m11;
		this.MtxRGB2XYZ.m12 = sb * m.m12;
		this.MtxRGB2XYZ.m20 = sr * m.m20;
		this.MtxRGB2XYZ.m21 = sg * m.m21;
		this.MtxRGB2XYZ.m22 = sb * m.m22;

		this.MtxTranspose3x3(this.MtxRGB2XYZ);

		this.MtxInvert3x3(this.MtxRGB2XYZ, this.MtxXYZ2RGB);
	}

	/**
	 * Set the gamma correction curve
	 * @param typeID
	 * @constructor
	 */
	SetGamma(typeID: number): void {
		switch (typeID) {
			case 0 /* 1.0 */:
				this.Gamma = 1.0;
				break;
			case 1 /* 1.8 */:
				this.Gamma = 1.8;
				break;
			case 2 /* 2.2 */:
				this.Gamma = 2.2;
				break;
			case 3 /* sRGB */:
				this.Gamma = -2.2;
				break;
			case 4 /* L* */:
				this.Gamma = 0.0;
				break;
		}
	}

	/**
	 * Set the adaptation method to use when converting color spaces
	 *
	 * @param typeID
	 * @constructor
	 */
	SetAdaptation(typeID: number): void {
		this.AdaptationMethod = typeID;
		switch (this.AdaptationMethod) {
			case 0 /* Bradford */:
				this.MtxAdaptMa.m00 = 0.8951;
				this.MtxAdaptMa.m01 = -0.7502;
				this.MtxAdaptMa.m02 = 0.0389;
				this.MtxAdaptMa.m10 = 0.2664;
				this.MtxAdaptMa.m11 = 1.7135;
				this.MtxAdaptMa.m12 = -0.0685;
				this.MtxAdaptMa.m20 = -0.1614;
				this.MtxAdaptMa.m21 = 0.0367;
				this.MtxAdaptMa.m22 = 1.0296;

				this.MtxInvert3x3(this.MtxAdaptMa, this.MtxAdaptMaI);
				break;
			case 1 /* von Kries */:
				this.MtxAdaptMa.m00 = 0.40024;
				this.MtxAdaptMa.m01 = -0.2263;
				this.MtxAdaptMa.m02 = 0.0;
				this.MtxAdaptMa.m10 = 0.7076;
				this.MtxAdaptMa.m11 = 1.16532;
				this.MtxAdaptMa.m12 = 0.0;
				this.MtxAdaptMa.m20 = -0.08081;
				this.MtxAdaptMa.m21 = 0.0457;
				this.MtxAdaptMa.m22 = 0.91822;

				this.MtxInvert3x3(this.MtxAdaptMa, this.MtxAdaptMaI);
				break;
			case 2: /* XYZ Scaling */
			case 3 /* None */:
				this.MtxAdaptMa.m00 = 1.0;
				this.MtxAdaptMa.m01 = 0.0;
				this.MtxAdaptMa.m02 = 0.0;
				this.MtxAdaptMa.m10 = 0.0;
				this.MtxAdaptMa.m11 = 1.0;
				this.MtxAdaptMa.m12 = 0.0;
				this.MtxAdaptMa.m20 = 0.0;
				this.MtxAdaptMa.m21 = 0.0;
				this.MtxAdaptMa.m22 = 1.0;

				this.MtxAdaptMaI.m00 = 1.0;
				this.MtxAdaptMaI.m01 = 0.0;
				this.MtxAdaptMaI.m02 = 0.0;
				this.MtxAdaptMaI.m10 = 0.0;
				this.MtxAdaptMaI.m11 = 1.0;
				this.MtxAdaptMaI.m12 = 0.0;
				this.MtxAdaptMaI.m20 = 0.0;
				this.MtxAdaptMaI.m21 = 0.0;
				this.MtxAdaptMaI.m22 = 1.0;
				break;
		}
	}

	Determinant3x3(m: Record<string, number>) {
		return (
			m.m00 * (m.m22 * m.m11 - m.m21 * m.m12) -
			m.m10 * (m.m22 * m.m01 - m.m21 * m.m02) +
			m.m20 * (m.m12 * m.m01 - m.m11 * m.m02)
		);
	}

	MtxTranspose3x3(m: Record<string, number>) {
		[m.m01, m.m10] = [m.m10, m.m01];
		[m.m02, m.m20] = [m.m20, m.m02];
		[m.m12, m.m21] = [m.m21, m.m12];
	}

	MtxInvert3x3(m: Record<string, number>, i: Record<string, number>) {
		const scale = 1.0 / this.Determinant3x3(m);

		i.m00 = scale * (m.m22 * m.m11 - m.m21 * m.m12);
		i.m01 = -scale * (m.m22 * m.m01 - m.m21 * m.m02);
		i.m02 = scale * (m.m12 * m.m01 - m.m11 * m.m02);

		i.m10 = -scale * (m.m22 * m.m10 - m.m20 * m.m12);
		i.m11 = scale * (m.m22 * m.m00 - m.m20 * m.m02);
		i.m12 = -scale * (m.m12 * m.m00 - m.m10 * m.m02);

		i.m20 = scale * (m.m21 * m.m10 - m.m20 * m.m11);
		i.m21 = -scale * (m.m21 * m.m00 - m.m20 * m.m01);
		i.m22 = scale * (m.m11 * m.m00 - m.m10 * m.m01);
	}

	Compand(linearRaw: number): number {
		const sign = linearRaw < 0.0 ? -1.0 : 1.0;
		const linear = Math.abs(linearRaw);
		let companded: number;

		if (this.Gamma > 0.0) {
			const invGamma = 1.0 / this.Gamma;
			companded = linear ** invGamma;
		} else if (this.Gamma < 0.0) {
			companded =
				linear <= 0.0031308
					? linear * 12.92
					: 1.055 * linear ** (1.0 / 2.4) - 0.055;
		} else {
			// Gamma == 0.0
			companded =
				linear <= 216.0 / 24389.0
					? (linear * 24389.0) / 2700.0
					: 1.16 * linear ** (1.0 / 3.0) - 0.16;
		}

		return companded * sign;
	}

	InvCompand(compandedRaw: number): number {
		let companded = compandedRaw;
		let linear: number;
		if (this.Gamma > 0.0) {
			linear =
				companded >= 0.0
					? companded ** this.Gamma
					: -((-companded) ** this.Gamma);
		} else if (this.Gamma < 0.0) {
			/* sRGB */
			let sign = 1.0;
			if (companded < 0.0) {
				sign = -1.0;
				companded = -companded;
			}
			linear =
				companded <= 0.04045
					? companded / 12.92
					: ((companded + 0.055) / 1.055) ** 2.4;
			linear *= sign;
		} else {
			/* L* */
			let sign = 1.0;
			if (companded < 0.0) {
				sign = -1.0;
				companded = -companded;
			}
			linear =
				companded <= 0.08
					? (2700.0 * companded) / 24389.0
					: (((1000000.0 * companded + 480000.0) * companded + 76800.0) *
							companded +
							4096.0) /
						1560896.0;
			linear *= sign;
		}
		return linear;
	}

	labToXYZ(lab: LAB) {
		const fy: number = (lab.l + 16.0) / 116.0;
		const fx: number = 0.002 * lab.a + fy;
		const fz: number = fy - 0.005 * lab.b;

		const fx3 = fx * fx * fx;
		const fz3 = fz * fz * fz;

		const xr = fx3 > this.kE ? fx3 : (116.0 * fx - 16.0) / this.kK;
		const yr =
			lab.l > this.kKE ? ((lab.l + 16.0) / 116.0) ** 3.0 : lab.l / this.kK;
		const zr = fz3 > this.kE ? fz3 : (116.0 * fz - 16.0) / this.kK;

		this.XYZ = {
			X: xr * this.RefWhite.X,
			Y: yr * this.RefWhite.Y,
			Z: zr * this.RefWhite.Z,
		};
	}

	XYZToRgb(): RGB {
		let X2 = this.XYZ.X;
		let Y2 = this.XYZ.Y;
		let Z2 = this.XYZ.Z;

		if (this.AdaptationMethod !== 3) {
			const As =
				this.RefWhite.X * this.MtxAdaptMa.m00 +
				this.RefWhite.Y * this.MtxAdaptMa.m10 +
				this.RefWhite.Z * this.MtxAdaptMa.m20;
			const Bs =
				this.RefWhite.X * this.MtxAdaptMa.m01 +
				this.RefWhite.Y * this.MtxAdaptMa.m11 +
				this.RefWhite.Z * this.MtxAdaptMa.m21;
			const Cs =
				this.RefWhite.X * this.MtxAdaptMa.m02 +
				this.RefWhite.Y * this.MtxAdaptMa.m12 +
				this.RefWhite.Z * this.MtxAdaptMa.m22;

			const Ad =
				this.RefWhiteRGB.X * this.MtxAdaptMa.m00 +
				this.RefWhiteRGB.Y * this.MtxAdaptMa.m10 +
				this.RefWhiteRGB.Z * this.MtxAdaptMa.m20;
			const Bd =
				this.RefWhiteRGB.X * this.MtxAdaptMa.m01 +
				this.RefWhiteRGB.Y * this.MtxAdaptMa.m11 +
				this.RefWhiteRGB.Z * this.MtxAdaptMa.m21;
			const Cd =
				this.RefWhiteRGB.X * this.MtxAdaptMa.m02 +
				this.RefWhiteRGB.Y * this.MtxAdaptMa.m12 +
				this.RefWhiteRGB.Z * this.MtxAdaptMa.m22;

			let X1 =
				this.XYZ.X * this.MtxAdaptMa.m00 +
				this.XYZ.Y * this.MtxAdaptMa.m10 +
				this.XYZ.Z * this.MtxAdaptMa.m20;
			let Y1 =
				this.XYZ.X * this.MtxAdaptMa.m01 +
				this.XYZ.Y * this.MtxAdaptMa.m11 +
				this.XYZ.Z * this.MtxAdaptMa.m21;
			let Z1 =
				this.XYZ.X * this.MtxAdaptMa.m02 +
				this.XYZ.Y * this.MtxAdaptMa.m12 +
				this.XYZ.Z * this.MtxAdaptMa.m22;

			X1 *= Ad / As;
			Y1 *= Bd / Bs;
			Z1 *= Cd / Cs;

			X2 =
				X1 * this.MtxAdaptMaI.m00 +
				Y1 * this.MtxAdaptMaI.m10 +
				Z1 * this.MtxAdaptMaI.m20;
			Y2 =
				X1 * this.MtxAdaptMaI.m01 +
				Y1 * this.MtxAdaptMaI.m11 +
				Z1 * this.MtxAdaptMaI.m21;
			Z2 =
				X1 * this.MtxAdaptMaI.m02 +
				Y1 * this.MtxAdaptMaI.m12 +
				Z1 * this.MtxAdaptMaI.m22;
		}

		return {
			r: clamp(
				this.Compand(
					X2 * this.MtxXYZ2RGB.m00 +
						Y2 * this.MtxXYZ2RGB.m10 +
						Z2 * this.MtxXYZ2RGB.m20,
				) * 255,
				0,
				255,
				0,
			),
			g: clamp(
				this.Compand(
					X2 * this.MtxXYZ2RGB.m01 +
						Y2 * this.MtxXYZ2RGB.m11 +
						Z2 * this.MtxXYZ2RGB.m21,
				) * 255,
				0,
				255,
				0,
			),
			b: clamp(
				this.Compand(
					X2 * this.MtxXYZ2RGB.m02 +
						Y2 * this.MtxXYZ2RGB.m12 +
						Z2 * this.MtxXYZ2RGB.m22,
				) * 255,
				0,
				255,
				0,
			),
		};
	}

	rgbToXYZ(rgb: RGB) {
		const R = this.InvCompand(rgb.r / 255);
		const G = this.InvCompand(rgb.g / 255);
		const B = this.InvCompand(rgb.b / 255);

		this.XYZ.X =
			R * this.MtxRGB2XYZ.m00 +
			G * this.MtxRGB2XYZ.m10 +
			B * this.MtxRGB2XYZ.m20;
		this.XYZ.Y =
			R * this.MtxRGB2XYZ.m01 +
			G * this.MtxRGB2XYZ.m11 +
			B * this.MtxRGB2XYZ.m21;
		this.XYZ.Z =
			R * this.MtxRGB2XYZ.m02 +
			G * this.MtxRGB2XYZ.m12 +
			B * this.MtxRGB2XYZ.m22;

		if (this.AdaptationMethod !== 3) {
			const Ad =
				this.RefWhite.X * this.MtxAdaptMa.m00 +
				this.RefWhite.Y * this.MtxAdaptMa.m10 +
				this.RefWhite.Z * this.MtxAdaptMa.m20;
			const Bd =
				this.RefWhite.X * this.MtxAdaptMa.m01 +
				this.RefWhite.Y * this.MtxAdaptMa.m11 +
				this.RefWhite.Z * this.MtxAdaptMa.m21;
			const Cd =
				this.RefWhite.X * this.MtxAdaptMa.m02 +
				this.RefWhite.Y * this.MtxAdaptMa.m12 +
				this.RefWhite.Z * this.MtxAdaptMa.m22;

			const As =
				this.RefWhiteRGB.X * this.MtxAdaptMa.m00 +
				this.RefWhiteRGB.Y * this.MtxAdaptMa.m10 +
				this.RefWhiteRGB.Z * this.MtxAdaptMa.m20;
			const Bs =
				this.RefWhiteRGB.X * this.MtxAdaptMa.m01 +
				this.RefWhiteRGB.Y * this.MtxAdaptMa.m11 +
				this.RefWhiteRGB.Z * this.MtxAdaptMa.m21;
			const Cs =
				this.RefWhiteRGB.X * this.MtxAdaptMa.m02 +
				this.RefWhiteRGB.Y * this.MtxAdaptMa.m12 +
				this.RefWhiteRGB.Z * this.MtxAdaptMa.m22;

			let X =
				this.XYZ.X * this.MtxAdaptMa.m00 +
				this.XYZ.Y * this.MtxAdaptMa.m10 +
				this.XYZ.Z * this.MtxAdaptMa.m20;
			let Y =
				this.XYZ.X * this.MtxAdaptMa.m01 +
				this.XYZ.Y * this.MtxAdaptMa.m11 +
				this.XYZ.Z * this.MtxAdaptMa.m21;
			let Z =
				this.XYZ.X * this.MtxAdaptMa.m02 +
				this.XYZ.Y * this.MtxAdaptMa.m12 +
				this.XYZ.Z * this.MtxAdaptMa.m22;

			X *= Ad / As;
			Y *= Bd / Bs;
			Z *= Cd / Cs;

			this.XYZ.X =
				X * this.MtxAdaptMaI.m00 +
				Y * this.MtxAdaptMaI.m10 +
				Z * this.MtxAdaptMaI.m20;
			this.XYZ.Y =
				X * this.MtxAdaptMaI.m01 +
				Y * this.MtxAdaptMaI.m11 +
				Z * this.MtxAdaptMaI.m21;
			this.XYZ.Z =
				X * this.MtxAdaptMaI.m02 +
				Y * this.MtxAdaptMaI.m12 +
				Z * this.MtxAdaptMaI.m22;
		}
	}

	XYZToLab(): { l: number; a: number; b: number } {
		const xr = this.XYZ.X / this.RefWhite.X;
		const yr = this.XYZ.Y / this.RefWhite.Y;
		const zr = this.XYZ.Z / this.RefWhite.Z;

		const fx = xr > this.kE ? xr ** (1.0 / 3.0) : (this.kK * xr + 16.0) / 116.0;
		const fy = yr > this.kE ? yr ** (1.0 / 3.0) : (this.kK * yr + 16.0) / 116.0;
		const fz = zr > this.kE ? zr ** (1.0 / 3.0) : (this.kK * zr + 16.0) / 116.0;

		return {
			l: clamp(116.0 * fy - 16.0, 0, 100, 2),
			a: clamp(500.0 * (fx - fy), 0, 100, 2),
			b: clamp(200.0 * (fy - fz), 0, 100, 2),
		};
	}
}

export default LabColor;
