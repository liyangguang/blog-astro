---
title: catch async errors
pubDate: 2023-05-20
tags:
  - JavaScript
isTil: true
description: Can you notice the small detail that makes async try-catch fail to work?
---

Okay, read the code below, can you notice the issue with `function run()`?

```jsx
// This function has an issue.
async function run() {
  try {
    task();
  } catch (e) {
    console.warn('Something went wrong. Please retry');
  }
}

// Just an example async function that can fail.
async function task() {
  throw new Error('test');
}
```

This hit me a few days ago on a project - the issue is this code **will never reach the `catch` part**! It will throw an `Uncaught (in promise) Error` ! You will never see the useful console message (or, in real life, any UI feedback) you want to show when the task fails.

I always simply thought `async` with `try...catch` is the same as `.catch()` chain. But there is a critical detail - You must `await` any async code that can fail.

It’s not surprising once you know it, but still an easy detail to miss.

```jsx
// Correct version
async function run() {
  try {
    await task();  // Critical to have `await` here.
  } catch (e) {
    console.warn('Something went wrong. Please retry');
  }
}

// Or, the old way
task().catch((e) => {
  console.warn('Something went wrong. Please retry');
})
```
