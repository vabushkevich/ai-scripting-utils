# ai-scripting-utils

A JavaScript utility library for those who write scripts to automate tasks in Adobe Illustrator.

The library provides many different helper functions intended to speed up the process of writing scripts. The functions are useful for working with this kind of objects:

- Native JavaScript objects and primitives
- DOM objects
- `Rect` objects that are arrays of 4 numbers (e.g. `pathItem.geometricBounds`)
- `Point` objects that are arrays of 2 numbers (e.g. `pathItem.position`)

## Documentation

You can find the API reference [here](./docs).

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

## Examples

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
