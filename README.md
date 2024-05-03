# Lab to RGB Converter

This npm module provides a robust method for converting colors from Lab (CIELAB) space to RGB space with maximum accuracy.

Lab color space is a color-opponent space with dimensions for lightness and the color-opponent dimensions a and b. RGB, on the other hand, is an additive color model where red, green, and blue light are added together in various ways to reproduce a broad array of colors.

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
const rgbColor = labToRgb(labColor);
console.log(rgbColor); // { r: 120, g: 180, b: 200 }
```

## API

### `rgbToLab`

Converts an RGB color to a Lab color representation.

#### Arguments:

- `rgb` (`RGB`): An object representing the RGB color with properties `R`, `G`, and `B`, each ranging from 0 to 255.
- `options` (`OPTIONS`, optional): An optional object containing additional conversion options.

#### Returns:

- `LAB`: An object representing the Lab color with properties `L`, `a`, and `b`.

### `rgbToXyz`

Converts an RGB color to an XYZ color representation.

#### Arguments:

- `rgb` (`RGB`): An object representing the RGB color with properties `R`, `G`, and `B`, each ranging from 0 to 255.
- `options` (`OPTIONS`, optional): An optional object containing additional conversion options.

#### Returns:

- `XYZ`: An object representing the XYZ color with properties `X`, `Y`, and `Z`.

### `labToRgb`

Converts a Lab color to an RGB color representation.

#### Arguments:

- `lab` (`LAB`): An object representing the Lab color with properties `L`, `a`, and `b`.
- `options` (`OPTIONS`, optional): An optional object containing additional conversion options.

#### Returns:

- `RGB`: An object representing the RGB color with properties `R`, `G`, and `B`, each ranging from 0 to 255.

### `labToXyz`

Converts a Lab color to an XYZ color representation.

#### Arguments:

- `lab` (`LAB`): An object representing the Lab color with properties `L`, `a`, and `b`.
- `options` (`OPTIONS`, optional): An optional object containing additional conversion options.

#### Returns:

- `XYZ`: An object representing the XYZ color with properties `X`, `Y`, and `Z`.


## Examples

LAB to RGB conversion:
```javascript

import { labToRgb } from 'lab-color';

const labColor = { l: 50, a: 20, b: -10 };
const rgbColor = labToRgb(labColor);
console.log(rgbColor); // { r: 120, g: 180, b: 200 }

```

RGB to LAB conversion:
```javascript

import { rgbToLab } from 'lab-color';

const rgbColor = { r: 120, g: 180, b: 200 };
const labColor = rgbToLab(rgbColor);
console.log(labColor); // { l: 50, a: 20, b: -10 }
```

## References and inspirations

- [Bruce Lindbloom color conversion algorithm collection](http://www.brucelindbloom.com/index.html?ColorDifferenceCalc.html)
- [CIELAB color space](https://en.wikipedia.org/wiki/Lab_color_space)
- [RGB color model](https://en.wikipedia.org/wiki/RGB_color_model)
