/**
 * An array of 4 numbers describing the bounds of the rectangle: `[left, top,
 * right, bottom]`.
 * @typedef {number[]} Rect
 */

/**
 * An array of 2 numbers containing the coordinates of the point: `[x, y]`.
 * @typedef {number[]} Point
 */

(function () {
    /** 
     * @module ai-scripting-utils
     * @typicalname _
     */

    /**
     * Checks if `value` is an `Array` object.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is an array, `false` otherwise.
     */
    function isArray(value) {
        return Object.prototype.toString.call(value) == "[object Array]";
    }

    /**
     * Checks if `value` is array-like.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is array-like, `false` otherwise.
     */
    function isArrayLike(value) {
        if (value != null && typeof value != "function") {
            var length = value.length;
            return typeof length == "number" && length >= 0 && length % 1 == 0;
        }
        return false;
    }

    /**
     * Executes `callback` for each element of `array`. The callback takes three
     * arguments: `value`, `index`, `array`. The callback may exit iteration
     * early by explicitly returning `false`.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {Array} array The array to iterate over.
     * @param {Function} callback The function called for each element.
     * @param {number} [fromIndex=0] The index to iterate from.
     */
    function each(array, callback, fromIndex) {
        if (typeof callback != "function") return;
        if (isNaN(fromIndex) || fromIndex < 0) fromIndex = 0;

        var length = array == null ? 0 : array.length;

        for (var i = fromIndex; i < length; i++) {
            if (callback(array[i], i, array) === false) break;
        }
    }

    /**
     * Creates a new array of those elements for which `callback` returned a
     * truthy value. The callback takes three arguments: `value`, `index`,
     * `array`.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {Array} array The array to iterate over.
     * @param {Function} callback The function called for each element.
     * @returns {Array} The new filtered array.
     */
    function filter(array, callback) {
        if (typeof callback != "function") return clone(array);

        var length = array == null ? 0 : array.length;
        var result = [];
        var resIndex = 0;

        for (var i = 0; i < length; i++) {
            var value = array[i];
            if (callback(value, i, array)) result[resIndex++] = value;
        }

        return result;
    }

    /**
     * Creates a new array populated with the results of `callback` invocation
     * for each element of `array`. The callback takes three arguments: `value`,
     * `index`, `array`.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {Array} array The array to iterate over.
     * @param {Function} callback The function called for each element.
     * @returns {Array} The new mapped array.
     */
    function map(array, callback) {
        if (typeof callback != "function") return clone(array);

        var length = array == null ? 0 : array.length;
        var result = new Array(length);

        for (var i = 0; i < length; i++) {
            result[i] = callback(array[i], i, array);
        }

        return result;
    }

    /**
     * Executes `reducer` for each element of `array`, resulting in a single
     * output value. The callback takes four arguments: `accumulator`, `value`,
     * `index`, `array`.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {Array} array The array to iterate over.
     * @param {Function} callback The function called for each element.
     * @param {*} accumulator The initial value.
     * @returns {*} The accumulated value.
     */
    function reduce(array, reducer, accumulator) {
        var length = array == null ? 0 : array.length;
        var i = 0;

        if (length) {
            if (typeof reducer != "function") return array[i];
            if (accumulator == null) accumulator = array[i++];
        }

        for (; i < length; i++) {
            accumulator = reducer(accumulator, array[i], i, array);
        }

        return accumulator;
    }

    /**
     * This function is like `reduce` except that it iterates over elements of
     * `array` from right to left.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {Array} array The array to iterate over.
     * @param {Function} callback The function called for each element.
     * @param {*} accumulator The initial value.
     * @returns {*} The accumulated value.
     */
    function reduceRight(array, reducer, accumulator) {
        var length = array == null ? 0 : array.length;
        var i = length - 1;

        if (length) {
            if (typeof reducer != "function") return array[i];
            if (accumulator == null) accumulator = array[i--];
        }

        for (; i >= 0; i--) {
            accumulator = reducer(accumulator, array[i], i, array);
        }

        return accumulator;
    }

    /**
     * Checks if `callback` returns a truly value for all elements of `array`.
     * The callback takes three arguments: `value`, `index`, `array`.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {Array} array The array to iterate over.
     * @param {Function} callback The function called for each element.
     * @returns {boolean} `true` if all elements pass the check, `false`
     * otherwise.
     */
    function every(array, callback) {
        var length = array == null ? 0 : array.length;

        if (typeof callback != "function") return true;

        for (var i = 0; i < length; i++) {
            if (!callback(array[i], i, array)) return false;
        }

        return true;
    }

    /**
     * Checks if `callback` returns a truly value for at least one element of
     * `array`. The callback takes three arguments: `value`, `index`, `array`.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {Array} array The array to iterate over.
     * @param {Function} callback The function called for each element.
     * @returns {boolean} `true` if at least one element pass the check, `false`
     * otherwise.
     */
    function some(array, callback) {
        var length = array == null ? 0 : array.length;

        if (length && typeof callback != "function") return true;

        for (var i = 0; i < length; i++) {
            if (callback(array[i])) return true;
        }

        return false;
    }

    /**
     * Returns the first value in `array` for which `callback` returned a truly
     * value. The callback takes three arguments: `value`, `index`, `array`.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {Array} array The array to inspect.
     * @param {Function} callback The function called for each element.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {*} The matched element, `undefined` otherwise.
     */
    function find(array, callback, fromIndex) {
        var i = findIndex(array, callback, fromIndex);
        if (i > -1) return array[i];
    }

    /**
     * Returns the index of the first value in `array` for which `callback`
     * returned a truly value. The callback takes three arguments: `value`,
     * `index`, `array`.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {Array} array The array to inspect.
     * @param {Function} callback The function called for each element.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} The index of the found element, -1 otherwise.
     */
    function findIndex(array, callback, fromIndex) {
        if (typeof callback != "function") return -1;
        if (isNaN(fromIndex) || fromIndex < 0) fromIndex = 0;

        var length = array == null ? 0 : array.length;

        for (var i = fromIndex; i < length; i++) {
            if (callback(array[i], i, array)) return i;
        }

        return -1;
    }

    /**
     * Returns the index of the first occurance of `value` in `array`.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} The index of the found element, -1 otherwise.
     */
    function indexOf(array, value, fromIndex) {
        if (isNaN(fromIndex) || fromIndex < 0) fromIndex = 0;

        var length = array == null ? 0 : array.length;

        for (var i = fromIndex; i < length; i++) {
            if (array[i] === value) return i;
        }

        return -1;
    }

    /**
     * This function is like `indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} The index of the found element, -1 otherwise.
     */
    function lastIndexOf(array, value, fromIndex) {
        var length = array == null ? 0 : array.length;

        if (isNaN(fromIndex) || fromIndex >= length) fromIndex = length - 1;

        for (var i = fromIndex; i >= 0; i--) {
            if (array[i] === value) return i;
        }

        return -1;
    }

    /**
     * Checks if `collection` includes `value`.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {(Array|Object|string)} collection The collection to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {boolean} `true` if `value` is found, `false` otherwise.
     */
    function includes(collection, value, fromIndex) {
        if (typeof collection == "string") {
            return collection.indexOf(value, fromIndex) > -1;
        }

        if (isArrayLike(collection)) {
            return indexOf(collection, value, fromIndex) > -1;
        }

        if (typeof collection == "object" && collection !== null) {
            for (var key in collection) {
                if (
                    collection.hasOwnProperty(key)
                    && collection[key] === value
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Creates a clone of `array`.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {Array} array The array to clone.
     * @returns {Array} The cloned array.
     */
    function clone(array) {
        if (isArray(array)) return array.slice();
        if (isArrayLike(array)) return Array.prototype.slice.call(array);
        return [];
    }

    /**
     * Fills `array` with `value`. This function mutates `array`.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {Array} array The array to fill.
     * @param {*} value The filling value.
     * @returns {Array} `array`.
     */
    function fill(array, value) {
        var length = array == null ? 0 : array.length;

        if (!length) return [];

        for (var i = 0; i < length; i++) {
            array[i] = value;
        }

        return array;
    }

    /**
     * Creates an array of shuffled values, using the Fisher-Yates shuffle
     * algorithm.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {Array} array The array to shuffle.
     * @returns {Array} The new shuffled array.
     */
    function shuffle(array) {
        var length = array == null ? 0 : array.length;

        if (!length) return [];

        var result = new Array(length);

        for (var i = 0; i < length; i++) {
            var j = Math.round(Math.random() * i);
            result[i] = result[j];
            result[j] = array[i];
        }

        return result;
    }

    /**
     * Retrieves the last element of `array`.
     *
     * @memberof module:ai-scripting-utils
     * @category Array and Array-Like Functions
     * @param {Array} array The array to query.
     * @returns {*} The last element of `array`.
     */
    function last(array) {
        if (array != null) return array[array.length - 1];
    }

    /**
     * Assigns own enumerable properties of source objects to the destination
     * object. Source objects are applied from left to right. Subsequent sources
     * overwrite property assignments of previous sources. This function mutates
     * `object`.
     *
     * @memberof module:ai-scripting-utils
     * @category Object Functions
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} `object`.
     */
    function assign(object, sources) {
        if (object == null || typeof object != "object") object = new Object(object);

        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            if (source == null) continue;
            for (var key in source) {
                if (source.hasOwnProperty(key)) object[key] = source[key];
            }
        }

        return object;
    }

    /**
     * Assigns own enumerable properties of source objects to the destination
     * object for all destination properties that resolve to `undefined`. Source
     * objects are applied from left to right. Once a property is set,
     * additional values of the same property are ignored. This function mutates
     * `object`.
     *
     * @memberof module:ai-scripting-utils
     * @category Object Functions
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} `object`.
     */
    function defaults(object, sources) {
        if (object == null || typeof object != "object") object = new Object(object);

        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            if (source == null) continue;
            for (var key in source) {
                if (
                    source.hasOwnProperty(key)
                    && object[key] === undefined
                ) {
                    object[key] = source[key];
                }
            }
        }

        return object;
    }

    /**
     * Returns an array of own enumerable property keys for `object`.
     *
     * @memberof module:ai-scripting-utils
     * @category Object Functions
     * @param {Object} object The object to query.
     * @returns {Array} The array of property keys.
     */
    function keys(object) {
        if (object == null || typeof object != "object") return [];

        var result = [];

        for (var key in object) {
            if (object.hasOwnProperty(key)) result.push(key);
        }

        return result;
    }

    /**
     * Returns an array of own enumerable property values for `object`.
     *
     * @memberof module:ai-scripting-utils
     * @category Object Functions
     * @param {Object} object The object to query.
     * @returns {Array} The array of property values.
     */
    function values(object) {
        if (object == null || typeof object != "object") return [];

        var result = [];

        for (var key in object) {
            if (object.hasOwnProperty(key)) result.push(object[key]);
        }

        return result;
    }

    /**
     * Returns an array of own enumerable property key-value pairs for `object`.
     *
     * @memberof module:ai-scripting-utils
     * @category Object Functions
     * @param {Object} object The object to query.
     * @returns {Array} The array of key-value pairs.
     */
    function entries(object) {
        if (object == null || typeof object != "object") return [];

        var result = [];

        for (var key in object) {
            if (object.hasOwnProperty(key)) result.push([key, object[key]]);
        }

        return result;
    }

    /**
     * Returns `string` repeated `count` times.
     *
     * @memberof module:ai-scripting-utils
     * @category String Functions
     * @param {string} string The string to repeat.
     * @param {number} [count=1] The number of repetitions.
     * @returns {string} The repeated `string`.
     */
    function repeat(string, count) {
        string = string == null ? "" : String(string);
        if (count == null) count = 1;

        var result = "";

        for (var i = 0; i < count; i++) {
            result += string;
        }

        return result;
    }

    /**
     * Removes specified characters from both ends of `string`.
     *
     * @memberof module:ai-scripting-utils
     * @category String Functions
     * @param {string} string The string to trim.
     * @param {string} [chars=​ ​] The characters to trim.
     * @returns {string} The trimmed `string`.
     */
    function trim(string, chars) {
        return trimStart(trimEnd(string, chars), chars);
    }

    /**
     * Removes specified characters from the beginning of `string`.
     *
     * @memberof module:ai-scripting-utils
     * @category String Functions
     * @param {string} string The string to trim.
     * @param {string} [chars=​ ​] The characters to trim.
     * @returns {string} The trimmed `string`.
     */
    function trimStart(string, chars) {
        string = string == null ? "" : String(string);
        chars = chars == null ? " " : String(chars);
        for (var i = 0; i < string.length && chars.indexOf(string[i]) > -1; i++);
        return string.slice(i, string.length);
    }

    /**
     * Removes specified characters from the end of `string`.
     *
     * @memberof module:ai-scripting-utils
     * @category String Functions
     * @param {string} string The string to trim.
     * @param {string} [chars=​ ​] The characters to trim.
     * @returns {string} The trimmed `string`.
     */
    function trimEnd(string, chars) {
        string = string == null ? "" : String(string);
        chars = chars == null ? " " : String(chars);
        for (var i = string.length - 1; i >= 0 && chars.indexOf(string[i]) > -1; i--);
        return string.slice(0, i + 1);
    }

    /**
     * Checks if `string` starts with `target` string.
     *
     * @memberof module:ai-scripting-utils
     * @category String Functions
     * @param {string} string The string to inspect.
     * @param {string} target The string to search for.
     * @returns {boolean} `true` if `string` starts with `target`, `false`
     * otherwise.
     */
    function startsWith(string, target) {
        string = string == null ? "" : String(string);
        return string.indexOf(target) == 0;
    }

    /**
     * Checks if `string` ends with `target` string.
     *
     * @memberof module:ai-scripting-utils
     * @category String Functions
     * @param {string} string The string to inspect.
     * @param {string} target The string to search for.
     * @returns {boolean} `true` if `string` ends with `target`, `false`
     * otherwise.
     */
    function endsWith(string, target) {
        string = string == null ? "" : String(string);
        var targetLength = target == null ? 0 : target.length;
        return string.indexOf(target) + targetLength == string.length;
    }

    function basePad(string, length, chars, padstart, padEnd) {
        string = string == null ? "" : String(string);
        length = length || 0;
        chars = chars == null ? " " : String(chars);

        var padding = "";
        var paddingLength = length - string.length;

        if (chars.length == 0 || paddingLength <= 0) return string;

        for (var i = 0; i < paddingLength; i++) {
            padding += chars[i % chars.length];
        }

        if (padstart && padEnd) {
            var paddingStart = padding.slice(0, Math.floor(paddingLength / 2));
            var paddingEnd = padding.slice(0, Math.ceil(paddingLength / 2));
            return paddingStart + string + paddingEnd;
        } else if (padEnd) {
            return string + padding;
        }

        return padding + string;
    }

    /**
     * Evenly pads the beginning and end of `string` with `chars` until the
     * resulting string reaches `length`.
     *
     * @memberof module:ai-scripting-utils
     * @category String Functions
     * @param {string} string The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=​ ​] The padding string.
     * @returns {string} The padded string.
     */
    function pad(string, length, chars) {
        return basePad(string, length, chars, true, true);
    }

    /**
     * Pads the beginning of `string` with `chars` until the resulting string
     * reaches `length`.
     *
     * @memberof module:ai-scripting-utils
     * @category String Functions
     * @param {string} string The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=​ ​] The padding string.
     * @returns {string} The padded string.
     */
    function padStart(string, length, chars) {
        return basePad(string, length, chars, true);
    }

    /**
     * Pads the end of `string` with `chars` until the resulting string reaches
     * `length`.
     *
     * @memberof module:ai-scripting-utils
     * @category String Functions
     * @param {string} string The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=​ ​] The padding string.
     * @returns {string} The padded string.
     */
    function padEnd(string, length, chars) {
        return basePad(string, length, chars, false, true);
    }

    /**
     * Prints `message` to the console. It is a shorthand for `$.writeln()`.
     *
     * @memberof module:ai-scripting-utils
     * @category Utility Functions
     * @param {*} message The message to print.
     */
    function log(message) {
        $.writeln(message);
    }

    /**
     * Checks if `number` is in the range `[0,1)`.
     *
     * @function module:ai-scripting-utils.inRange
     * @category Utility Functions
     * @param {number} number The number to check.
     * @returns {boolean} `true` if `number` is in the range, `false` otherwise.
     */
    /**
     * Checks if `number` is in the range `[0,upper)`. If `upper` is less than
     * `0` the range boundaries are swapped.
     *
     * @function module:ai-scripting-utils.inRange
     * @category Utility Functions
     * @param {number} number The number to check.
     * @param {number} upper The upper bound of the range.
     * @returns {boolean} `true` if `number` is in the range, `false` otherwise.
     */
    /**
     * Checks if `number` is in the range `[lower,upper)`. If `lower` is greater
     * than `upper` the range boundaries are swapped.
     *
     * @function module:ai-scripting-utils.inRange
     * @category Utility Functions
     * @param {number} number The number to check.
     * @param {number} lower The lower bound of the range.
     * @param {number} upper The upper bound of the range.
     * @returns {boolean} `true` if `number` is in the range, `false` otherwise.
     */
    function inRange(number, arg1, arg2) {
        var lower = 0;
        var upper = 1;

        if (arguments.length == 2) {
            upper = arg1;
        } else if (arguments.length >= 3) {
            lower = arg1;
            upper = arg2;
        }

        if (lower > upper) {
            var tmp = lower;
            lower = upper;
            upper = tmp;
        }

        return number >= lower && number < upper;
    }

    /**
     * Returns a random number between the inclusive `0` and `1` bounds. If
     * `floating` is `true` a floating point number is returned.
     *
     * @function module:ai-scripting-utils.random
     * @category Utility Functions
     * @param {boolean} [floating=false] Whether a floating point number should
     * be returned.
     * @returns {number} The random number.
     */
    /**
     * Returns a random number between the inclusive `0` and `upper` bounds. If
     * either `floating` is `true` or `upper` is a float, a floating point
     * number is returned. If `upper` is less than `0` the range boundaries are
     * swapped.
     *
     * @function module:ai-scripting-utils.random
     * @category Utility Functions
     * @param {number} upper The upper bound.
     * @param {boolean} [floating=false] Whether a floating point number should
     * be returned.
     * @returns {number} The random number.
     */
    /**
     * Returns a random number between the inclusive `lower` and `upper` bounds.
     * If `floating` is `true`, or either `lower` or `upper` are floats, a
     * floating point number is returned. If `lower` is greater than `upper` the
     * range boundaries are swapped.
     *
     * @function module:ai-scripting-utils.random
     * @category Utility Functions
     * @param {number} lower The lower bound.
     * @param {number} upper The upper bound.
     * @param {boolean} [floating=false] Whether a floating point number should
     * be returned.
     * @returns {number} The random number.
     */
    function random(arg0, arg1, arg2) {
        var lower = 0;
        var upper = 1;
        var floating = false;

        if (arguments.length == 1) {
            if (typeof arg0 == "boolean") {
                floating = arg0;
            } else {
                upper = arg0;
            }
        } else if (arguments.length == 2) {
            if (typeof arg1 == "boolean") {
                upper = arg0;
                floating = arg1;
            } else {
                lower = arg0;
                upper = arg1;
            }
        } else if (arguments.length >= 3) {
            lower = arg0;
            upper = arg1;
            floating = arg2;
        }

        if (lower % 1 != 0 || upper % 1 != 0) floating = true;
        if (lower > upper) {
            var tmp = lower;
            lower = upper;
            upper = tmp;
        }

        var result = +lower + (upper - lower) * Math.random();
        if (isNaN(result)) return 0;
        return floating ? result : Math.round(result);
    }

    /**
     * Creates a rectangle.
     *
     * @function module:ai-scripting-utils.createRect
     * @category Rect Functions
     * @param {number} width The width of the rectangle.
     * @param {number} height The height of the rectangle.
     * @param {Point} [fromPoint=[0, 0]] The top left point of the rectangle.
     * @returns {Rect} The new rectangle.
     */
    /**
     * Creates a rectangle.
     *
     * @function module:ai-scripting-utils.createRect
     * @category Rect Functions
     * @param {number} left The left border of the rectangle.
     * @param {number} top The top border of the rectangle.
     * @param {number} right The right border of the rectangle.
     * @param {number} bottom The bottom border of the rectangle.
     * @returns {Rect} The new rectangle.
     */
    /**
     * Creates a rectangle from the passed points. The points do not necessarily
     * need to be the top left and bottom right corners.
     *
     * @function module:ai-scripting-utils.createRect
     * @category Rect Functions
     * @param {Point} fromPoint The first point.
     * @param {Point} toPoint The second point.
     * @returns {Rect} The new rectangle.
     */
    /**
     * Creates a new rectangle from the passed rectangle.
     *
     * @function module:ai-scripting-utils.createRect
     * @category Rect Functions
     * @param {Rect} rect The rectangle to copy.
     * @returns {Rect} The new rectangle.
     */
    function createRect(arg0, arg1, arg2, arg3) {
        var rect = [0, 0, 0, 0];

        if (arguments.length == 1 && isArray(arg0)) {
            rect = [+arg0[0], +arg0[1], +arg0[2], +arg0[3]];
        } else if (arguments.length == 2 && isArray(arg0) && isArray(arg1)) {
            rect = [
                Math.min(arg0[0], arg1[0]),
                Math.max(arg0[1], arg1[1]),
                Math.max(arg0[0], arg1[0]),
                Math.min(arg0[1], arg1[1])
            ];
        } else if (arguments.length < 4 && !isNaN(arg0) && !isNaN(arg1)) {
            if (isArray(arg2)) {
                rect[0] = +arg2[0];
                rect[1] = +arg2[1];
            }
            rect[2] = rect[0] + +arg0;
            rect[3] = rect[1] - arg1;
        } else if (arguments.length >= 4) {
            rect = [+arg0, +arg1, +arg2, +arg3];
        }

        return rect;
    }

    /**
     * Returns the position of the desired side of `rect`.
     *
     * @memberof module:ai-scripting-utils
     * @category Rect Functions
     * @param {Rect} rect The rectangle to query.
     * @param {("left"|"top"|"right"|"bottom"|"centerX"|"centerY")} side The
     * desired side.
     * @returns {?number} The position of the side of `rect`.
     */
    function getRectSide(rect, side) {
        rect = rect || [];

        switch (side) {
            case "left":
                return +rect[0];
            case "top":
                return +rect[1];
            case "right":
                return +rect[2];
            case "bottom":
                return +rect[3];
            case "centerX":
                return +rect[0] + (rect[2] - rect[0]) / 2;
            case "centerY":
                return +rect[1] + (rect[3] - rect[1]) / 2;
        }
    }

    /**
     * Returns the point of `rect` from the specified location.
     *
     * @memberof module:ai-scripting-utils
     * @category Rect Functions
     * @param {Rect} rect The rectangle to query.
     * @param {("topLeft"|"topRight"|"bottomLeft"|"bottomRight"|"center")}
     * location The location of the point.
     * @returns {?Point} The point of `rect`.
     */
    function getRectPoint(rect, location) {
        rect = rect || [];

        switch (location) {
            case "topLeft":
                return [+rect[0], +rect[1]];
            case "topRight":
                return [+rect[2], +rect[1]];
            case "bottomLeft":
                return [+rect[0], +rect[3]];
            case "bottomRight":
                return [+rect[2], +rect[3]];
            case "center":
                return [getRectSide(rect, "centerX"), getRectSide(rect, "centerY")];
        }
    }

    /**
     * Returns the width of the rectangle.
     *
     * @memberof module:ai-scripting-utils
     * @category Rect Functions
     * @param {Rect} rect The rectangle to query.
     * @returns {number} The width of `rect`.
     */
    function getRectWidth(rect) {
        rect = rect || [];
        return rect[2] - rect[0];
    }

    /**
     * Returns the height of the rectangle.
     *
     * @memberof module:ai-scripting-utils
     * @category Rect Functions
     * @param {Rect} rect The rectangle to query.
     * @returns {number} The height of `rect`.
     */
    function getRectHeight(rect) {
        rect = rect || [];
        return rect[1] - rect[3];
    }

    /**
     * Returns the area of the rectangle.
     *
     * @memberof module:ai-scripting-utils
     * @category Rect Functions
     * @param {Rect} rect The rectangle to query.
     * @returns {number} The area of `rect`.
     */
    function getRectArea(rect) {
        return getRectWidth(rect) * getRectHeight(rect);
    }

    /**
     * Checks if two rectangles intersect.
     *
     * @memberof module:ai-scripting-utils
     * @category Rect Functions
     * @param {Rect} rect1 The first rectangle.
     * @param {Rect} rect2 The second rectangle.
     * @returns {boolean} `true` if the rectangles intersect, `false` otherwise.
     */
    function isRectsIntersect(rect1, rect2) {
        rect1 = rect1 || [];
        rect2 = rect2 || [];
        return rect1[0] < rect2[2]
            && rect1[1] > rect2[3]
            && rect1[2] > rect2[0]
            && rect1[3] < rect2[1];
    }

    /**
     * Returns the result of the intersection of two rectangles.
     *
     * @memberof module:ai-scripting-utils
     * @category Rect Functions
     * @param {Rect} rect1 The first rectangle.
     * @param {Rect} rect2 The second rectangle.
     * @returns {?Rect} The intersection rectangle or `null` if the rectangles
     * don't intersect.
     */
    function intersectRects(rect1, rect2) {
        rect1 = rect1 || [];
        rect2 = rect2 || [];
        if (!isRectsIntersect(rect1, rect2)) return null;
        return [
            Math.max(rect1[0], rect2[0]),
            Math.min(rect1[1], rect2[1]),
            Math.min(rect1[2], rect2[2]),
            Math.max(rect1[3], rect2[3])
        ];
    }

    /**
     * Returns the smallest rectangle containing `rect1` and `rect2`.
     *
     * @memberof module:ai-scripting-utils
     * @category Rect Functions
     * @param {Rect} rect1 The first rectangle.
     * @param {Rect} rect2 The second rectangle.
     * @returns {Rect} The containing rectangle.
     */
    function includeRects(rect1, rect2) {
        rect1 = rect1 || rect2 || [];
        rect2 = rect2 || rect1 || [];
        return [
            Math.min(rect1[0], rect2[0]),
            Math.max(rect1[1], rect2[1]),
            Math.max(rect1[2], rect2[2]),
            Math.min(rect1[3], rect2[3])
        ];
    }

    /**
     * Offsets `rect` by the given amount. Returns the new rectangle.
     *
     * @function module:ai-scripting-utils.offsetRect
     * @category Rect Functions
     * @param {Rect} rect The rectangle to offset.
     * @param {number} [amount=0] The amount to offset by.
     * @returns {Rect} The new offsetted rectangle.
     */
    /**
     * Offsets `rect` by the given amounts. Returns the new rectangle.
     *
     * @function module:ai-scripting-utils.offsetRect
     * @category Rect Functions
     * @param {Rect} rect The rectangle to offset.
     * @param {Object} [object]
     * @param {number} [object.left=0] The amount to offset from the left.
     * @param {number} [object.top=0] The amount to offset from the top.
     * @param {number} [object.right=0] The amount to offset from the right.
     * @param {number} [object.bottom=0] The amount to offset from the bottom.
     * @returns {Rect} The new offsetted rectangle.
     */
    function offsetRect(rect, arg1) {
        rect = rect || [];
        arg1 = arg1 || 0;

        var dleft, dright, dtop, dbottom;

        if (typeof arg1 == "object") {
            dleft = arg1.left || 0;
            dright = arg1.right || 0;
            dtop = arg1.top || 0;
            dbottom = arg1.bottom || 0;
        } else {
            dleft = dright = dtop = dbottom = arg1;
        }

        var result = [
            rect[0] - dleft,
            +rect[1] + +dtop,
            +rect[2] + +dright,
            rect[3] - dbottom
        ];

        if (getRectWidth(result) < 0) {
            result[0] = result[2] = getRectSide(result, "centerX");
        }
        if (getRectHeight(result) < 0) {
            result[1] = result[3] = getRectSide(result, "centerY");
        }

        return result;
    }

    /**
     * Expands `rect` by the given amount. Returns the new rectangle.
     *
     * @function module:ai-scripting-utils.expandRect
     * @category Rect Functions
     * @param {Rect} rect The rectangle to expand.
     * @param {number} amount The amount to expand by.
     * @returns {Rect} The new expanded rectangle.
     */
    /**
     * Expands `rect` by the given horizontal and vertical amounts. Returns the
     * new rectangle.
     *
     * @function module:ai-scripting-utils.expandRect
     * @category Rect Functions
     * @param {Rect} rect The rectangle to expand.
     * @param {number} hor The amount to expand horizontally.
     * @param {number} ver The amount to expand vertically.
     * @returns {Rect} The new expanded rectangle.
     */
    function expandRect(rect, arg1, arg2) {
        var hor = arg1 || 0;
        var ver = arg2 || hor;

        return offsetRect(rect, {
            left: hor / 2,
            top: ver / 2,
            right: hor / 2,
            bottom: ver / 2
        });
    }

    /**
     * Translates `rect` by the given horizontal and vertical amount. Returns
     * the new rectangle.
     *
     * @memberof module:ai-scripting-utils
     * @category Rect Functions
     * @param {Rect} rect The rectangle to translate.
     * @param {number} dx The amount to translate horizontally.
     * @param {number} dy The amount to translate vertically.
     * @returns {Rect} The new translated rectangle.
     */
    function translateRect(rect, dx, dy) {
        rect = rect || [];
        dx = dx || 0;
        dy = dy || 0;

        return [
            +rect[0] + +dx,
            +rect[1] + +dy,
            +rect[2] + +dx,
            +rect[3] + +dy
        ];
    }

    /**
     * Moves `rect` to the specified point. Returns the new rectangle.
     *
     * @memberof module:ai-scripting-utils
     * @category Rect Functions
     * @param {Rect} rect The rectangle to move.
     * @param {Point} toPoint The point to move to.
     * @param {Point} [fromPoint=[rect[0], rect[1]]] The point to move from.
     * Defaults to the top left corner of `rect`.
     * @returns {Rect} The new moved rectangle.
     */
    function moveRect(rect, toPoint, fromPoint) {
        rect = rect || [];
        fromPoint = fromPoint || [rect[0], rect[1]];
        toPoint = toPoint || fromPoint;

        var delta = subtractPoint(toPoint, fromPoint);

        return translateRect(rect, delta[0], delta[1]);
    }

    /**
     * Aligns one rectangle to another on a given side. Returns the new
     * rectangle.
     *
     * @memberof module:ai-scripting-utils
     * @category Rect Functions
     * @param {Rect} rect The rectangle to align.
     * @param {Rect} target The rectangle to align with.
     * @param {("left"|"top"|"right"|"bottom"|"centerX"|"centerY")} side The
     * side to align to.
     * @returns {Rect} The new aligned rectangle.
     */
    function alignRect(rect, target, side) {
        rect = rect || [];
        target = target || rect;

        var delta = getRectSide(target, side) - getRectSide(rect, side);
        var dx = 0;
        var dy = 0;

        if (side == "left" || side == "right" || side == "centerX") {
            dx = delta;
        } else if (side == "top" || side == "bottom" || side == "centerY") {
            dy = delta;
        }

        return translateRect(rect, dx, dy);
    }

    /**
     * Places one rectangle from the other with an offset. Returns the new
     * rectangle.
     *
     * @memberof module:ai-scripting-utils
     * @category Rect Functions
     * @param {Rect} rect The rectangle to place.
     * @param {Rect} target The rectangle to offset from.
     * @param {("left"|"top"|"right"|"bottom")} side The side of `target` to
     * offset from.
     * @param {number} [amount=0] The offset amount.
     * @returns {Rect} The new placed rectangle.
     */
    function offsetRectFrom(rect, target, side, amount) {
        rect = rect || [];
        target = target || [0, 0, 0, 0];
        amount = amount || 0;

        var dx = 0;
        var dy = 0;

        switch (side) {
            case "left":
                dx = target[0] - rect[2] - amount;
                break;
            case "top":
                dy = target[1] - rect[3] + amount;
                break;
            case "right":
                dx = target[2] - rect[0] + amount;
                break;
            case "bottom":
                dy = target[3] - rect[1] - amount;
                break;
        }

        return translateRect(rect, dx, dy);
    }

    /**
     * Adds one point to another.
     *
     * @memberof module:ai-scripting-utils
     * @category Point Functions
     * @param {Point} point1 The first point.
     * @param {Point} point2 The second point.
     * @returns {Point} The result of adding points.
     */
    function addPoint(point1, point2) {
        point1 = point1 || [];
        point2 = point2 || [0, 0];
        return [+point1[0] + +point2[0], +point1[1] + +point2[1]];
    }

    /**
     * Subtracts one point from another.
     *
     * @memberof module:ai-scripting-utils
     * @category Point Functions
     * @param {Point} point1 The first point.
     * @param {Point} point2 The second point.
     * @returns {Point} The result of subtracting points.
     */
    function subtractPoint(point1, point2) {
        point1 = point1 || [];
        point2 = point2 || [0, 0];
        return [point1[0] - point2[0], point1[1] - point2[1]];
    }

    /**
     * Returns the distance between two points.
     *
     * @memberof module:ai-scripting-utils
     * @category Point Functions
     * @param {Point} point1 The first point.
     * @param {Point} point2 The second point.
     * @returns {number} The distance between points.
     */
    function getDistance(point1, point2) {
        point1 = point1 || [];
        point2 = point2 || point1;
        return Math.sqrt(
            Math.pow(point2[0] - point1[0], 2)
            + Math.pow(point2[1] - point1[1], 2)
        );
    }

    /**
     * Returns the inclination angle of the line drawn through two points. The
     * angle is measured counterclockwise and is in the range 0.0-180.0.
     *
     * @memberof module:ai-scripting-utils
     * @category Point Functions
     * @param {Point} point1 The first point.
     * @param {Point} point2 The second point.
     * @returns {number} The inclination angle.
     */
    function getInclination(point1, point2) {
        point1 = point1 || [];
        point2 = point2 || point1;
        var leg1 = point2[1] - point1[1];
        var leg2 = point2[0] - point1[0];
        var angle = Math.atan(leg1 / leg2) * 180 / Math.PI;
        return angle >= 0 ? angle : angle + 180;
    }

    /**
     * Aligns `item` to `target` on a given side.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {PageItem} item The item to align.
     * @param {(PageItem|Rect)} target The target to align with.
     * @param {("left"|"top"|"right"|"bottom"|"centerX"|"centerY")} side The
     * side to align to.
     * @param {Object} [options]
     * @param {boolean} [options.considerStroke=false] Whether to consider
     * stroke of the items.
     */
    function align(item, target, side, options) {
        if (!isPageItem(item) || !item.editable || !target) return;

        options = options || {};
        var considerStroke = options.considerStroke;

        var boundsType = considerStroke ? "visibleBounds" : "geometricBounds";
        var itemRect = item[boundsType];
        var targetRect = target[boundsType] || target;
        var resultRect = alignRect(itemRect, targetRect, side);
        var dx = resultRect[0] - itemRect[0];
        var dy = resultRect[1] - itemRect[1];

        item.translate(dx, dy);
    }

    /**
     * Places `item` from `target` with an offset.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {PageItem} rect The item to place.
     * @param {(PageItem|Rect)} target The target to offset from.
     * @param {("left"|"top"|"right"|"bottom")} side The side of `target` to
     * offset from.
     * @param {Object} [options]
     * @param {boolean} [options.amount=0] The offset amount.
     * @param {boolean} [options.considerStroke=false] Whether to consider
     * stroke of the items.
     */
    function offsetFrom(item, target, side, options) {
        if (!isPageItem(item) || !item.editable || !target) return;

        options = options || {};
        var amount = options.amount;
        var considerStroke = options.considerStroke;

        var boundsType = considerStroke ? "visibleBounds" : "geometricBounds";
        var itemRect = item[boundsType];
        var targetRect = target[boundsType] || target;
        var resultRect = offsetRectFrom(itemRect, targetRect, side, amount);
        var dx = resultRect[0] - itemRect[0];
        var dy = resultRect[1] - itemRect[1];

        item.translate(dx, dy);
    }

    /**
     * Moves `item` to the specified point.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {PageItem} item The item to move.
     * @param {Point} toPoint The point to move to.
     * @param {Object} [options]
     * @param {Point} [options.fromPoint] The point to move from. Defaults to
     * the top left corner of `item`.
     * @param {boolean} [options.considerStroke=false] Whether to consider
     * stroke of the item.
     */
    function move(item, toPoint, options) {
        if (!isPageItem(item) || !item.editable || !toPoint) return;

        options = options || {};
        var considerStroke = options.considerStroke;

        var boundsType = considerStroke ? "visibleBounds" : "geometricBounds";
        var itemRect = item[boundsType];
        var fromPoint = options.fromPoint || [itemRect[0], itemRect[1]];
        var delta = subtractPoint(toPoint, fromPoint);

        item.translate(delta[0] || 0, delta[1] || 0);
    }

    /**
     * Rotates `item` by a given angle.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {PageItem} item The item to rotate.
     * @param {number} angle The rotation angle.
     * @param {Point} [pivotPoint] The point to rotate about. Defaults to the
     * center point of `item`.
     */
    function rotate(item, angle, pivotPoint) {
        if (!isPageItem(item) || !item.editable || isNaN(angle)) return;
        if (!pivotPoint) return item.rotate(angle);

        var rad = angle * Math.PI / 180;
        var itemCenter = getRectPoint(item.geometricBounds, "center");
        var pivotNorm = [pivotPoint[0] - itemCenter[0], pivotPoint[1] - itemCenter[1]];
        var pivotNormRotated = [
            pivotNorm[0] * Math.cos(rad) - pivotNorm[1] * Math.sin(rad),
            pivotNorm[0] * Math.sin(rad) + pivotNorm[1] * Math.cos(rad)
        ];
        var delta = subtractPoint(pivotNorm, pivotNormRotated);

        var rotationMatrix = app.getRotationMatrix(angle);
        var translationMatrix = app.getTranslationMatrix(delta[0], delta[1]);
        var transformationMatrix = app.concatenateMatrix(rotationMatrix, translationMatrix);

        item.transform(transformationMatrix);
    }

    /**
     * Traverses a tree of `PageItem` objects starting from a specific root.
     *
     * This function executes `callback` for each child of `root` that is a
     * `PageItem` object. If `root` itself is a `PageItem` object, then
     * `callback` is called for `root` before processing its children. The
     * callback takes one argument: `pageItem`. The callback may exit traversal
     * early by explicitly returning `false`.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {(Document|Layer|PageItem)} root The root of the tree to start
     * traversal from.
     * @param {Function} callback The function called for each `PageItem` object
     * in the tree.
     * @param {Object} [options]
     * @param {boolean} [options.skipHidden=false] Whether to skip hidden items
     * or layers.
     * @param {boolean} [options.skipLocked=false] Whether to skip locked items
     * or layers.
     */
    function eachPageItem(root, callback, options) {
        if (typeof callback != "function") return;
        options = options || {};

        var skipHidden = options.skipHidden;
        var skipLocked = options.skipLocked;

        (function diveIn(root) {
            if (isPageItem(root)) {
                if (skipHidden && root.hidden) return;
                if (skipLocked && root.locked) return;
                if (callback(root) === false) return false;
                if (isGroupItem(root)) diveIn(root.pageItems);
            } else if (isDOMCollection(root)) {
                for (var i = 0, j = root.length; i < j; i++) {
                    if (diveIn(root[i]) === false) return false;
                }
            } else if (isLayer(root)) {
                if (skipHidden && !root.visible) return;
                if (skipLocked && root.locked) return;
                if (diveIn(root.pageItems) === false) return;
                diveIn(root.layers);
            } else if (isDocument(root)) {
                diveIn(root.layers);
            }
        })(root);
    }

    /**
     * Returns `app.activeDocument`. This function gets rid of constant checking
     * if the app contains documents. If the app doesn't contain any documents
     * accessing `app.activeDocument` will result in an error.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @returns {?Document} The active document.
     */
    function getActiveDocument() {
        return app.documents.length > 0 ? app.activeDocument : null;
    }

    /**
     * Creates a group.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} [name] The name of the group.
     * @param {(Document|Layer|GroupItem)} [container=app.activeDocument] The
     * container where the group will be created.
     * @returns {?GroupItem} The new group.
     */
    function createGroup(name, container) {
        if (container == null) container = getActiveDocument();
        if (isDocument(container)) container = container.layers[0];
        if (!isEditable(container)) return;
        var group = container.groupItems.add();
        if (name != null) group.name = name;
        return group;
    }

    /**
     * Gets the layer by its name among the container's child layers.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} name The name of the layer to find.
     * @param {(Document|Layer)} [container=app.activeDocument] The container
     * whose children are being searched for.
     * @returns {?Layer} The found layer or `null` if the layer is not found.
     */
    function getLayer(name, container) {
        if (container == null) container = getActiveDocument();
        try {
            // If the layer doesn't exist, an exception will be thrown in this
            // block
            return container.layers.getByName(name);
        } catch (e) {
            return null;
        }
    }

    /**
     * Creates a layer.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} [name] The name of the layer.
     * @param {(Document|Layer)} [container=app.activeDocument] The container
     * where the layer will be created.
     * @returns {?Layer} The new layer.
     */
    function createLayer(name, container) {
        if (container == null) container = getActiveDocument();
        if (
            (!isDocument(container) && !isLayer(container))
            || (isLayer(container) && !isLayerEditable(container))
        ) {
            return;
        }
        var layer = container.layers.add();
        if (name != null) layer.name = name;
        return layer;
    }

    /**
     * Draws a rectangle.
     *
     * @function module:ai-scripting-utils.drawRect
     * @category DOM Functions
     * @param {number} width The width of the rectangle.
     * @param {number} height The height of the rectangle.
     * @param {Point} [fromPoint=[0, 0]] The top left point.
     * @param {(Document|Layer|GroupItem)} [container=app.activeDocument] The
     * container where the rectangle will be drawn.
     * @returns {?PathItem} The new rectangle.
     */
    /**
     * Draws a rectangle from the passed points. The points do not necessarily
     * need to be the top left and bottom right corners.
     *
     * @function module:ai-scripting-utils.drawRect
     * @category DOM Functions
     * @param {Point} fromPoint The point to draw from.
     * @param {Point} toPoint The point to draw to.
     * @param {(Document|Layer|GroupItem)} [container=app.activeDocument] The
     * container where the rectangle will be drawn.
     * @returns {?PathItem} The new rectangle.
     */
    /**
     * Draws a rectangle.
     *
     * @function module:ai-scripting-utils.drawRect
     * @category DOM Functions
     * @param {Rect} rect The `Rect` object that describes the bounds of the
     * rectangle being drawn.
     * @param {(Document|Layer|GroupItem)} [container=app.activeDocument] The
     * container where the rectangle will be drawn.
     * @returns {?PathItem} The new rectangle.
     */
    function drawRect() {
        var args = clone(arguments);
        var container = last(args);
        if (!isDocument(container) && !isLayer(container) && !isGroupItem(container)) {
            container = getActiveDocument();
        } else {
            args.pop();
        }
        if (isDocument(container)) container = container.layers[0];
        if (!isEditable(container)) return;
        var rect = createRect.apply(null, args);
        if (isNaN(rect[0]) || isNaN(rect[1]) || isNaN(rect[2]) || isNaN(rect[3])) return;
        return container.pathItems.rectangle(rect[1], rect[0], rect[2] - rect[0], rect[1] - rect[3]);
    }

    /**
     * Draws a line.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {Point} fromPoint The point to draw from.
     * @param {Point} toPoint The point to draw to.
     * @param {(Document|Layer|GroupItem)} [container=app.activeDocument] The
     * container where the line will be drawn.
     * @returns {?PathItem} The new line.
     */
    function drawLine(fromPoint, toPoint, container) {
        if (container == null) container = getActiveDocument();
        if (isDocument(container)) container = container.layers[0];
        if (
            !container
            || !isEditable(container)
            || !isArray(fromPoint)
            || !isArray(toPoint)
            || isNaN(fromPoint[0])
            || isNaN(fromPoint[1])
            || isNaN(toPoint[0])
            || isNaN(toPoint[1])
        ) {
            return;
        }
        var line = container.pathItems.add();
        // setEntirePath() only accepts arrays with two numeric values in it
        line.setEntirePath([[+fromPoint[0], +fromPoint[1]], [+toPoint[0], +toPoint[1]]]);
        return line;
    }

    /**
     * Draws an ellipse.
     *
     * @function module:ai-scripting-utils.drawEllipse
     * @category DOM Functions
     * @param {number} width The width of the ellipse.
     * @param {number} height The height of the ellipse.
     * @param {Point} [fromPoint=[0, 0]] The top left point.
     * @param {(Document|Layer|GroupItem)} [container=app.activeDocument] The
     * container where the ellipse will be drawn.
     * @returns {?PathItem} The new ellipse.
     */
    /**
     * Draws an ellipse from the passed points. The points do not necessarily
     * need to be the top left and bottom right corners.
     *
     * @function module:ai-scripting-utils.drawEllipse
     * @category DOM Functions
     * @param {Point} fromPoint The point to draw from.
     * @param {Point} toPoint The point to draw to.
     * @param {(Document|Layer|GroupItem)} [container=app.activeDocument] The
     * container where the ellipse will be drawn.
     * @returns {?PathItem} The new ellipse.
     */
    /**
     * Draws an ellipse.
     *
     * @function module:ai-scripting-utils.drawEllipse
     * @category DOM Functions
     * @param {Rect} rect The `Rect` object that describes the bounds of the
     * ellipse being drawn.
     * @param {(Document|Layer|GroupItem)} [container=app.activeDocument] The
     * container where the ellipse will be drawn.
     * @returns {?PathItem} The new ellipse.
     */
    function drawEllipse() {
        var args = clone(arguments);
        var container = last(args);
        if (!isDocument(container) && !isLayer(container) && !isGroupItem(container)) {
            container = getActiveDocument();
        } else {
            args.pop();
        }
        if (isDocument(container)) container = container.layers[0];
        if (!isEditable(container)) return;
        var rect = createRect.apply(null, args);
        if (isNaN(rect[0]) || isNaN(rect[1]) || isNaN(rect[2]) || isNaN(rect[3])) return;
        return container.pathItems.ellipse(rect[1], rect[0], rect[2] - rect[0], rect[1] - rect[3]);
    }

    /**
     * Draws a circle.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {number} radius The radius of the circle.
     * @param {Point} [center=[0, 0]] The center point.
     * @param {(Document|Layer|GroupItem)} [container=app.activeDocument] The
     * container where the circle will be drawn.
     * @returns {?PathItem} The new circle.
     */
    function drawCircle(radius, center, container) {
        if (container == null) container = getActiveDocument();
        if (isDocument(container)) container = container.layers[0];
        if (
            !container
            || !isEditable(container)
            || isNaN(radius)
        ) {
            return;
        }
        if (!isArray(center) || isNaN(center[0]) || isNaN(center[1])) center = [0, 0];
        var left = center[0] - radius;
        var top = +center[1] + +radius;
        var diameter = radius * 2;
        return container.pathItems.ellipse(top, left, diameter, diameter);
    }

    /**
     * Creates an RGB color. The input values are clamped to the range 0-255.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {number} [r=0] The red component of the color.
     * @param {number} [g=0] The green component of the color.
     * @param {number} [b=0] The blue component of the color.
     * @returns {RGBColor} The new color object.
     */
    function createRGBColor(r, g, b) {
        var colorComps = map([r, g, b], function (v) {
            if (isNaN(v) || v < 0) return 0;
            if (v > 255) return 255;
            return +v;
        });
        var color = new RGBColor();
        color.red = colorComps[0];
        color.green = colorComps[1];
        color.blue = colorComps[2];
        return color;
    }

    /**
     * Creates a CMYK color. The input values are clamped to the range
     * 0.0-100.0.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {number} [c=0] The cyan component of the color.
     * @param {number} [m=0] The magenta component of the color.
     * @param {number} [y=0] The yellow component of the color.
     * @param {number} [k=0] The black component of the color.
     * @returns {CMYKColor} The new color object.
     */
    function createCMYKColor(c, m, y, k) {
        var colorComps = map([c, m, y, k], function (v) {
            if (isNaN(v) || v < 0) return 0;
            if (v > 100) return 100;
            return +v;
        });
        var color = new CMYKColor();
        color.cyan = colorComps[0];
        color.magenta = colorComps[1];
        color.yellow = colorComps[2];
        color.black = colorComps[3];
        return color;
    }

    /**
     * Creates a spot color. The tint value is clamped to the range 0.0-100.0.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {Spot} spot The spot that defines the color.
     * @param {number} [tint=100] The tint of the color.
     * @returns {SpotColor} The new color object.
     */
    function createSpotColor(spot, tint) {
        if (!isSpot(spot)) return;
        if (isNaN(tint) || tint > 100) {
            tint = 100;
        } else if (tint < 0) {
            tint = 0;
        }
        var spotColor = new SpotColor();
        spotColor.spot = spot;
        spotColor.tint = +tint;
        return spotColor;
    }

    /**
     * Gets the spot by its name.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} name The name of the spot to find.
     * @param {Document} [doc=app.activeDocument] The document whose spots are
     * being searched for.
     * @returns {?Spot} The found spot or `null` if the spot is not found.
     */
    function getSpot(name, doc) {
        if (doc == null) doc = getActiveDocument();
        try {
            // If the spot doesn't exist, an exception will be thrown in this
            // block
            return doc.spots.getByName(name);
        } catch (e) {
            return null;
        }
    }

    /**
     * Creates a spot.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {Object} [options]
     * @param {*} [options.name] The name of the spot.
     * @param {Color} [options.color] The color of the spot.
     * @param {("spot"|"process")} [options.type="process"] The color model of
     * the spot.
     * @param {Document} [options.doc=app.activeDocument] The document where the
     * spot will be created.
     * @returns {?Spot} The new spot.
     */
    function createSpot(options) {
        options = options || {};
        var doc = options.doc == null ? getActiveDocument() : options.doc;
        if (!isDocument(doc)) return;
        var name = options.name;
        var color = options.color;
        var type = options.type == "spot" ? ColorModel.SPOT : ColorModel.PROCESS;

        var spot = getSpot(name, doc) || doc.spots.add();
        if (name != null) spot.name = name;
        if (isColor(color)) spot.color = color;
        spot.colorType = type;

        return spot;
    }

    /**
     * Checks if `value` is a native collection of DOM objects. These objects
     * are not arrays but they contain children that can be accessed by index
     * using bracket notation. Examples of classes that are DOM object
     * collections: `Documents`, `Layers`, `PageItems`, `Spots`, `Characters`,
     * etc.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a DOM object collection, `false`
     * otherwise.
     */
    function isDOMCollection(value) {
        return !!value && typeof value[".index"] == "function";
    }

    /**
     * Checks if `value` is a `Document` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `Document` object, `false`
     * otherwise.
     */
    function isDocument(value) {
        return !!value && value.typename == "Document";
    }

    /**
     * Checks if `value` is a `Layer` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `Layer` object, `false`
     * otherwise.
     */
    function isLayer(value) {
        return !!value && value.typename == "Layer";
    }

    /**
     * Checks if `layer` and all of its ancestors are editable. If the passed
     * layer is nor hidden or locked but one of its ancestors are, the return
     * value will be `false`.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {Layer} layer The layer to check.
     * @returns {boolean} `true` if `layer` and all of its ancestors are
     * editable, `false` otherwise.
     */
    function isLayerEditable(layer) {
        if (!isLayer(layer)) return false;
        do {
            if (!layer.visible || layer.locked) return false;
            layer = layer.parent;
        } while (!isDocument(layer));
        return true;
    }

    /**
     * Checks if `value` is an editable `Layer` or `PageItem` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {(Layer|PageItem)} value The value to check.
     * @returns {boolean} `true` if `value` is editable, `false` otherwise.
     */
    function isEditable(value) {
        if (isPageItem(value)) return value.editable;
        if (isLayer(value)) return isLayerEditable(value);
        return false;
    }

    /**
     * Checks if `value` is a `PathItem` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `PathItem` object, `false`
     * otherwise.
     */
    function isPathItem(value) {
        return !!value && value.typename == "PathItem";
    }

    /**
     * Checks if `value` is a `GroupItem` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `GroupItem` object, `false`
     * otherwise.
     */
    function isGroupItem(value) {
        return !!value && value.typename == "GroupItem";
    }

    /**
     * Checks if `value` is a `CompoundPathItem` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `CompoundPathItem` object,
     * `false` otherwise.
     */
    function isCompoundPathItem(value) {
        return !!value && value.typename == "CompoundPathItem";
    }

    /**
     * Checks if `value` is a `TextFrame` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `TextFrame` object, `false`
     * otherwise.
     */
    function isTextFrame(value) {
        return !!value && value.typename == "TextFrame";
    }

    /**
     * Checks if `value` is a `PlacedItem` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `PlacedItem` object, `false`
     * otherwise.
     */
    function isPlacedItem(value) {
        return !!value && value.typename == "PlacedItem";
    }

    /**
     * Checks if `value` is a `RasterItem` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `RasterItem` object, `false`
     * otherwise.
     */
    function isRasterItem(value) {
        return !!value && value.typename == "RasterItem";
    }

    /**
     * Checks if `value` is a `GraphItem` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `GraphItem` object, `false`
     * otherwise.
     */
    function isGraphItem(value) {
        return !!value && value.typename == "GraphItem";
    }

    /**
     * Checks if `value` is a `MeshItem` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `MeshItem` object, `false`
     * otherwise.
     */
    function isMeshItem(value) {
        return !!value && value.typename == "MeshItem";
    }

    /**
     * Checks if `value` is a `PluginItem` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `PluginItem` object, `false`
     * otherwise.
     */
    function isPluginItem(value) {
        return !!value && value.typename == "PluginItem";
    }

    /**
     * Checks if `value` is a `LegacyTextItem` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `LegacyTextItem` object,
     * `false` otherwise.
     */
    function isLegacyTextItem(value) {
        return !!value && value.typename == "LegacyTextItem";
    }

    /**
     * Checks if `value` is a `NonNativeItem` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `NonNativeItem` object, `false`
     * otherwise.
     */
    function isNonNativeItem(value) {
        return !!value && value.typename == "NonNativeItem";
    }

    /**
     * Checks if `value` is a `PageItem` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `PageItem` object, `false`
     * otherwise.
     */
    function isPageItem(value) {
        return isPathItem(value)
            || isGroupItem(value)
            || isCompoundPathItem(value)
            || isTextFrame(value)
            || isPlacedItem(value)
            || isRasterItem(value)
            || isGraphItem(value)
            || isMeshItem(value)
            || isPluginItem(value)
            || isLegacyTextItem(value)
            || isNonNativeItem(value);
    }

    /**
     * Checks if `value` is a `CMYKColor` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `CMYKColor` object, `false`
     * otherwise.
     */
    function isCMYKColor(value) {
        return !!value && value.typename == "CMYKColor";
    }

    /**
     * Checks if `value` is a `RGBColor` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `RGBColor` object, `false`
     * otherwise.
     */
    function isRGBColor(value) {
        return !!value && value.typename == "RGBColor";
    }

    /**
     * Checks if `value` is a `SpotColor` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `SpotColor` object, `false`
     * otherwise.
     */
    function isSpotColor(value) {
        return !!value && value.typename == "SpotColor";
    }

    /**
     * Checks if `value` is a `GrayColor` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `GrayColor` object, `false`
     * otherwise.
     */
    function isGrayColor(value) {
        return !!value && value.typename == "GrayColor";
    }

    /**
     * Checks if `value` is a `GradientColor` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `GradientColor` object, `false`
     * otherwise.
     */
    function isGradientColor(value) {
        return !!value && value.typename == "GradientColor";
    }

    /**
     * Checks if `value` is a `PatternColor` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `PatternColor` object, `false`
     * otherwise.
     */
    function isPatternColor(value) {
        return !!value && value.typename == "PatternColor";
    }

    /**
     * Checks if `value` is a `LabColor` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `LabColor` object, `false`
     * otherwise.
     */
    function isLabColor(value) {
        return !!value && value.typename == "LabColor";
    }

    /**
     * Checks if `value` is a `NoColor` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `NoColor` object, `false`
     * otherwise.
     */
    function isNoColor(value) {
        return !!value && value.typename == "NoColor";
    }

    /**
     * Checks if `value` is a `Color` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `Color` object, `false`
     * otherwise.
     */
    function isColor(value) {
        return isCMYKColor(value)
            || isRGBColor(value)
            || isSpotColor(value)
            || isGrayColor(value)
            || isGradientColor(value)
            || isPatternColor(value)
            || isLabColor(value)
            || isNoColor(value);
    }

    /**
     * Checks if `value` is a `Spot` object.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a `Spot` object, `false`
     * otherwise.
     */
    function isSpot(value) {
        return !!value && value.typename == "Spot";
    }

    /**
     * Checks if `value` is a registration spot.
     *
     * @memberof module:ai-scripting-utils
     * @category DOM Functions
     * @param {*} value The value to check.
     * @returns {boolean} `true` if `value` is a registration spot, `false`
     * otherwise.
     */
    function isRegistrationSpot(value) {
        return isSpot(value)
            && value.colorType == ColorModel.REGISTRATION;
    }

    var exports = {};

    // Array and Array-Like Functions
    exports.isArray = isArray;
    exports.isArrayLike = isArrayLike;
    exports.each = each;
    exports.filter = filter;
    exports.map = map;
    exports.reduce = reduce;
    exports.reduceRight = reduceRight;
    exports.every = every;
    exports.some = some;
    exports.find = find;
    exports.findIndex = findIndex;
    exports.indexOf = indexOf;
    exports.lastIndexOf = lastIndexOf;
    exports.includes = includes;
    exports.clone = clone;
    exports.fill = fill;
    exports.shuffle = shuffle;
    exports.last = last;

    // Object Functions
    exports.assign = assign;
    exports.defaults = defaults;
    exports.keys = keys;
    exports.values = values;
    exports.entries = entries;

    // String Functions
    exports.repeat = repeat;
    exports.trim = trim;
    exports.trimStart = trimStart;
    exports.trimEnd = trimEnd;
    exports.startsWith = startsWith;
    exports.endsWith = endsWith;
    exports.pad = pad;
    exports.padStart = padStart;
    exports.padEnd = padEnd;

    // Utility Functions
    exports.log = log;
    exports.inRange = inRange;
    exports.random = random;

    // Rect Functions
    exports.createRect = createRect;
    exports.getRectSide = getRectSide;
    exports.getRectPoint = getRectPoint;
    exports.getRectWidth = getRectWidth;
    exports.getRectHeight = getRectHeight;
    exports.getRectArea = getRectArea;
    exports.isRectsIntersect = isRectsIntersect;
    exports.intersectRects = intersectRects;
    exports.includeRects = includeRects;
    exports.offsetRect = offsetRect;
    exports.expandRect = expandRect;
    exports.translateRect = translateRect;
    exports.moveRect = moveRect;
    exports.alignRect = alignRect;
    exports.offsetRectFrom = offsetRectFrom;

    // Point Functions
    exports.addPoint = addPoint;
    exports.subtractPoint = subtractPoint;
    exports.getDistance = getDistance;
    exports.getInclination = getInclination;

    // DOM Functions
    exports.align = align;
    exports.offsetFrom = offsetFrom;
    exports.move = move;
    exports.rotate = rotate;
    exports.eachPageItem = eachPageItem;
    exports.getActiveDocument = getActiveDocument;
    exports.createGroup = createGroup;
    exports.getLayer = getLayer;
    exports.createLayer = createLayer;
    exports.drawRect = drawRect;
    exports.drawLine = drawLine;
    exports.drawEllipse = drawEllipse;
    exports.drawCircle = drawCircle;
    exports.createRGBColor = createRGBColor;
    exports.createCMYKColor = createCMYKColor;
    exports.createSpotColor = createSpotColor;
    exports.getSpot = getSpot;
    exports.createSpot = createSpot;
    exports.isDOMCollection = isDOMCollection;
    exports.isDocument = isDocument;
    exports.isLayer = isLayer;
    exports.isLayerEditable = isLayerEditable;
    exports.isEditable = isEditable;
    exports.isPathItem = isPathItem;
    exports.isGroupItem = isGroupItem;
    exports.isCompoundPathItem = isCompoundPathItem;
    exports.isTextFrame = isTextFrame;
    exports.isPlacedItem = isPlacedItem;
    exports.isRasterItem = isRasterItem;
    exports.isGraphItem = isGraphItem;
    exports.isMeshItem = isMeshItem;
    exports.isPluginItem = isPluginItem;
    exports.isLegacyTextItem = isLegacyTextItem;
    exports.isNonNativeItem = isNonNativeItem;
    exports.isPageItem = isPageItem;
    exports.isCMYKColor = isCMYKColor;
    exports.isRGBColor = isRGBColor;
    exports.isSpotColor = isSpotColor;
    exports.isGrayColor = isGrayColor;
    exports.isGradientColor = isGradientColor;
    exports.isPatternColor = isPatternColor;
    exports.isLabColor = isLabColor;
    exports.isNoColor = isNoColor;
    exports.isColor = isColor;
    exports.isSpot = isSpot;
    exports.isRegistrationSpot = isRegistrationSpot;

    $.global.importAIScriptingUtils = function () {
        return exports;
    };

    return exports;
})();
