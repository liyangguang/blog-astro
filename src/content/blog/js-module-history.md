---
title: JavaScript Module History
pubDate: 2020-01-26
tags:
  - JavaScript
description: Why does JavaScript need modules? What the difference between CommonJS, AMD, UMD? In this article, I walk through a brief history of JS modules, from old simple script tag and IIFE all the way to ES6 modules.
---

## Why modularize

- maintainable & reusability - scoped function, easy to debug within each scope. Use the same code in different projects
- namesspace - different module use the same namespace, or use different versions of the same library
- protect the module code - private
- dependency order
- async
- looping dependencies

## How it envolved

### 1. Immediately-invoked function expression

```js
  (function(){…})()
```

### 2. juqery pattern (adding properties to the global object in the argument)

```js
  (function(myLibrary){
    myLibrary.doSomething = function(){...}
    var privateFunc = function(){...}
  })(myLibrary)
    
  myLibrary.doSomething();
```

### 3. object interface

```js
  var myLibrary = (function(){
    function publicFunc(){...}
    function privateFunc(){...}
    
    return {
      func1: publicFunc
    }
  })()

  myLibrary.func1()
```

### 4. CommonJS (sync)

```js
  // the module
  module.exports = myModule;

  // another file
  var module1 = require('myModule')
```

- When  "require" executes, it waits for it finishes (i.e. sync). It's find for server usage, because the loading is just reading files from the local disk. But in browser use cases, it's too slow.
- Browserify - bundle all files into one.

### 5. AMD (async, use callback)

```js
  define('optional name', [dependencies], function(){
    return {
      func1: function(){...}
    }
  })

  // loading using require.js
  require([dependencies], function(){
    // main working function
  })
```

### 6. UMD (support CommonJS + AMD + none)

```js
  (function (root, factory) {
      if (typeof define === 'function' && define.amd) {
          // AMD
          define(['jquery', 'underscore'], factory);
      } else if (typeof exports === 'object') {
          // Node, CommonJS-like
          module.exports = factory(require('jquery'), require('underscore'));
      } else {
          // Browser globals (root is window)
          root.returnExports = factory(root.jQuery, root._);
      }
  }(this, function ($, _) {
      function privateFunc(){};
      function publicFunc(){};

      return {
          func1: publicFunc
      }
  }));
```

### 7. ES6 modules

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

## See more

- [My ES6 module article](../es6-modules)
- [The Evolution of JavaScript Modularity](https://github.com/myshov/history-of-javascript/tree/master/4_evolution_of_js_modularity)
- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
