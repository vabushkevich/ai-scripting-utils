# ai-scripting-utils

A JavaScript utility library for those who write scripts to automate tasks in Adobe Illustrator.

The library provides many different helper functions intended to speed up the process of writing scripts. The functions are useful for working with this kind of objects:

- Native JavaScript objects and primitives
- DOM objects
- [`Rect`](#Rect) objects that are just arrays representing rectangles (e.g. `pathItem.geometricBounds`)
- [`Point`](#Point) objects

## Usage

First download the `ai-scripting-utils.jsx` file from this repository: [ai-scripting-utils.jsx](https://raw.githubusercontent.com/vabushkevich/ai-scripting-utils/master/ai-scripting-utils.jsx). Then you should use one of the following methods to start using the library.

### $.evalFile()

Use the `$.evalFile(path)` function to import the library. `path` - is the absolute file path to the `ai-scripting-utils.jsx` file.

```javascript
var _ = $.evalFile("/home/you/ai-scripting-utils.jsx");
var rectangle = _.drawRect(20, 10);
```

To specify the path relative to the current script location you should construct the path this way:

```javascript
var _ = $.evalFile($.fileName + "/../ai-scripting-utils.jsx");
```

### #include

Use the `#include "path"` statement to import the library. `path` - is the file path that can be absolute or relative to the current script file.

Using this method you should also call `importAIScriptingUtils()` global function to load the library.

```javascript
#include "./ai-scripting-utils.jsx"
var _ = importAIScriptingUtils();
var rectangle = _.drawRect(20, 10);
```

### Inline

You can also just copy the `ai-scripting-utils.jsx` file contents and paste it in the beginning of your script.

```javascript
// *** `ai-scripting-utils.jsx` contents goes here ***
var _ = importAIScriptingUtils();
var rectangle = _.drawRect(20, 10);
```

## Usage Examples

### Remove Small Items

This script removes items that have width or height smaller than 1 pt:

```javascript
var _ = $.evalFile($.fileName + "/../ai-scripting-utils.jsx");

var doc = _.getActiveDocument();
var minSize = 1;
var smallItems = [];

_.eachPageItem(doc, function (item) {
  if (item.width < minSize || item.height < minSize) smallItems.push(item);
}, { skipHidden: true, skipLocked: true });

_.each(smallItems, function (item) {
  item.remove();
});
```

Result:

![01](https://user-images.githubusercontent.com/23465488/137976368-2fbc50b5-79fa-4758-b54b-de60679466c9.png)

### Draw Crop Marks

This script draws crop marks around all visible and non-locked page items:

```javascript
var _ = $.evalFile($.fileName + "/../ai-scripting-utils.jsx");

var doc = _.getActiveDocument();
var layer = _.createLayer("Crop Marks");
var margin = 10;
var itemsRect;
var trimRect;

// Build an area around the doc's page items
_.eachPageItem(doc, function (item) {
  var itemRect = item.visibleBounds;
  itemsRect = _.includeRects(itemRect, itemsRect || itemRect);
}, { skipHidden: true, skipLocked: true });

// Set up drawing options
doc.defaultFilled = false;
doc.defaultStrokeColor = _.createRegistrationColor();
// Add margins around the items area
trimRect = _.offsetRect(itemsRect, margin);

// Define locations where to place crop marks around the trim area.
// Basically, these are the corners of the trim area.
var sidePairs = [
  ["left", "top"], ["left", "bottom"],
  ["right", "bottom"], ["right", "top"]
];

// For each crop marks location...
_.each(sidePairs, function (sidePair, i) {
  // Draw crop marks inside a group
  var group = _.createGroup("Crop Marks", layer);
  _.drawLine([-5, 0], [-20, 0], group);
  _.drawLine([0, 5], [0, 20], group);
  group.rotate(90 * i);
  // Place the crop marks in the specified location
  _.offsetFrom(group, trimRect, sidePair[0]);
  _.offsetFrom(group, trimRect, sidePair[1]);
});
```

Result:

![02](https://user-images.githubusercontent.com/23465488/137976437-46a814cf-a1ac-4822-9cd7-83cf38f903db.png)

## API Reference


* [ai-scripting-utils](#module_ai-scripting-utils)
    * _Array and Array-Like Functions_
        * [.clone(array)](#module_ai-scripting-utils.clone) ⇒ <code>Array</code>
        * [.each(array, callback, [fromIndex])](#module_ai-scripting-utils.each)
        * [.every(array, callback)](#module_ai-scripting-utils.every) ⇒ <code>boolean</code>
        * [.fill(array, value)](#module_ai-scripting-utils.fill) ⇒ <code>Array</code>
        * [.filter(array, callback)](#module_ai-scripting-utils.filter) ⇒ <code>Array</code>
        * [.find(array, callback, [fromIndex])](#module_ai-scripting-utils.find) ⇒ <code>\*</code>
        * [.findIndex(array, callback, [fromIndex])](#module_ai-scripting-utils.findIndex) ⇒ <code>number</code>
        * [.includes(collection, value, [fromIndex])](#module_ai-scripting-utils.includes) ⇒ <code>boolean</code>
        * [.indexOf(array, value, [fromIndex])](#module_ai-scripting-utils.indexOf) ⇒ <code>number</code>
        * [.isArray(value)](#module_ai-scripting-utils.isArray) ⇒ <code>boolean</code>
        * [.isArrayLike(value)](#module_ai-scripting-utils.isArrayLike) ⇒ <code>boolean</code>
        * [.last(array)](#module_ai-scripting-utils.last) ⇒ <code>\*</code>
        * [.lastIndexOf(array, value, [fromIndex])](#module_ai-scripting-utils.lastIndexOf) ⇒ <code>number</code>
        * [.map(array, callback)](#module_ai-scripting-utils.map) ⇒ <code>Array</code>
        * [.reduce(array, callback, accumulator)](#module_ai-scripting-utils.reduce) ⇒ <code>\*</code>
        * [.reduceRight(array, callback, accumulator)](#module_ai-scripting-utils.reduceRight) ⇒ <code>\*</code>
        * [.shuffle(array)](#module_ai-scripting-utils.shuffle) ⇒ <code>Array</code>
        * [.some(array, callback)](#module_ai-scripting-utils.some) ⇒ <code>boolean</code>
    * _DOM Functions_
        * [.align(item, target, side, [options])](#module_ai-scripting-utils.align)
        * [.createCMYKColor([c], [m], [y], [k])](#module_ai-scripting-utils.createCMYKColor) ⇒ <code>CMYKColor</code>
        * [.createGroup([name], [container])](#module_ai-scripting-utils.createGroup) ⇒ <code>GroupItem</code>
        * [.createLayer([name], [container])](#module_ai-scripting-utils.createLayer) ⇒ <code>Layer</code>
        * [.createRegistrationColor([tint], [doc])](#module_ai-scripting-utils.createRegistrationColor) ⇒ <code>SpotColor</code>
        * [.createRGBColor([r], [g], [b])](#module_ai-scripting-utils.createRGBColor) ⇒ <code>RGBColor</code>
        * [.createSpot([options])](#module_ai-scripting-utils.createSpot) ⇒ <code>Spot</code>
        * [.createSpotColor(spot, [tint])](#module_ai-scripting-utils.createSpotColor) ⇒ <code>SpotColor</code>
        * [.drawCircle(radius, [center], [container])](#module_ai-scripting-utils.drawCircle) ⇒ <code>PathItem</code>
        * [.drawEllipse(width, height, [fromPoint], [container])](#module_ai-scripting-utils.drawEllipse) ⇒ <code>PathItem</code>
        * [.drawEllipse(fromPoint, toPoint, [container])](#module_ai-scripting-utils.drawEllipse) ⇒ <code>PathItem</code>
        * [.drawEllipse(rect, [container])](#module_ai-scripting-utils.drawEllipse) ⇒ <code>PathItem</code>
        * [.drawLine(fromPoint, toPoint, [container])](#module_ai-scripting-utils.drawLine) ⇒ <code>PathItem</code>
        * [.drawRect(width, height, [fromPoint], [container])](#module_ai-scripting-utils.drawRect) ⇒ <code>PathItem</code>
        * [.drawRect(fromPoint, toPoint, [container])](#module_ai-scripting-utils.drawRect) ⇒ <code>PathItem</code>
        * [.drawRect(rect, [container])](#module_ai-scripting-utils.drawRect) ⇒ <code>PathItem</code>
        * [.eachPageItem(root, callback, [options])](#module_ai-scripting-utils.eachPageItem)
        * [.getActiveDocument()](#module_ai-scripting-utils.getActiveDocument) ⇒ <code>Document</code>
        * [.getLayer(name, [container])](#module_ai-scripting-utils.getLayer) ⇒ <code>Layer</code>
        * [.getSpot(name, [doc])](#module_ai-scripting-utils.getSpot) ⇒ <code>Spot</code>
        * [.isCMYKColor(value)](#module_ai-scripting-utils.isCMYKColor) ⇒ <code>boolean</code>
        * [.isColor(value)](#module_ai-scripting-utils.isColor) ⇒ <code>boolean</code>
        * [.isCompoundPathItem(value)](#module_ai-scripting-utils.isCompoundPathItem) ⇒ <code>boolean</code>
        * [.isDocument(value)](#module_ai-scripting-utils.isDocument) ⇒ <code>boolean</code>
        * [.isDOMCollection(value)](#module_ai-scripting-utils.isDOMCollection) ⇒ <code>boolean</code>
        * [.isEditable(value)](#module_ai-scripting-utils.isEditable) ⇒ <code>boolean</code>
        * [.isGradientColor(value)](#module_ai-scripting-utils.isGradientColor) ⇒ <code>boolean</code>
        * [.isGraphItem(value)](#module_ai-scripting-utils.isGraphItem) ⇒ <code>boolean</code>
        * [.isGrayColor(value)](#module_ai-scripting-utils.isGrayColor) ⇒ <code>boolean</code>
        * [.isGroupItem(value)](#module_ai-scripting-utils.isGroupItem) ⇒ <code>boolean</code>
        * [.isLabColor(value)](#module_ai-scripting-utils.isLabColor) ⇒ <code>boolean</code>
        * [.isLayer(value)](#module_ai-scripting-utils.isLayer) ⇒ <code>boolean</code>
        * [.isLayerEditable(layer)](#module_ai-scripting-utils.isLayerEditable) ⇒ <code>boolean</code>
        * [.isLegacyTextItem(value)](#module_ai-scripting-utils.isLegacyTextItem) ⇒ <code>boolean</code>
        * [.isMeshItem(value)](#module_ai-scripting-utils.isMeshItem) ⇒ <code>boolean</code>
        * [.isNoColor(value)](#module_ai-scripting-utils.isNoColor) ⇒ <code>boolean</code>
        * [.isNonNativeItem(value)](#module_ai-scripting-utils.isNonNativeItem) ⇒ <code>boolean</code>
        * [.isPageItem(value)](#module_ai-scripting-utils.isPageItem) ⇒ <code>boolean</code>
        * [.isPathItem(value)](#module_ai-scripting-utils.isPathItem) ⇒ <code>boolean</code>
        * [.isPatternColor(value)](#module_ai-scripting-utils.isPatternColor) ⇒ <code>boolean</code>
        * [.isPlacedItem(value)](#module_ai-scripting-utils.isPlacedItem) ⇒ <code>boolean</code>
        * [.isPluginItem(value)](#module_ai-scripting-utils.isPluginItem) ⇒ <code>boolean</code>
        * [.isRasterItem(value)](#module_ai-scripting-utils.isRasterItem) ⇒ <code>boolean</code>
        * [.isRegistrationColor(value)](#module_ai-scripting-utils.isRegistrationColor) ⇒ <code>boolean</code>
        * [.isRegistrationSpot(value)](#module_ai-scripting-utils.isRegistrationSpot) ⇒ <code>boolean</code>
        * [.isRGBColor(value)](#module_ai-scripting-utils.isRGBColor) ⇒ <code>boolean</code>
        * [.isSpot(value)](#module_ai-scripting-utils.isSpot) ⇒ <code>boolean</code>
        * [.isSpotColor(value)](#module_ai-scripting-utils.isSpotColor) ⇒ <code>boolean</code>
        * [.isTextFrame(value)](#module_ai-scripting-utils.isTextFrame) ⇒ <code>boolean</code>
        * [.move(item, toPoint, [options])](#module_ai-scripting-utils.move)
        * [.offsetFrom(item, target, side, [options])](#module_ai-scripting-utils.offsetFrom)
        * [.rotate(item, angle, [pivotPoint])](#module_ai-scripting-utils.rotate)
    * _Object Functions_
        * [.assign(object, [...sources])](#module_ai-scripting-utils.assign) ⇒ <code>Object</code>
        * [.defaults(object, [...sources])](#module_ai-scripting-utils.defaults) ⇒ <code>Object</code>
        * [.entries(object)](#module_ai-scripting-utils.entries) ⇒ <code>Array</code>
        * [.keys(object)](#module_ai-scripting-utils.keys) ⇒ <code>Array</code>
        * [.values(object)](#module_ai-scripting-utils.values) ⇒ <code>Array</code>
    * _Point Functions_
        * [.addPoint(point1, point2)](#module_ai-scripting-utils.addPoint) ⇒ [<code>Point</code>](#Point)
        * [.getDistance(point1, point2)](#module_ai-scripting-utils.getDistance) ⇒ <code>number</code>
        * [.getInclination(point1, point2)](#module_ai-scripting-utils.getInclination) ⇒ <code>number</code>
        * [.subtractPoint(point1, point2)](#module_ai-scripting-utils.subtractPoint) ⇒ [<code>Point</code>](#Point)
    * _Rect Functions_
        * [.alignRect(rect, target, side)](#module_ai-scripting-utils.alignRect) ⇒ [<code>Rect</code>](#Rect)
        * [.createRect(width, height, [fromPoint])](#module_ai-scripting-utils.createRect) ⇒ [<code>Rect</code>](#Rect)
        * [.createRect(left, top, right, bottom)](#module_ai-scripting-utils.createRect) ⇒ [<code>Rect</code>](#Rect)
        * [.createRect(fromPoint, toPoint)](#module_ai-scripting-utils.createRect) ⇒ [<code>Rect</code>](#Rect)
        * [.createRect(rect)](#module_ai-scripting-utils.createRect) ⇒ [<code>Rect</code>](#Rect)
        * [.expandRect(rect, amount)](#module_ai-scripting-utils.expandRect) ⇒ [<code>Rect</code>](#Rect)
        * [.expandRect(rect, hor, ver)](#module_ai-scripting-utils.expandRect) ⇒ [<code>Rect</code>](#Rect)
        * [.getRectArea(rect)](#module_ai-scripting-utils.getRectArea) ⇒ <code>number</code>
        * [.getRectHeight(rect)](#module_ai-scripting-utils.getRectHeight) ⇒ <code>number</code>
        * [.getRectPoint(rect, location)](#module_ai-scripting-utils.getRectPoint) ⇒ [<code>Point</code>](#Point)
        * [.getRectSide(rect, side)](#module_ai-scripting-utils.getRectSide) ⇒ <code>number</code>
        * [.getRectWidth(rect)](#module_ai-scripting-utils.getRectWidth) ⇒ <code>number</code>
        * [.includeRects(rect1, rect2)](#module_ai-scripting-utils.includeRects) ⇒ [<code>Rect</code>](#Rect)
        * [.intersectRects(rect1, rect2)](#module_ai-scripting-utils.intersectRects) ⇒ [<code>Rect</code>](#Rect)
        * [.isRectsIntersect(rect1, rect2)](#module_ai-scripting-utils.isRectsIntersect) ⇒ <code>boolean</code>
        * [.moveRect(rect, toPoint, [fromPoint])](#module_ai-scripting-utils.moveRect) ⇒ [<code>Rect</code>](#Rect)
        * [.offsetRect(rect, [amount])](#module_ai-scripting-utils.offsetRect) ⇒ [<code>Rect</code>](#Rect)
        * [.offsetRect(rect, [object])](#module_ai-scripting-utils.offsetRect) ⇒ [<code>Rect</code>](#Rect)
        * [.offsetRectFrom(rect, target, side, [amount])](#module_ai-scripting-utils.offsetRectFrom) ⇒ [<code>Rect</code>](#Rect)
        * [.translateRect(rect, dx, dy)](#module_ai-scripting-utils.translateRect) ⇒ [<code>Rect</code>](#Rect)
    * _String Functions_
        * [.endsWith(string, target)](#module_ai-scripting-utils.endsWith) ⇒ <code>boolean</code>
        * [.pad(string, [length], [chars])](#module_ai-scripting-utils.pad) ⇒ <code>string</code>
        * [.padEnd(string, [length], [chars])](#module_ai-scripting-utils.padEnd) ⇒ <code>string</code>
        * [.padStart(string, [length], [chars])](#module_ai-scripting-utils.padStart) ⇒ <code>string</code>
        * [.repeat(string, [count])](#module_ai-scripting-utils.repeat) ⇒ <code>string</code>
        * [.startsWith(string, target)](#module_ai-scripting-utils.startsWith) ⇒ <code>boolean</code>
        * [.trim(string, [chars])](#module_ai-scripting-utils.trim) ⇒ <code>string</code>
        * [.trimEnd(string, [chars])](#module_ai-scripting-utils.trimEnd) ⇒ <code>string</code>
        * [.trimStart(string, [chars])](#module_ai-scripting-utils.trimStart) ⇒ <code>string</code>
    * _Utility Functions_
        * [.inRange(number)](#module_ai-scripting-utils.inRange) ⇒ <code>boolean</code>
        * [.inRange(number, upper)](#module_ai-scripting-utils.inRange) ⇒ <code>boolean</code>
        * [.inRange(number, lower, upper)](#module_ai-scripting-utils.inRange) ⇒ <code>boolean</code>
        * [.log(message)](#module_ai-scripting-utils.log)
        * [.random([floating])](#module_ai-scripting-utils.random) ⇒ <code>number</code>
        * [.random(upper, [floating])](#module_ai-scripting-utils.random) ⇒ <code>number</code>
        * [.random(lower, upper, [floating])](#module_ai-scripting-utils.random) ⇒ <code>number</code>

<a name="module_ai-scripting-utils.clone"></a>

### _.clone(array) ⇒ <code>Array</code>
Creates a shallow clone of `array`.

**Returns**: <code>Array</code> - The cloned array.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | The array to clone. |

<a name="module_ai-scripting-utils.each"></a>

### _.each(array, callback, [fromIndex])
Executes `callback` for each element of `array`. The callback takes threearguments: `value`, `index`, `array`. The callback may exit iterationearly by explicitly returning `false`.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array</code> |  | The array to iterate over. |
| callback | <code>function</code> |  | The function called for each element. |
| [fromIndex] | <code>number</code> | <code>0</code> | The index to iterate from. |

<a name="module_ai-scripting-utils.every"></a>

### _.every(array, callback) ⇒ <code>boolean</code>
Checks if `callback` returns a truly value for all elements of `array`.The callback takes three arguments: `value`, `index`, `array`.

**Returns**: <code>boolean</code> - `true` if all elements pass the check, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | The array to iterate over. |
| callback | <code>function</code> | The function called for each element. |

<a name="module_ai-scripting-utils.fill"></a>

### _.fill(array, value) ⇒ <code>Array</code>
Fills `array` with `value`. This function mutates `array`.

**Returns**: <code>Array</code> - `array`.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | The array to fill. |
| value | <code>\*</code> | The filling value. |

<a name="module_ai-scripting-utils.filter"></a>

### _.filter(array, callback) ⇒ <code>Array</code>
Creates a new array of those elements for which `callback` returned atruthy value. The callback takes three arguments: `value`, `index`,`array`.

**Returns**: <code>Array</code> - The new filtered array.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | The array to iterate over. |
| callback | <code>function</code> | The function called for each element. |

<a name="module_ai-scripting-utils.find"></a>

### _.find(array, callback, [fromIndex]) ⇒ <code>\*</code>
Returns the first value in `array` for which `callback` returned a trulyvalue. The callback takes three arguments: `value`, `index`, `array`.

**Returns**: <code>\*</code> - The matched element, `undefined` otherwise.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array</code> |  | The array to inspect. |
| callback | <code>function</code> |  | The function called for each element. |
| [fromIndex] | <code>number</code> | <code>0</code> | The index to search from. |

<a name="module_ai-scripting-utils.findIndex"></a>

### _.findIndex(array, callback, [fromIndex]) ⇒ <code>number</code>
Returns the index of the first value in `array` for which `callback`returned a truly value. The callback takes three arguments: `value`,`index`, `array`.

**Returns**: <code>number</code> - The index of the found element, -1 otherwise.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array</code> |  | The array to inspect. |
| callback | <code>function</code> |  | The function called for each element. |
| [fromIndex] | <code>number</code> | <code>0</code> | The index to search from. |

<a name="module_ai-scripting-utils.includes"></a>

### _.includes(collection, value, [fromIndex]) ⇒ <code>boolean</code>
Checks if `collection` includes `value`.

**Returns**: <code>boolean</code> - `true` if `value` is found, `false` otherwise.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| collection | <code>Array</code> \| <code>Object</code> \| <code>string</code> |  | The collection to inspect. |
| value | <code>\*</code> |  | The value to search for. |
| [fromIndex] | <code>number</code> | <code>0</code> | The index to search from. |

<a name="module_ai-scripting-utils.indexOf"></a>

### _.indexOf(array, value, [fromIndex]) ⇒ <code>number</code>
Returns the index of the first occurance of `value` in `array`.

**Returns**: <code>number</code> - The index of the found element, -1 otherwise.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array</code> |  | The array to inspect. |
| value | <code>\*</code> |  | The value to search for. |
| [fromIndex] | <code>number</code> | <code>0</code> | The index to search from. |

<a name="module_ai-scripting-utils.isArray"></a>

### _.isArray(value) ⇒ <code>boolean</code>
Checks if `value` is an `Array` object.

**Returns**: <code>boolean</code> - `true` if `value` is an array, `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isArrayLike"></a>

### _.isArrayLike(value) ⇒ <code>boolean</code>
Checks if `value` is array-like.

**Returns**: <code>boolean</code> - `true` if `value` is array-like, `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.last"></a>

### _.last(array) ⇒ <code>\*</code>
Retrieves the last element of `array`.

**Returns**: <code>\*</code> - The last element of `array`.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | The array to query. |

<a name="module_ai-scripting-utils.lastIndexOf"></a>

### _.lastIndexOf(array, value, [fromIndex]) ⇒ <code>number</code>
This function is like `indexOf` except that it iterates over elements of`array` from right to left.

**Returns**: <code>number</code> - The index of the found element, -1 otherwise.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array | <code>Array</code> |  | The array to inspect. |
| value | <code>\*</code> |  | The value to search for. |
| [fromIndex] | <code>number</code> | <code>array.length-1</code> | The index to search from. |

<a name="module_ai-scripting-utils.map"></a>

### _.map(array, callback) ⇒ <code>Array</code>
Creates a new array populated with the results of `callback` invocationfor each element of `array`. The callback takes three arguments: `value`,`index`, `array`.

**Returns**: <code>Array</code> - The new mapped array.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | The array to iterate over. |
| callback | <code>function</code> | The function called for each element. |

<a name="module_ai-scripting-utils.reduce"></a>

### _.reduce(array, callback, accumulator) ⇒ <code>\*</code>
Executes `reducer` for each element of `array`, resulting in a singleoutput value. The callback takes four arguments: `accumulator`, `value`,`index`, `array`.

**Returns**: <code>\*</code> - The accumulated value.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | The array to iterate over. |
| callback | <code>function</code> | The function called for each element. |
| accumulator | <code>\*</code> | The initial value. |

<a name="module_ai-scripting-utils.reduceRight"></a>

### _.reduceRight(array, callback, accumulator) ⇒ <code>\*</code>
This function is like `reduce` except that it iterates over elements of`array` from right to left.

**Returns**: <code>\*</code> - The accumulated value.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | The array to iterate over. |
| callback | <code>function</code> | The function called for each element. |
| accumulator | <code>\*</code> | The initial value. |

<a name="module_ai-scripting-utils.shuffle"></a>

### _.shuffle(array) ⇒ <code>Array</code>
Creates an array of shuffled values, using the Fisher-Yates shufflealgorithm.

**Returns**: <code>Array</code> - The new shuffled array.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | The array to shuffle. |

<a name="module_ai-scripting-utils.some"></a>

### _.some(array, callback) ⇒ <code>boolean</code>
Checks if `callback` returns a truly value for at least one element of`array`. The callback takes three arguments: `value`, `index`, `array`.

**Returns**: <code>boolean</code> - `true` if at least one element pass the check, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | The array to iterate over. |
| callback | <code>function</code> | The function called for each element. |

<a name="module_ai-scripting-utils.align"></a>

### _.align(item, target, side, [options])
Aligns `item` to `target` on a given side.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>PageItem</code> |  | The item to align. |
| target | <code>PageItem</code> \| [<code>Rect</code>](#Rect) |  | The target to align with. |
| side | <code>&quot;left&quot;</code> \| <code>&quot;top&quot;</code> \| <code>&quot;right&quot;</code> \| <code>&quot;bottom&quot;</code> \| <code>&quot;centerX&quot;</code> \| <code>&quot;centerY&quot;</code> |  | The side to align to. |
| [options] | <code>Object</code> |  |  |
| [options.considerStroke] | <code>boolean</code> | <code>false</code> | Whether to consider stroke of the items. |

<a name="module_ai-scripting-utils.createCMYKColor"></a>

### _.createCMYKColor([c], [m], [y], [k]) ⇒ <code>CMYKColor</code>
Creates a CMYK color. The input values are clamped to the range0.0-100.0.

**Returns**: <code>CMYKColor</code> - The new color object.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [c] | <code>number</code> | <code>0</code> | The cyan component of the color. |
| [m] | <code>number</code> | <code>0</code> | The magenta component of the color. |
| [y] | <code>number</code> | <code>0</code> | The yellow component of the color. |
| [k] | <code>number</code> | <code>0</code> | The black component of the color. |

<a name="module_ai-scripting-utils.createGroup"></a>

### _.createGroup([name], [container]) ⇒ <code>GroupItem</code>
Creates a group.

**Returns**: <code>GroupItem</code> - The new group.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [name] | <code>\*</code> |  | The name of the group. |
| [container] | <code>Document</code> \| <code>Layer</code> \| <code>GroupItem</code> | <code>app.activeDocument</code> | The container where the group will be created. |

<a name="module_ai-scripting-utils.createLayer"></a>

### _.createLayer([name], [container]) ⇒ <code>Layer</code>
Creates a layer.

**Returns**: <code>Layer</code> - The new layer.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [name] | <code>\*</code> |  | The name of the layer. |
| [container] | <code>Document</code> \| <code>Layer</code> | <code>app.activeDocument</code> | The container where the layer will be created. |

<a name="module_ai-scripting-utils.createRegistrationColor"></a>

### _.createRegistrationColor([tint], [doc]) ⇒ <code>SpotColor</code>
Creates a registration color.

**Returns**: <code>SpotColor</code> - The new color object.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [tint] | <code>number</code> | <code>100</code> | The tint of the color. |
| [doc] | <code>Document</code> | <code>app.activeDocument</code> | The document whose spots are being searched for the registration spot. |

<a name="module_ai-scripting-utils.createRGBColor"></a>

### _.createRGBColor([r], [g], [b]) ⇒ <code>RGBColor</code>
Creates an RGB color. The input values are clamped to the range 0-255.

**Returns**: <code>RGBColor</code> - The new color object.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [r] | <code>number</code> | <code>0</code> | The red component of the color. |
| [g] | <code>number</code> | <code>0</code> | The green component of the color. |
| [b] | <code>number</code> | <code>0</code> | The blue component of the color. |

<a name="module_ai-scripting-utils.createSpot"></a>

### _.createSpot([options]) ⇒ <code>Spot</code>
Creates a spot.

**Returns**: <code>Spot</code> - The new spot.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.name] | <code>\*</code> |  | The name of the spot. |
| [options.color] | <code>Color</code> |  | The color of the spot. |
| [options.type] | <code>&quot;spot&quot;</code> \| <code>&quot;process&quot;</code> | <code>&quot;process&quot;</code> | The color model of the spot. |
| [options.doc] | <code>Document</code> | <code>app.activeDocument</code> | The document where the spot will be created. |

<a name="module_ai-scripting-utils.createSpotColor"></a>

### _.createSpotColor(spot, [tint]) ⇒ <code>SpotColor</code>
Creates a spot color. The tint value is clamped to the range 0.0-100.0.

**Returns**: <code>SpotColor</code> - The new color object.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| spot | <code>Spot</code> |  | The spot that defines the color. |
| [tint] | <code>number</code> | <code>100</code> | The tint of the color. |

<a name="module_ai-scripting-utils.drawCircle"></a>

### _.drawCircle(radius, [center], [container]) ⇒ <code>PathItem</code>
Draws a circle.

**Returns**: <code>PathItem</code> - The new circle.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| radius | <code>number</code> |  | The radius of the circle. |
| [center] | [<code>Point</code>](#Point) | <code>[0, 0]</code> | The center point. |
| [container] | <code>Document</code> \| <code>Layer</code> \| <code>GroupItem</code> | <code>app.activeDocument</code> | The container where the circle will be drawn. |

<a name="module_ai-scripting-utils.drawEllipse"></a>

### _.drawEllipse(width, height, [fromPoint], [container]) ⇒ <code>PathItem</code>
Draws an ellipse.

**Returns**: <code>PathItem</code> - The new ellipse.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| width | <code>number</code> |  | The width of the ellipse. |
| height | <code>number</code> |  | The height of the ellipse. |
| [fromPoint] | [<code>Point</code>](#Point) | <code>[0, 0]</code> | The top left point. |
| [container] | <code>Document</code> \| <code>Layer</code> \| <code>GroupItem</code> | <code>app.activeDocument</code> | The container where the ellipse will be drawn. |

<a name="module_ai-scripting-utils.drawEllipse"></a>

### _.drawEllipse(fromPoint, toPoint, [container]) ⇒ <code>PathItem</code>
Draws an ellipse from the passed points. The points do not necessarilyneed to be the top left and bottom right corners.

**Returns**: <code>PathItem</code> - The new ellipse.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fromPoint | [<code>Point</code>](#Point) |  | The point to draw from. |
| toPoint | [<code>Point</code>](#Point) |  | The point to draw to. |
| [container] | <code>Document</code> \| <code>Layer</code> \| <code>GroupItem</code> | <code>app.activeDocument</code> | The container where the ellipse will be drawn. |

<a name="module_ai-scripting-utils.drawEllipse"></a>

### _.drawEllipse(rect, [container]) ⇒ <code>PathItem</code>
Draws an ellipse.

**Returns**: <code>PathItem</code> - The new ellipse.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| rect | [<code>Rect</code>](#Rect) |  | The `Rect` object that describes the bounds of the ellipse being drawn. |
| [container] | <code>Document</code> \| <code>Layer</code> \| <code>GroupItem</code> | <code>app.activeDocument</code> | The container where the ellipse will be drawn. |

<a name="module_ai-scripting-utils.drawLine"></a>

### _.drawLine(fromPoint, toPoint, [container]) ⇒ <code>PathItem</code>
Draws a line.

**Returns**: <code>PathItem</code> - The new line.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fromPoint | [<code>Point</code>](#Point) |  | The point to draw from. |
| toPoint | [<code>Point</code>](#Point) |  | The point to draw to. |
| [container] | <code>Document</code> \| <code>Layer</code> \| <code>GroupItem</code> | <code>app.activeDocument</code> | The container where the line will be drawn. |

<a name="module_ai-scripting-utils.drawRect"></a>

### _.drawRect(width, height, [fromPoint], [container]) ⇒ <code>PathItem</code>
Draws a rectangle.

**Returns**: <code>PathItem</code> - The new rectangle.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| width | <code>number</code> |  | The width of the rectangle. |
| height | <code>number</code> |  | The height of the rectangle. |
| [fromPoint] | [<code>Point</code>](#Point) | <code>[0, 0]</code> | The top left point. |
| [container] | <code>Document</code> \| <code>Layer</code> \| <code>GroupItem</code> | <code>app.activeDocument</code> | The container where the rectangle will be drawn. |

<a name="module_ai-scripting-utils.drawRect"></a>

### _.drawRect(fromPoint, toPoint, [container]) ⇒ <code>PathItem</code>
Draws a rectangle from the passed points. The points do not necessarilyneed to be the top left and bottom right corners.

**Returns**: <code>PathItem</code> - The new rectangle.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fromPoint | [<code>Point</code>](#Point) |  | The point to draw from. |
| toPoint | [<code>Point</code>](#Point) |  | The point to draw to. |
| [container] | <code>Document</code> \| <code>Layer</code> \| <code>GroupItem</code> | <code>app.activeDocument</code> | The container where the rectangle will be drawn. |

<a name="module_ai-scripting-utils.drawRect"></a>

### _.drawRect(rect, [container]) ⇒ <code>PathItem</code>
Draws a rectangle.

**Returns**: <code>PathItem</code> - The new rectangle.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| rect | [<code>Rect</code>](#Rect) |  | The `Rect` object that describes the bounds of the rectangle being drawn. |
| [container] | <code>Document</code> \| <code>Layer</code> \| <code>GroupItem</code> | <code>app.activeDocument</code> | The container where the rectangle will be drawn. |

<a name="module_ai-scripting-utils.eachPageItem"></a>

### _.eachPageItem(root, callback, [options])
Traverses a tree of `PageItem` objects starting from a specific root.This function executes `callback` for each child of `root` that is a`PageItem` object. If `root` itself is a `PageItem` object, then`callback` is called for `root` before processing its children. Thecallback takes one argument: `pageItem`. The callback may exit traversalearly by explicitly returning `false`.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| root | <code>Document</code> \| <code>Layer</code> \| <code>PageItem</code> |  | The root of the tree to start traversal from. |
| callback | <code>function</code> |  | The function called for each `PageItem` object in the tree. |
| [options] | <code>Object</code> |  |  |
| [options.skipHidden] | <code>boolean</code> | <code>false</code> | Whether to skip hidden items or layers. |
| [options.skipLocked] | <code>boolean</code> | <code>false</code> | Whether to skip locked items or layers. |

<a name="module_ai-scripting-utils.getActiveDocument"></a>

### _.getActiveDocument() ⇒ <code>Document</code>
Returns `app.activeDocument`. This function gets rid of constant checkingif the app contains documents. If the app doesn't contain any documentsaccessing `app.activeDocument` will result in an error.

**Returns**: <code>Document</code> - The active document.  
<a name="module_ai-scripting-utils.getLayer"></a>

### _.getLayer(name, [container]) ⇒ <code>Layer</code>
Gets the layer by its name among the container's child layers.

**Returns**: <code>Layer</code> - The found layer or `null` if the layer is not found.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>\*</code> |  | The name of the layer to find. |
| [container] | <code>Document</code> \| <code>Layer</code> | <code>app.activeDocument</code> | The container whose children are being searched for. |

<a name="module_ai-scripting-utils.getSpot"></a>

### _.getSpot(name, [doc]) ⇒ <code>Spot</code>
Gets the spot by its name.

**Returns**: <code>Spot</code> - The found spot or `null` if the spot is not found.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>\*</code> |  | The name of the spot to find. |
| [doc] | <code>Document</code> | <code>app.activeDocument</code> | The document whose spots are being searched for. |

<a name="module_ai-scripting-utils.isCMYKColor"></a>

### _.isCMYKColor(value) ⇒ <code>boolean</code>
Checks if `value` is a `CMYKColor` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `CMYKColor` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isColor"></a>

### _.isColor(value) ⇒ <code>boolean</code>
Checks if `value` is a `Color` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `Color` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isCompoundPathItem"></a>

### _.isCompoundPathItem(value) ⇒ <code>boolean</code>
Checks if `value` is a `CompoundPathItem` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `CompoundPathItem` object,`false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isDocument"></a>

### _.isDocument(value) ⇒ <code>boolean</code>
Checks if `value` is a `Document` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `Document` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isDOMCollection"></a>

### _.isDOMCollection(value) ⇒ <code>boolean</code>
Checks if `value` is a native collection of DOM objects. These objectsare not arrays but they contain children that can be accessed by indexusing bracket notation. Examples of classes that are DOM objectcollections: `Documents`, `Layers`, `PageItems`, `Spots`, `Characters`,etc.

**Returns**: <code>boolean</code> - `true` if `value` is a DOM object collection, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isEditable"></a>

### _.isEditable(value) ⇒ <code>boolean</code>
Checks if `value` is an editable `Layer` or `PageItem` object.

**Returns**: <code>boolean</code> - `true` if `value` is editable, `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Layer</code> \| <code>PageItem</code> | The value to check. |

<a name="module_ai-scripting-utils.isGradientColor"></a>

### _.isGradientColor(value) ⇒ <code>boolean</code>
Checks if `value` is a `GradientColor` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `GradientColor` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isGraphItem"></a>

### _.isGraphItem(value) ⇒ <code>boolean</code>
Checks if `value` is a `GraphItem` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `GraphItem` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isGrayColor"></a>

### _.isGrayColor(value) ⇒ <code>boolean</code>
Checks if `value` is a `GrayColor` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `GrayColor` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isGroupItem"></a>

### _.isGroupItem(value) ⇒ <code>boolean</code>
Checks if `value` is a `GroupItem` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `GroupItem` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isLabColor"></a>

### _.isLabColor(value) ⇒ <code>boolean</code>
Checks if `value` is a `LabColor` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `LabColor` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isLayer"></a>

### _.isLayer(value) ⇒ <code>boolean</code>
Checks if `value` is a `Layer` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `Layer` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isLayerEditable"></a>

### _.isLayerEditable(layer) ⇒ <code>boolean</code>
Checks if `layer` and all of its ancestors are editable. If the passedlayer is nor hidden or locked but one of its ancestors are, the returnvalue will be `false`.

**Returns**: <code>boolean</code> - `true` if `layer` and all of its ancestors areeditable, `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Layer</code> | The layer to check. |

<a name="module_ai-scripting-utils.isLegacyTextItem"></a>

### _.isLegacyTextItem(value) ⇒ <code>boolean</code>
Checks if `value` is a `LegacyTextItem` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `LegacyTextItem` object,`false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isMeshItem"></a>

### _.isMeshItem(value) ⇒ <code>boolean</code>
Checks if `value` is a `MeshItem` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `MeshItem` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isNoColor"></a>

### _.isNoColor(value) ⇒ <code>boolean</code>
Checks if `value` is a `NoColor` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `NoColor` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isNonNativeItem"></a>

### _.isNonNativeItem(value) ⇒ <code>boolean</code>
Checks if `value` is a `NonNativeItem` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `NonNativeItem` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isPageItem"></a>

### _.isPageItem(value) ⇒ <code>boolean</code>
Checks if `value` is a `PageItem` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `PageItem` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isPathItem"></a>

### _.isPathItem(value) ⇒ <code>boolean</code>
Checks if `value` is a `PathItem` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `PathItem` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isPatternColor"></a>

### _.isPatternColor(value) ⇒ <code>boolean</code>
Checks if `value` is a `PatternColor` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `PatternColor` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isPlacedItem"></a>

### _.isPlacedItem(value) ⇒ <code>boolean</code>
Checks if `value` is a `PlacedItem` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `PlacedItem` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isPluginItem"></a>

### _.isPluginItem(value) ⇒ <code>boolean</code>
Checks if `value` is a `PluginItem` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `PluginItem` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isRasterItem"></a>

### _.isRasterItem(value) ⇒ <code>boolean</code>
Checks if `value` is a `RasterItem` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `RasterItem` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isRegistrationColor"></a>

### _.isRegistrationColor(value) ⇒ <code>boolean</code>
Checks if `value` is a registration color.

**Returns**: <code>boolean</code> - `true` if `value` is a registration color, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isRegistrationSpot"></a>

### _.isRegistrationSpot(value) ⇒ <code>boolean</code>
Checks if `value` is a registration spot.

**Returns**: <code>boolean</code> - `true` if `value` is a registration spot, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isRGBColor"></a>

### _.isRGBColor(value) ⇒ <code>boolean</code>
Checks if `value` is a `RGBColor` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `RGBColor` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isSpot"></a>

### _.isSpot(value) ⇒ <code>boolean</code>
Checks if `value` is a `Spot` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `Spot` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isSpotColor"></a>

### _.isSpotColor(value) ⇒ <code>boolean</code>
Checks if `value` is a `SpotColor` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `SpotColor` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.isTextFrame"></a>

### _.isTextFrame(value) ⇒ <code>boolean</code>
Checks if `value` is a `TextFrame` object.

**Returns**: <code>boolean</code> - `true` if `value` is a `TextFrame` object, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

<a name="module_ai-scripting-utils.move"></a>

### _.move(item, toPoint, [options])
Moves `item` to the specified point.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>PageItem</code> |  | The item to move. |
| toPoint | [<code>Point</code>](#Point) |  | The point to move to. |
| [options] | <code>Object</code> |  |  |
| [options.fromPoint] | [<code>Point</code>](#Point) |  | The point to move from. Defaults to the top left corner of `item`. |
| [options.considerStroke] | <code>boolean</code> | <code>false</code> | Whether to consider stroke of the item. |

<a name="module_ai-scripting-utils.offsetFrom"></a>

### _.offsetFrom(item, target, side, [options])
Places `item` from `target` with an offset.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>PageItem</code> |  | The item to place. |
| target | <code>PageItem</code> \| [<code>Rect</code>](#Rect) |  | The target to offset from. |
| side | <code>&quot;left&quot;</code> \| <code>&quot;top&quot;</code> \| <code>&quot;right&quot;</code> \| <code>&quot;bottom&quot;</code> |  | The side of `target` to offset from. |
| [options] | <code>Object</code> |  |  |
| [options.amount] | <code>boolean</code> | <code>0</code> | The offset amount. |
| [options.considerStroke] | <code>boolean</code> | <code>false</code> | Whether to consider stroke of the items. |

<a name="module_ai-scripting-utils.rotate"></a>

### _.rotate(item, angle, [pivotPoint])
Rotates `item` by a given angle.


| Param | Type | Description |
| --- | --- | --- |
| item | <code>PageItem</code> | The item to rotate. |
| angle | <code>number</code> | The rotation angle. |
| [pivotPoint] | [<code>Point</code>](#Point) | The point to rotate about. Defaults to the center point of `item`. |

<a name="module_ai-scripting-utils.assign"></a>

### _.assign(object, [...sources]) ⇒ <code>Object</code>
Assigns own enumerable properties of source objects to the destinationobject. Source objects are applied from left to right. Subsequent sourcesoverwrite property assignments of previous sources. This function mutates`object`.

**Returns**: <code>Object</code> - `object`.  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | The destination object. |
| [...sources] | <code>Object</code> | The source objects. |

<a name="module_ai-scripting-utils.defaults"></a>

### _.defaults(object, [...sources]) ⇒ <code>Object</code>
Assigns own enumerable properties of source objects to the destinationobject for all destination properties that resolve to `undefined`. Sourceobjects are applied from left to right. Once a property is set,additional values of the same property are ignored. This function mutates`object`.

**Returns**: <code>Object</code> - `object`.  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | The destination object. |
| [...sources] | <code>Object</code> | The source objects. |

<a name="module_ai-scripting-utils.entries"></a>

### _.entries(object) ⇒ <code>Array</code>
Returns an array of own enumerable property key-value pairs for `object`.

**Returns**: <code>Array</code> - The array of key-value pairs.  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | The object to query. |

<a name="module_ai-scripting-utils.keys"></a>

### _.keys(object) ⇒ <code>Array</code>
Returns an array of own enumerable property keys for `object`.

**Returns**: <code>Array</code> - The array of property keys.  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | The object to query. |

<a name="module_ai-scripting-utils.values"></a>

### _.values(object) ⇒ <code>Array</code>
Returns an array of own enumerable property values for `object`.

**Returns**: <code>Array</code> - The array of property values.  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | The object to query. |

<a name="module_ai-scripting-utils.addPoint"></a>

### _.addPoint(point1, point2) ⇒ [<code>Point</code>](#Point)
Adds one point to another.

**Returns**: [<code>Point</code>](#Point) - The result of adding points.  

| Param | Type | Description |
| --- | --- | --- |
| point1 | [<code>Point</code>](#Point) | The first point. |
| point2 | [<code>Point</code>](#Point) | The second point. |

<a name="module_ai-scripting-utils.getDistance"></a>

### _.getDistance(point1, point2) ⇒ <code>number</code>
Returns the distance between two points.

**Returns**: <code>number</code> - The distance between points.  

| Param | Type | Description |
| --- | --- | --- |
| point1 | [<code>Point</code>](#Point) | The first point. |
| point2 | [<code>Point</code>](#Point) | The second point. |

<a name="module_ai-scripting-utils.getInclination"></a>

### _.getInclination(point1, point2) ⇒ <code>number</code>
Returns the inclination angle of the line drawn through two points. Theangle is measured counterclockwise and is in the range 0.0-180.0.

**Returns**: <code>number</code> - The inclination angle.  

| Param | Type | Description |
| --- | --- | --- |
| point1 | [<code>Point</code>](#Point) | The first point. |
| point2 | [<code>Point</code>](#Point) | The second point. |

<a name="module_ai-scripting-utils.subtractPoint"></a>

### _.subtractPoint(point1, point2) ⇒ [<code>Point</code>](#Point)
Subtracts one point from another.

**Returns**: [<code>Point</code>](#Point) - The result of subtracting points.  

| Param | Type | Description |
| --- | --- | --- |
| point1 | [<code>Point</code>](#Point) | The first point. |
| point2 | [<code>Point</code>](#Point) | The second point. |

<a name="module_ai-scripting-utils.alignRect"></a>

### _.alignRect(rect, target, side) ⇒ [<code>Rect</code>](#Rect)
Aligns one rectangle to another on a given side. Returns the newrectangle.

**Returns**: [<code>Rect</code>](#Rect) - The new aligned rectangle.  

| Param | Type | Description |
| --- | --- | --- |
| rect | [<code>Rect</code>](#Rect) | The rectangle to align. |
| target | [<code>Rect</code>](#Rect) | The rectangle to align with. |
| side | <code>&quot;left&quot;</code> \| <code>&quot;top&quot;</code> \| <code>&quot;right&quot;</code> \| <code>&quot;bottom&quot;</code> \| <code>&quot;centerX&quot;</code> \| <code>&quot;centerY&quot;</code> | The side to align to. |

<a name="module_ai-scripting-utils.createRect"></a>

### _.createRect(width, height, [fromPoint]) ⇒ [<code>Rect</code>](#Rect)
Creates a rectangle.

**Returns**: [<code>Rect</code>](#Rect) - The new rectangle.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| width | <code>number</code> |  | The width of the rectangle. |
| height | <code>number</code> |  | The height of the rectangle. |
| [fromPoint] | [<code>Point</code>](#Point) | <code>[0, 0]</code> | The top left point of the rectangle. |

<a name="module_ai-scripting-utils.createRect"></a>

### _.createRect(left, top, right, bottom) ⇒ [<code>Rect</code>](#Rect)
Creates a rectangle.

**Returns**: [<code>Rect</code>](#Rect) - The new rectangle.  

| Param | Type | Description |
| --- | --- | --- |
| left | <code>number</code> | The left border of the rectangle. |
| top | <code>number</code> | The top border of the rectangle. |
| right | <code>number</code> | The right border of the rectangle. |
| bottom | <code>number</code> | The bottom border of the rectangle. |

<a name="module_ai-scripting-utils.createRect"></a>

### _.createRect(fromPoint, toPoint) ⇒ [<code>Rect</code>](#Rect)
Creates a rectangle from the passed points. The points do not necessarilyneed to be the top left and bottom right corners.

**Returns**: [<code>Rect</code>](#Rect) - The new rectangle.  

| Param | Type | Description |
| --- | --- | --- |
| fromPoint | [<code>Point</code>](#Point) | The first point. |
| toPoint | [<code>Point</code>](#Point) | The second point. |

<a name="module_ai-scripting-utils.createRect"></a>

### _.createRect(rect) ⇒ [<code>Rect</code>](#Rect)
Creates a new rectangle from the passed rectangle.

**Returns**: [<code>Rect</code>](#Rect) - The new rectangle.  

| Param | Type | Description |
| --- | --- | --- |
| rect | [<code>Rect</code>](#Rect) | The rectangle to copy. |

<a name="module_ai-scripting-utils.expandRect"></a>

### _.expandRect(rect, amount) ⇒ [<code>Rect</code>](#Rect)
Expands `rect` by the given amount. Returns the new rectangle.

**Returns**: [<code>Rect</code>](#Rect) - The new expanded rectangle.  

| Param | Type | Description |
| --- | --- | --- |
| rect | [<code>Rect</code>](#Rect) | The rectangle to expand. |
| amount | <code>number</code> | The amount to expand by. |

<a name="module_ai-scripting-utils.expandRect"></a>

### _.expandRect(rect, hor, ver) ⇒ [<code>Rect</code>](#Rect)
Expands `rect` by the given horizontal and vertical amounts. Returns thenew rectangle.

**Returns**: [<code>Rect</code>](#Rect) - The new expanded rectangle.  

| Param | Type | Description |
| --- | --- | --- |
| rect | [<code>Rect</code>](#Rect) | The rectangle to expand. |
| hor | <code>number</code> | The amount to expand horizontally. |
| ver | <code>number</code> | The amount to expand vertically. |

<a name="module_ai-scripting-utils.getRectArea"></a>

### _.getRectArea(rect) ⇒ <code>number</code>
Returns the area of the rectangle.

**Returns**: <code>number</code> - The area of `rect`.  

| Param | Type | Description |
| --- | --- | --- |
| rect | [<code>Rect</code>](#Rect) | The rectangle to query. |

<a name="module_ai-scripting-utils.getRectHeight"></a>

### _.getRectHeight(rect) ⇒ <code>number</code>
Returns the height of the rectangle.

**Returns**: <code>number</code> - The height of `rect`.  

| Param | Type | Description |
| --- | --- | --- |
| rect | [<code>Rect</code>](#Rect) | The rectangle to query. |

<a name="module_ai-scripting-utils.getRectPoint"></a>

### _.getRectPoint(rect, location) ⇒ [<code>Point</code>](#Point)
Returns the point of `rect` from the specified location.

**Returns**: [<code>Point</code>](#Point) - The point of `rect`.  

| Param | Type | Description |
| --- | --- | --- |
| rect | [<code>Rect</code>](#Rect) | The rectangle to query. |
| location | <code>&quot;topLeft&quot;</code> \| <code>&quot;topRight&quot;</code> \| <code>&quot;bottomLeft&quot;</code> \| <code>&quot;bottomRight&quot;</code> \| <code>&quot;center&quot;</code> | The location of the point. |

<a name="module_ai-scripting-utils.getRectSide"></a>

### _.getRectSide(rect, side) ⇒ <code>number</code>
Returns the position of the desired side of `rect`.

**Returns**: <code>number</code> - The position of the side of `rect`.  

| Param | Type | Description |
| --- | --- | --- |
| rect | [<code>Rect</code>](#Rect) | The rectangle to query. |
| side | <code>&quot;left&quot;</code> \| <code>&quot;top&quot;</code> \| <code>&quot;right&quot;</code> \| <code>&quot;bottom&quot;</code> \| <code>&quot;centerX&quot;</code> \| <code>&quot;centerY&quot;</code> | The desired side. |

<a name="module_ai-scripting-utils.getRectWidth"></a>

### _.getRectWidth(rect) ⇒ <code>number</code>
Returns the width of the rectangle.

**Returns**: <code>number</code> - The width of `rect`.  

| Param | Type | Description |
| --- | --- | --- |
| rect | [<code>Rect</code>](#Rect) | The rectangle to query. |

<a name="module_ai-scripting-utils.includeRects"></a>

### _.includeRects(rect1, rect2) ⇒ [<code>Rect</code>](#Rect)
Returns the smallest rectangle containing `rect1` and `rect2`.

**Returns**: [<code>Rect</code>](#Rect) - The containing rectangle.  

| Param | Type | Description |
| --- | --- | --- |
| rect1 | [<code>Rect</code>](#Rect) | The first rectangle. |
| rect2 | [<code>Rect</code>](#Rect) | The second rectangle. |

<a name="module_ai-scripting-utils.intersectRects"></a>

### _.intersectRects(rect1, rect2) ⇒ [<code>Rect</code>](#Rect)
Returns the result of the intersection of two rectangles.

**Returns**: [<code>Rect</code>](#Rect) - The intersection rectangle or `null` if the rectanglesdon't intersect.  

| Param | Type | Description |
| --- | --- | --- |
| rect1 | [<code>Rect</code>](#Rect) | The first rectangle. |
| rect2 | [<code>Rect</code>](#Rect) | The second rectangle. |

<a name="module_ai-scripting-utils.isRectsIntersect"></a>

### _.isRectsIntersect(rect1, rect2) ⇒ <code>boolean</code>
Checks if two rectangles intersect.

**Returns**: <code>boolean</code> - `true` if the rectangles intersect, `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| rect1 | [<code>Rect</code>](#Rect) | The first rectangle. |
| rect2 | [<code>Rect</code>](#Rect) | The second rectangle. |

<a name="module_ai-scripting-utils.moveRect"></a>

### _.moveRect(rect, toPoint, [fromPoint]) ⇒ [<code>Rect</code>](#Rect)
Moves `rect` to the specified point. Returns the new rectangle.

**Returns**: [<code>Rect</code>](#Rect) - The new moved rectangle.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| rect | [<code>Rect</code>](#Rect) |  | The rectangle to move. |
| toPoint | [<code>Point</code>](#Point) |  | The point to move to. |
| [fromPoint] | [<code>Point</code>](#Point) | <code>[rect[0], rect[1]]</code> | The point to move from. Defaults to the top left corner of `rect`. |

<a name="module_ai-scripting-utils.offsetRect"></a>

### _.offsetRect(rect, [amount]) ⇒ [<code>Rect</code>](#Rect)
Offsets `rect` by the given amount. Returns the new rectangle.

**Returns**: [<code>Rect</code>](#Rect) - The new offsetted rectangle.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| rect | [<code>Rect</code>](#Rect) |  | The rectangle to offset. |
| [amount] | <code>number</code> | <code>0</code> | The amount to offset by. |

<a name="module_ai-scripting-utils.offsetRect"></a>

### _.offsetRect(rect, [object]) ⇒ [<code>Rect</code>](#Rect)
Offsets `rect` by the given amounts. Returns the new rectangle.

**Returns**: [<code>Rect</code>](#Rect) - The new offsetted rectangle.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| rect | [<code>Rect</code>](#Rect) |  | The rectangle to offset. |
| [object] | <code>Object</code> |  |  |
| [object.left] | <code>number</code> | <code>0</code> | The amount to offset from the left. |
| [object.top] | <code>number</code> | <code>0</code> | The amount to offset from the top. |
| [object.right] | <code>number</code> | <code>0</code> | The amount to offset from the right. |
| [object.bottom] | <code>number</code> | <code>0</code> | The amount to offset from the bottom. |

<a name="module_ai-scripting-utils.offsetRectFrom"></a>

### _.offsetRectFrom(rect, target, side, [amount]) ⇒ [<code>Rect</code>](#Rect)
Places one rectangle from the other with an offset. Returns the newrectangle.

**Returns**: [<code>Rect</code>](#Rect) - The new placed rectangle.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| rect | [<code>Rect</code>](#Rect) |  | The rectangle to place. |
| target | [<code>Rect</code>](#Rect) |  | The rectangle to offset from. |
| side | <code>&quot;left&quot;</code> \| <code>&quot;top&quot;</code> \| <code>&quot;right&quot;</code> \| <code>&quot;bottom&quot;</code> |  | The side of `target` to offset from. |
| [amount] | <code>number</code> | <code>0</code> | The offset amount. |

<a name="module_ai-scripting-utils.translateRect"></a>

### _.translateRect(rect, dx, dy) ⇒ [<code>Rect</code>](#Rect)
Translates `rect` by the given horizontal and vertical amount. Returnsthe new rectangle.

**Returns**: [<code>Rect</code>](#Rect) - The new translated rectangle.  

| Param | Type | Description |
| --- | --- | --- |
| rect | [<code>Rect</code>](#Rect) | The rectangle to translate. |
| dx | <code>number</code> | The amount to translate horizontally. |
| dy | <code>number</code> | The amount to translate vertically. |

<a name="module_ai-scripting-utils.endsWith"></a>

### _.endsWith(string, target) ⇒ <code>boolean</code>
Checks if `string` ends with `target` string.

**Returns**: <code>boolean</code> - `true` if `string` ends with `target`, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> | The string to inspect. |
| target | <code>string</code> | The string to search for. |

<a name="module_ai-scripting-utils.pad"></a>

### _.pad(string, [length], [chars]) ⇒ <code>string</code>
Evenly pads the beginning and end of `string` with `chars` until theresulting string reaches `length`.

**Returns**: <code>string</code> - The padded string.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| string | <code>string</code> |  | The string to pad. |
| [length] | <code>number</code> | <code>0</code> | The padding length. |
| [chars] | <code>string</code> | <code>&quot;​ ​&quot;</code> | The padding string. |

<a name="module_ai-scripting-utils.padEnd"></a>

### _.padEnd(string, [length], [chars]) ⇒ <code>string</code>
Pads the end of `string` with `chars` until the resulting string reaches`length`.

**Returns**: <code>string</code> - The padded string.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| string | <code>string</code> |  | The string to pad. |
| [length] | <code>number</code> | <code>0</code> | The padding length. |
| [chars] | <code>string</code> | <code>&quot;​ ​&quot;</code> | The padding string. |

<a name="module_ai-scripting-utils.padStart"></a>

### _.padStart(string, [length], [chars]) ⇒ <code>string</code>
Pads the beginning of `string` with `chars` until the resulting stringreaches `length`.

**Returns**: <code>string</code> - The padded string.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| string | <code>string</code> |  | The string to pad. |
| [length] | <code>number</code> | <code>0</code> | The padding length. |
| [chars] | <code>string</code> | <code>&quot;​ ​&quot;</code> | The padding string. |

<a name="module_ai-scripting-utils.repeat"></a>

### _.repeat(string, [count]) ⇒ <code>string</code>
Returns `string` repeated `count` times.

**Returns**: <code>string</code> - The repeated `string`.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| string | <code>string</code> |  | The string to repeat. |
| [count] | <code>number</code> | <code>1</code> | The number of repetitions. |

<a name="module_ai-scripting-utils.startsWith"></a>

### _.startsWith(string, target) ⇒ <code>boolean</code>
Checks if `string` starts with `target` string.

**Returns**: <code>boolean</code> - `true` if `string` starts with `target`, `false`otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> | The string to inspect. |
| target | <code>string</code> | The string to search for. |

<a name="module_ai-scripting-utils.trim"></a>

### _.trim(string, [chars]) ⇒ <code>string</code>
Removes specified characters from both ends of `string`.

**Returns**: <code>string</code> - The trimmed `string`.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| string | <code>string</code> |  | The string to trim. |
| [chars] | <code>string</code> | <code>&quot;​ ​&quot;</code> | The characters to trim. |

<a name="module_ai-scripting-utils.trimEnd"></a>

### _.trimEnd(string, [chars]) ⇒ <code>string</code>
Removes specified characters from the end of `string`.

**Returns**: <code>string</code> - The trimmed `string`.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| string | <code>string</code> |  | The string to trim. |
| [chars] | <code>string</code> | <code>&quot;​ ​&quot;</code> | The characters to trim. |

<a name="module_ai-scripting-utils.trimStart"></a>

### _.trimStart(string, [chars]) ⇒ <code>string</code>
Removes specified characters from the beginning of `string`.

**Returns**: <code>string</code> - The trimmed `string`.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| string | <code>string</code> |  | The string to trim. |
| [chars] | <code>string</code> | <code>&quot;​ ​&quot;</code> | The characters to trim. |

<a name="module_ai-scripting-utils.inRange"></a>

### _.inRange(number) ⇒ <code>boolean</code>
Checks if `number` is in the range `[0,1)`.

**Returns**: <code>boolean</code> - `true` if `number` is in the range, `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| number | <code>number</code> | The number to check. |

<a name="module_ai-scripting-utils.inRange"></a>

### _.inRange(number, upper) ⇒ <code>boolean</code>
Checks if `number` is in the range `[0,upper)`. If `upper` is less than`0` the range boundaries are swapped.

**Returns**: <code>boolean</code> - `true` if `number` is in the range, `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| number | <code>number</code> | The number to check. |
| upper | <code>number</code> | The upper bound of the range. |

<a name="module_ai-scripting-utils.inRange"></a>

### _.inRange(number, lower, upper) ⇒ <code>boolean</code>
Checks if `number` is in the range `[lower,upper)`. If `lower` is greaterthan `upper` the range boundaries are swapped.

**Returns**: <code>boolean</code> - `true` if `number` is in the range, `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| number | <code>number</code> | The number to check. |
| lower | <code>number</code> | The lower bound of the range. |
| upper | <code>number</code> | The upper bound of the range. |

<a name="module_ai-scripting-utils.log"></a>

### _.log(message)
Prints `message` to the console. It is a shorthand for `$.writeln()`.


| Param | Type | Description |
| --- | --- | --- |
| message | <code>\*</code> | The message to print. |

<a name="module_ai-scripting-utils.random"></a>

### _.random([floating]) ⇒ <code>number</code>
Returns a random number between the inclusive `0` and `1` bounds. If`floating` is `true` a floating point number is returned.

**Returns**: <code>number</code> - The random number.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [floating] | <code>boolean</code> | <code>false</code> | Whether a floating point number should be returned. |

<a name="module_ai-scripting-utils.random"></a>

### _.random(upper, [floating]) ⇒ <code>number</code>
Returns a random number between the inclusive `0` and `upper` bounds. Ifeither `floating` is `true` or `upper` is a float, a floating pointnumber is returned. If `upper` is less than `0` the range boundaries areswapped.

**Returns**: <code>number</code> - The random number.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| upper | <code>number</code> |  | The upper bound. |
| [floating] | <code>boolean</code> | <code>false</code> | Whether a floating point number should be returned. |

<a name="module_ai-scripting-utils.random"></a>

### _.random(lower, upper, [floating]) ⇒ <code>number</code>
Returns a random number between the inclusive `lower` and `upper` bounds.If `floating` is `true`, or either `lower` or `upper` are floats, afloating point number is returned. If `lower` is greater than `upper` therange boundaries are swapped.

**Returns**: <code>number</code> - The random number.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| lower | <code>number</code> |  | The lower bound. |
| upper | <code>number</code> |  | The upper bound. |
| [floating] | <code>boolean</code> | <code>false</code> | Whether a floating point number should be returned. |


<a name="Point"></a>

### Point : <code>Array.&lt;number&gt;</code>
An array of 2 numbers containing the coordinates of the point: `[x, y]`.

<a name="Rect"></a>

### Rect : <code>Array.&lt;number&gt;</code>
An array of 4 numbers describing the bounds of the rectangle: `[left, top,right, bottom]`.

