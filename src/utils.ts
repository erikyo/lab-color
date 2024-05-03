/**
 * Clamp a number between 'a' and 'b'
 * @param num
 * @param a lower
 * @param b upper
 */
const clampNumber = (num: number, a: number, b: number) =>
	// Use Math.max and Math.min to ensure 'num' is within the range defined by 'a' and 'b'
	Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

/**
 * Round and clamps each color channel to a number between max * -1 and max
 */
export const clamp = (n: number, min = 0, max = 255, decimals = 2) => {
	const result = clampNumber(n, min, max);
	return Number(result.toFixed(decimals));
};
