var colorlib = require('./color-lib');
var colorNames = require('./color-names');
function isColor(c) {
    return c instanceof Color;
}
/** @class Color
 * Color class accepts a CSS color string, rgb, hsl data as the input, manipulate the color, and returns a CSS-compatible color string.
 * @constructor
 *
 * @example
 * new Color('red')  // named CSS colors
 *
 * @example
 * new Color('#f00')  // hex 3 characters
 *
 * @example
 * new Color('#e2b644')  // hex 6 characters
 *
 * @example
 * new Color('rgb(255, 0, 100)')  // rgb()
 *
 * @example
 * new Color('rgba(255, 0, 100, 0.5)')  // rgba()
 *
 * @example
 * new Color([255,0,0])  // rgb array
 *
 * @example
 * new Color([255,0,0, 0.5])  // rgba array (alpha channel)
 *
 * @example
 * new Color({  // hsl object
 *     h: 0.2,
 *     s: 0.5,
 *     l: 1
 * })
 *
 * @example
 * new Color({  // hsla object
 *     h: 0.5,
 *     s: 1,
 *     l: 1,
 *     a: 0.5
 * })
 */
var Color = function () {
    var a = arguments[0];
    if (isColor(a)) {
        this.rgb = a.getRGB();
    }
    else if (typeof a === 'object' && 'h' in a && 's' in a && 'l' in a) {
        this.rgb = colorlib.hsl2rgb([a.h, a.s, a.l]);
        if ('a' in a && a.a >= 0 && a.a < 1) {
            this.rgb[3] = a.a;
        }
    }
    else if (arguments.length === 1) {
        this.rgb = colorlib.getRGB(a);
    }
    else {
        this.rgb = colorlib.getRGB(Array.from(arguments));
    }
};
Color.prototype = {
    toString: function () {
        return colorlib.rgb2css(this.rgb);
    },
    // setters
    /**
     * Sets the transparency of a color
     *
     * @method alpha
     * @memberof Color
     * @param {Number} alpha transparency level between 0 and 1
     * @return {Color} new Color() instance
     * @instance
     *
     * @example
     * new Color('#f00').alpha(0.5).toString();  // returns "rgba(255,0,0,0.5)"
     *
     */
    alpha: function (v) {
        return new Color(colorlib.alpha(this.rgb, v));
    },
    /**
     * Increases the "lightness" of a color value
     *
     * @method lighten
     * @memberof Color
     * @param {Number} lightenBy amount to lighten between 0 and 1
     * @return {Color} new Color() instance
     * @instance
     *
     * @example
     * new Color('#f00').lighten(0.5).toString(); // returns "#FF8080"
     *
     */
    lighten: function (v) {
        return new Color(colorlib.lighten(this.rgb, v));
    },
    /**
     * Decreases the "lightness" of a color value
     *
     * @method darken
     * @memberof Color
     * @param {Number} darkenBy amount to darken between 0 and 1
     * @return {Color} new Color() instance
     * @instance
     *
     * @example
     * new Color('#f00').darken(0.5).toString(); // returns "#800000"
     *
     */
    darken: function (v) {
        return new Color(colorlib.darken(this.rgb, v));
    },
    /**
     * Increases the "saturation" of a color value
     *
     * @method saturate
     * @memberof Color
     * @param {Number} saturateBy amount to saturate between 0 and 1
     * @return {Color} new Color() instance
     * @instance
     *
     * @example
     * new Color('rgb(125,0,0)').saturate(0.2).toString(); // returns "#7D0000"
     *
     */
    saturate: function (v) {
        return new Color(colorlib.saturate(this.rgb, v));
    },
    /**
     * Decreases the "saturation" of a color value
     *
     * @method desaturate
     * @memberof Color
     * @param {Number} desaturateBy amount to desaturate between 0 and 1
     * @return {Color} new Color() instance
     * @instance
     *
     * @example
     * new Color(125,0,0).desaturate(0.2).toString(); // returns "#710C0C"
     *
     */
    desaturate: function (v) {
        return new Color(colorlib.desaturate(this.rgb, v));
    },
    /**
     * Shifts the "hue" of a color value by a given percentage
     *
     * @method shiftHue
     * @memberof Color
     * @param {Number} hueShift amount to modify the hue by between 0 and 1
     * @return {Color} new Color() instance
     * @instance
     *
     * @example
     * new Color(255,255,0).shiftHue(0.25).toString(); // returns "#00FF7F"
     *
     */
    shiftHue: function (v) {
        return new Color(colorlib.shiftHue(this.rgb, v));
    },
    /**
     * Shifts the hue of a color closer to another color by a given percentage
     *
     * @method combine
     * @memberof Color
     * @param {Object} targetColor color string, array, or object
     * @param {Number} [amount=0.5] how close to the target color between 0 and 1 (0.5 is half-way between)
     * @return {Color} new Color() instance
     * @instance
     *
     * @example
     * new Color(0).combine('#fff').toString(); // returns "#808080"
     * new Color(255,0,0).combine('#00f',0.7).toString(); // returns "#4D00B3"
     *
     */
    combine: function (t, v) {
        var combineColor = new Color(t);
        var c = colorlib.combine(this.rgb, combineColor.rgb, v);
        return new Color(c);
    },
    /**
     * Shifts only the hue of a color closer to another color by a given percentage
     *
     * @method tint
     * @memberof Color
     * @param {String} targetColor color string or array
     * @param {Number} amount amount to shift the hue toward the target color between 0 and 1
     * @return {Color} new Color() instance
     * @instance
     *
     * @example
     * new Color('rgb(255,0,0)').tint('#00f',0.5).toString(); // returns "#F0F"
     * new Color('rgb(0,0,100)').tint('rgb(100,0,0)',0.1).toString(); // returns "#140064"
     *
     */
    tint: function (t, v) {
        var tintColor = new Color(t);
        return new Color(colorlib.tint(this.rgb, tintColor.rgb, v));
    },
    /**
     * Set the "hue" of a color
     *
     * @method hue
     * @memberof Color
     * @param {Number} hue hue value between 0 and 1
     * @return {Color} new Color() instance
     * @instance
     *
     * @example
     * new Color('#f00').hue(2/3).toString(); // returns "#00F"
     * new Color('#0f0').hue(1).toString(); // returns "#F00"
     * new Color('#00f').hue(1/3).toString(); // returns "#0F0"
     *
     */
    hue: function (v) {
        return new Color(colorlib.hue(this.rgb, v));
    },
    /**
     * Set the "saturation" of a color
     *
     * @method saturation
     * @memberof Color
     * @param {Number} saturation saturation value between 0 and 1
     * @return {Color} new Color() instance
     * @instance
     *
     * @example
     * new Color('rgb(100,50,50)').saturation(0).toString(); // returns "#4B4B4B"
     * new Color('rgb(50,0,0)').saturation(0.5).toString();  // returns "#260C0C"
     * new Color('rgb(50,50,100)').saturation(1).toString(); // returns "#000096"
     *
     */
    saturation: function (v) {
        return new Color(colorlib.saturation(this.rgb, v));
    },
    /**
     * Set the lightness of a color, how close to white or black the color will be
     *
     * @method lightness
     * @memberof Color
     * @param {Number} lightness lightness value between 0 and 1
     * @return {Color} new Color() instance
     * @instance
     *
     * @example
     * new Color('rgb(255,0,0)').lightness(0).toString(); // returns "#000"
     * new Color('rgb(255,0,0)').lightness(0.5).toString(); // returns "#F00"
     * new Color('rgb(255,0,0)').lightness(1).toString(); // returns "#FFF"
     *
     */
    lightness: function (v) {
        return new Color(colorlib.lightness(this.rgb, v));
    },
    /**
     * Inverts the color
     *
     * @method invert
     * @memberof Color
     * @return {Color} new Color() instance
     * @instance
     *
     * @example
     * new Color('#f00').invert(1).toString(); // returns "#0FF"
     * new Color('#fff').invert().toString();  // returns "#000"
     *
     */
    invert: function () {
        return new Color(colorlib.invert(this.rgb));
    },
    /**
     * Set the hue, saturation, or lightness of a color and return the new color
     *
     * @method hsl
     * @memberof Color
     * @param {Number} hue hue value between 0 and 1
     * @param {Number} saturation saturation value between 0 and 1
     * @param {Number} lightness lightness value between 0 and 1
     * @return {Color} new Color() instance
     * @instance
     *
     * @example
     * new Color('#f00').hsl(null,0.5,0.5).toString(); // returns "#BF4040"
     *
     */
    hsl: function () {
        var a = Array.from(arguments);
        a.unshift(this.rgb);
        return new Color(colorlib.setHSL.apply(null, a));
    },
    /**
     * Set the red component of a color
     *
     * @method red
     * @memberof Color
     * @param {Number} red red component 0-255
     * @return {Color} new Color() instance
     * @instance
     *
     * @example
     * new Color('rgb(0,0,255)').red(255).toString();  // returns "#F0F"
     *
     */
    red: function (r) {
        return new Color(colorlib.setRGB(this.rgb, [r]));
    },
    /**
     * Set the green component of a color
     *
     * @method green
     * @memberof Color
     * @param {Number} green green component 0-255
     * @return {Color} new Color() instance
     * @instance
     *
     * @example
     * new Color('rgb(255,0,0)').green(255).toString();  // returns "#FF0"
     *
     */
    green: function (g) {
        return new Color(colorlib.setRGB(this.rgb, [null, g]));
    },
    /**
     * Set the blue component of a color
     *
     * @method blue
     * @memberof Color
     * @param {Number} blue blue component 0-255
     * @return {Color} new Color() instance
     * @instance
     *
     * @example
     * new Color('#FF0').blue(255).toString();  // returns "#FFF"
     *
     */
    blue: function (b) {
        return new Color(colorlib.setRGB(this.rgb, [null, null, b]));
    },
    // getters
    /**
     * Returns the transparency of a color
     *
     * @method getAlpha
     * @memberof Color
     * @return {Number} alpha transparency level between 0 and 1
     * @instance
     *
     * @example
     * new Color('#F00').getAlpha(); // returns 0
     * new Color('rgba(255,0,0,0.5)').getAlpha(); // returns 0.5
     *
     */
    getAlpha: function () {
        return (this.rgb.length === 4) ? this.rgb[3] : 1;
    },
    /**
     * Returns the hexidecimal value of the color
     *
     * @method getHex
     * @memberof Color
     * @return {String} hex color value
     * @instance
     *
     * @example
     * new Color('rgba(255,0,0,0.5)').getHex(); // returns "#f00"
     *
     */
    getHex: function () {
        return colorlib.rgb2hex(this.rgb);
    },
    /**
     * Returns the red component of a color string
     *
     * @method getRed
     * @memberof Color
     * @return {Number} red component 0-255
     * @instance
     *
     * @example
     * new Color('#fff').getRed(); // returns 255
     *
     */
    getRed: function () {
        return this.rgb[0];
    },
    /**
     * Returns the green component of a color string
     *
     * @method getGreen
     * @memberof Color
     * @return {Number} green component 0-255
     * @instance
     *
     * @example
     * new Color('#fff').getGreen(); // returns 255
     *
     */
    getGreen: function () {
        return this.rgb[1];
    },
    /**
     * Returns the blue component of a color string
     *
     * @method getBlue
     * @memberof Color
     * @return {Number} blue component 0-255
     * @instance
     *
     * @example
     * new Color('#fff').getBlue(); // returns 255
     *
     */
    getBlue: function () {
        return this.rgb[2];
    },
    /**
     * Returns an [h,s,l] array from color string
     *
     * @method getHSL
     * @memberof Color
     * @return {Number[]} hsl array of [hue,saturation,lightness]
     * @instance
     *
     * @example
     * new Color('#f00').getHSL(); // returns [0,1,0.5]
     *
     */
    getHSL: function () {
        return colorlib.getHSL(this.rgb);
    },
    /**
     * Return the "hue" of a color
     *
     * @method getHue
     * @memberof Color
     * @return {Number} hue hue value between 0 and 1
     * @instance
     *
     * @example
     * new Color('#a1b2c1').getHue(); // returns "0.578125"}
     * new Color('#f00').getHue(); // returns 0
     * new Color('#0f0').getHue(); // returns 0.3333333333333333
     * new Color('#00f').getHue(); // returns 0.6666666666666666
     *
     */
    getHue: function () {
        return this.getHSL()[0];
    },
    /**
     * Return the "saturation" of a color
     *
     * @method getSaturation
     * @memberof Color
     * @return {Number} saturation saturation value between 0 and 1
     * @instance
     v
     * @example
     * new Color('rgb(100,100,100)').getSaturation(); // returns 0
     * new Color('rgb(100,50,100)').getSaturation();  // returns 0.8333333333333334
     * new Color('rgb(100,0,100)').getSaturation();   // returns 1
     *
     */
    getSaturation: function () {
        return this.getHSL()[1];
    },
    /**
     * Return the lightness of a color (how close to white or black the color is)
     *
     * @method getLightness
     * @memberof Color
     * @return {Number} lightness lightness value between 0 and 1
     * @instance
     *
     * @example
     * new Color('rgb(0,0,0)').getLightness();       // returns 0
     * new Color('rgb(100,50,100)').getLightness();  // returns 0.29411764705882354
     * new Color('rgb(255,255,255)').getLightness(); // returns 1
     *
     */
    getLightness: function () {
        return this.getHSL()[2];
    },
    /**
     * Return the red, green, blue color values with the alpha channel as an array
     *
     * @method getRGB
     * @memberof Color
     * @return {Array} rgba the array of color values
     * @instance
     *
     * @example
     * new Color('red).getRGB();   // returns [255,0,0]
     *
     */
    getRGB: function () {
        return this.rgb.slice();
    }
};
module.exports = Color;
/**
 * Color.names is n object literal containing the list of named color values and their RGB value array
 *
 * @property names
 * @memberof Color
 *
 * @example
 * console.log( Color.names.red ); // outputs [255,0,0]
 */
Color.names = colorNames;