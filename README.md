# Lab-color

This npm module provides a robust method for converting colors from Lab (CIELAB) space to RGB space with maximum accuracy.

Commonly the lab color space is converted from other modules in a fast but inaccurate manner.
This module provides a robust method for converting colors from Lab (CIELAB) space to RGB space with maximum accuracy.
With this module you can decide the white point of the color space you want to convert to, or the RGB color space you want to convert from.

Lab color space is a color-opponent space with dimensions for lightness and the color-opponent dimensions a and b. RGB, on the other hand, is an additive color model where red, green, and blue light are added together in various ways to reproduce a broad array of colors.

All the formulas are taken from the studies of [Bruce Justin Lindbloom](http://www.brucelindbloom.com/).
You can find more information about the CIE color space here: [CIE Color Space](http://www.brucelindbloom.com/index.html?ColorDifferenceCalc.html)

## Installation

You can install this module via npm:

```bash
npm install lab-color --save-dev
```

## Usage

```javascript
import { rgbToLab } from 'lab-color';

// Convert a Lab color to RGB
const labColor = { l: 50, a: 20, b: -10 };
const options = {
	refWhite: WHITE.D50,
	rgbModel: MODEL.sRGB,
	gamma: GAMMA.sRGB,
	adaptationMethod: ADAPTATION.Bradford
};
const rgbColor = labToRgb(labColor, options);
console.log(rgbColor); // { r: 120, g: 180, b: 200 }
```

## API

### `rgbToLab`

Converts an RGB color to a Lab color representation.

**Arguments:**
- `rgb` (`RGB`): An object representing the RGB color with properties `R`, `G`, and `B`, each ranging from 0 to 255.
- `options` (`OPTIONS`, optional): An optional object containing additional conversion options.

**Returns:**
- `LAB`: An object representing the Lab color with properties `L`, `a`, and `b`.

### `rgbToXyz`

Converts an RGB color to an XYZ color representation.

**Arguments:**
- `rgb` (`RGB`): An object representing the RGB color with properties `R`, `G`, and `B`, each ranging from 0 to 255.
- `options` (`OPTIONS`, optional): An optional object containing additional conversion options.

**Returns:**
- `XYZ`: An object representing the XYZ color with properties `X`, `Y`, and `Z`.

### `labToRgb`

Converts a Lab color to an RGB color representation.

**Arguments:**
- `lab` (`LAB`): An object representing the Lab color with properties `L`, `a`, and `b`.
- `options` (`OPTIONS`, optional): An optional object containing additional conversion options.

**Returns:**
- `RGB`: An object representing the RGB color with properties `R`, `G`, and `B`, each ranging from 0 to 255.

### `labToXyz`

Converts a Lab color to an XYZ color representation.

**Arguments:**
- `lab` (`LAB`): An object representing the Lab color with properties `L`, `a`, and `b`.
- `options` (`OPTIONS`, optional): An optional object containing additional conversion options.

**Returns:**
- `XYZ`: An object representing the XYZ color with properties `X`, `Y`, and `Z`.


### Options
- `refWhite`: The reference white used to convert the color, and is used in the white interpretation of the CIE color system.
When converting to color temperature, there are many different colors that map onto the same color temperature.
Robertson's method has been implemented to perform this conversion, and if the color temperature field is blank after doing a calculation, that means the color was out of the range that Robertson's method supports. When converting from color temperature, the standard CIE method used is only valid for color temperatures in the range [4000K, 25000K]

`A, B, C, D50, D55, D65, D75, E, F2, F7, F11`

- `MODEL`: The color model used to change the colorimetric interpretation of the RGB color values.
Included in this list are all the RGB working spaces that ship with Adobe Photoshop, as well as several others that have emerged as a result of research efforts from various individuals (details [here](http://www.brucelindbloom.com/WorkingSpaceAuthors.html)).

`AdobeRGB, AppleRGB, BestRGB, BetaRGB, BruceRGB, CI, ColorMatch, DonRGB, ECI_RGB_v2, EktaSpacePS5, NTSC , PAL_SECAM , ProPhoto , SMPTE_C , sRGB , WideGamut`

- `ADAPTATION`: The color adaptation method used to convert the color.
The differences among the three methods lie in the definition of the cone response domains

`Bradford, von_Kries, XYZ_Scaling, None`

- `GAMMA`: The gamma correction used to convert the color allowing the native RGB companding function to be overridden.
This is useful for computing linear RGB values. G1_0,  G1_8,  G2_2 stands for gamma 1.0, 1.8, 2.2 respectively while sRGB and L stands for sRGB and linear respectively

`G1_0,  G1_8,  G2_2,  sRGB,  L`

## Examples

LAB to RGB conversion:
```javascript

import { labToRgb } from 'lab-color';

const labColor = { l: 50, a: 20, b: -10 };
const rgbColor = labToRgb(labColor, {
	refWhite: WHITE.D50,
	rgbModel: MODEL.sRGB,
	gamma: GAMMA.sRGB,
	adaptationMethod: ADAPTATION.Bradford
});
console.log(rgbColor); // { r: 120, g: 180, b: 200 }

```

RGB to LAB conversion:
```javascript

import { rgbToLab } from 'lab-color';

const rgbColor = { r: 120, g: 180, b: 200 };
const labColor = rgbToLab(rgbColor, {
	refWhite: WHITE.D50,
	rgbModel: MODEL.sRGB,
	gamma: GAMMA.sRGB,
	adaptationMethod: ADAPTATION.Bradford
});
console.log(labColor); // { l: 50, a: 20, b: -10 }
```

## References and inspirations

- [Bruce Lindbloom color conversion algorithm collection](http://www.brucelindbloom.com/index.html?ColorDifferenceCalc.html)
- [CIELAB color space](https://en.wikipedia.org/wiki/Lab_color_space)
- [RGB color model](https://en.wikipedia.org/wiki/RGB_color_model)
