---
title: JavaScript ES6 modules
pubDate: 2020-01-27
tags:
  - JavaScript
  - JS Module
description: A deep dive into the usage of ES6 modules - basic export/import, npm packages vs. ES6 modules, build process for browser support, and more.
---

## basic usage
```js
// module.js
export const myConst = 1;
export function do(){...}

// app.js
import * as myModule from 'module.js'
myModule.do()

// OR

import {do} from 'module.js'
do()

// OR

import {do as myDo} from 'module.js'
myDo()
```

If the module just execute code, and you don't need a reference to the module, you can import in your js code or a script tag. They are the same.

```html
// module.js
console.log('module is running');

// load the module
<html>
    <!-- You can do this -->
    <script type="module" src="./module.js"></script>
    <!-- Or this. They are exactly same -->
    <script type="module">
    import './module.js';
    console.log('something else');
    </script>
</html>
```

- ES module code only execute once. That means, even if you put both script tag in the example below in your code, the “module is running” message only got logged once.
- `'use strict'` by default
- `defer` by default
- Note there’s a practice of naming ES module files as `.mjs` - to be easily readable by human.
    - Note you need to configure your hosting service to serve `.mjs` files as `text/javascript`. And if you are using tools like webpack, and need to pass all js files into some loaders, you need to specify `.mjs` together with `.js`. (On the other side, if you want ES module and normal js file have different loaders setup - e.g. run Babel only on normal js - having different file extension is a good way to distinguish them)

## npm vs ES6

```js
import something from 'some-npm-package';  // Webpack import
import something from './some-es6-module.js';  // ES6 import
```

- Syntax is similar with ES6 import, but that’s just a special syntax only can be understood by webpack etc.
- Differences: Note, ES6 modules here is the native usage, not bundling use case (e.g. rollup) that is used for older browser support

|             | import “from”               | Module source                                                        | usage                                                                            | browser support                                                                                                           |
| ----------- | --------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| npm package | Name of the npm package     | modules installed via `npm install` inside the `node_modules` folder | Read by webpack during the local build process and bundled into the output file. | Doesn’t matter - always support. Because the import is not run in a browser. It’s run on developer’s machine, in webpack. |
| ES6*        | Path to a ES module js file | The file at the path location                                        | Read by the browser. File is loaded from the path directly in users browser      | Only newer browsers support ES6 modules. (see more below)                                                                 |

### Use npm package in the ES6 way (if that package supports it)

- unpkg has an experimental flag `?module` that loads npm packages as ES6 module. So you can write code like `import some-package from` `'``http://unpkg.com/package-name@version/path/file.js?module``'`
- Or, you can still install npm packages into your `node_modules` folder, and load the file directly like `import some-package from` `'``./node_module/package-name/path/file.js``'`. But it only works if the npm package supports ES6 module. And your deployment/hosting solution should be configured to include the package in node_modules folder.
- Paul Kinlan has an article about a neat way to convert any npm package into ES module. https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/

## Browser support

Only latest browsers support ES6 modules.
For older browsers doesn’t support ES6 module, you need to bundle them into one JS file without using the `import`. 

- How to bundle - it’s very straightforward, you can use bundlers like rollup.js. Simply: `rollup my-main-js-that-uses-es6-modules.js --file bundle-for-old-browsers.js --format iife` (You can tweak the flags for your app, and maybe include this into your build process - gulp, npm script, etc.)
- How to deliver to end users
- Luckily, `<script>` tag provides a nice way to distinguish ES6 module

```html
<script nomodule src="bundle-for-old-browsers.js"></script>
<script type="module" src="my-main-js-that-uses-es6-modules.js"></script>
```

This is how the code works:

![Code garph](@assets/es6-modules-code-graph.png)

Here's how old browsers and modern browsers load the above code:

![browser comparison](@assets/es6-modules-browser-comparison.png)

- On browsers that supports ES6 module, code inside `nomodule` will be ignored. And only `type="module"` will be executed. As a result, users using modern browsers loads ES6 modules on their browsers.
- On browser that doesn’t support ES6 module. They don’t understand `type="module"`, so they just ignore the tag. And they also don’t know about `nomodule`, so they just load and execute the bundle file like any other normal js file.
- In both cases, only the file that is usable in the browser will be loaded and executed. Thus doesn’t affect loading performance, or cause any duplicated code execution.
- See more in https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
- One added benefit of using `type="module"` is browsers support ES6 modules also support other ES6 syntax. Thus you can use ES6 features like `const elements = Array.from(new Set([...array1, ...array2]))` in your code without babel/polyfill. You only need to run the code through babel when you bundle them for old browsers.

## dynamic import

Normally, `import` will be hoisted - which means the ALL the dependent modules will be loaded before running any code.

But sometimes, you might not need all the modules right away, and only need them later (e.g. after user clicks a button to open a modal). Dynamic importing is designed for this case:

```js
import('./my-module.js').then((module) => {
    // Do something with the module.
});

// Or inside an async function
let module = await import('./my-module.js');
```

To improve the performance of loading, you can also preload the module just like preloading images and other files.

```html
<link rel="modulepreload" href="./main.js"></link>
```

## See more

- [My JavaScript module history article](../js-module-history)
- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
