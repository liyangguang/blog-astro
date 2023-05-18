---
title: iframe communications using window message
pubDate: 2020-12-05
tags:
  - JavaScript
description: How to communicate between iframe and parent correctly
---

## TLDR

> - Send from iframe to parent: `window.top.postMessage(payload, originOfParent);`
> - Send from parent to iframe: `document.querySelector('iframe').contentWindow.postMessage(payload, originOfIframe);`
> - Receive message by `window.addEventListener('message', (event) => handleMessage(event))`

[demo link](https://iframe-message-demo-parent.netlify.app/), [code](https://github.com/liyangguang/iframe-message-demo)

If you are interested to learn the traps and details, continue reading...

## Parent and iframe on the same origin

(i.e. `location.orogin` logs out the exact same string from the main page, as well as the iframe).

- Parent to iframe: You can simply access the content of iframe by `document.querySelector('iframa').contentDocument.body` and `document.querySelector('iframa').contentWindow`, thus communication can be done there.
- Iframe to parent: It works the other way as well `window.top` or `window.parent` to access the parent window from the iframe.

Quick tip: You can use `const isIframe = window.top !== window` to check if a page is embedded. (You may change `window.top` to `window.parent`, `window.parent.parent`, etc. if you need accurate embed layer).

## Parent and iframe on different origins

This is the real reason I want to write this article.

You may already know the answer is `window.postMessage` - which is specifically designed for cross-origin communication between `window`s ([MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)). But only until last week, I found out some details about it.

The basics of it is:
> Send message by `window.postMessage()`. Receive message by `window.addEventListener('message', handler)`

Sounds pretty straightforward, right? Not really, it's very easy to get the message lost in some details!

I created a demo site to show all the different cases: [demo link](https://iframe-message-demo-parent.netlify.app/), [code](https://github.com/liyangguang/iframe-message-demo). Checkout the console log of the demo page - you can see 16 messages are sent, but only 4 messages are received correctly. There are a few things to pay attention to, let me break it down.

### Window

When you use `window` in JavaScript, it's very easy to have the mindset "window is the top level thing in my browser", and easily feel "there's only one window". The first trap here is right here!

As the documentation says "`postMessage` enables communication between window objects", in the case of using iframe (and some more less common cases), you have multiple window! And it's crucial which `window` you are posting message to, otherwise the message won't be delivered as you expected.

- When sending from parent to iframe, use `document.querySelector('iframe').contentWindow.postMessage()`. (Don't forget `contentWindow` there)
- When sending from iframe to parent, use `window.top.postMessage()` (or `window.parent`, depending on your case)

### Origin

The 2nd trap is the origin, specifically the `targetOrigin` argument [MDN link again](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#Syntax).

It has 3 different values - '*', a URL, or undefined (not set).

- undefined (unset), e.g. `someWindow.postMessage('my message')`: This is the easist mistake to make (including myself, and this is the reason I started to experiment all the different cases). `targetOrigin` (the 2nd argument of `postMessage`) is actually **not an optional field**. So this is just wrong... But browsers (at least Chrome 86 - the version I'm using right now) do not warn you, or throw any errors. And it behaves just like '*' for cases I tested. Not sure if it's an intentional behavior, or a browser bug, or a backward compatibility thing. But anyway, we shouldn't leave it empty.
- "*", e.g. `someWindow.postMessage('foo', '*')`: This is just as it looks like - send to any origin. It works, but is discouraged in the spec as it can introduce potential security issues.
- A URL, e.g. `someWindow.postMessage('foo', 'https://example.com')`: It should always be used this way. Always specify which origin you are sending to.
  - Browsers will warn you `The target origin provided does not match the recipient window's origin` if `someWindow` (in real case, `ifremeElement.contentWindow` or `window.top`, etc.) is not on `https://example.com`. As you can see in the demo site logs as well.

### Echo

This is not really a trap, just a small "feature" that can cause some confusion. If you send message from `window.postMessage` (pay attention to the `window`, it's the real current window), and the origin is also matching, then `window.addEventListener('message')` will get the message as well. In other words, message send by it can be received by itself. (That's all the "[echo self]" logs in the demo).

### Timing

This is not specific to `postMessage` + `addEventListener('message')`, but more a general thing about any event listeners. You can only get the event **after** the event listener is added. You cannot get the events happened before the event listener.

So when you communicate between iframe and parent, make sure send the message when you know the page is loaded, and `addEventListener('message')` is set up. In my demo, I simply add the listener right when the page loads, and send all messages after 1s. For a real world case, you may want a more reliable setup - for example, have a two way hand-shake (See the last section below).

### Summary

- Send from iframe to parent: `window.top.postMessage(payload, originOfParent);`
- Send from parent to iframe: `document.querySelector('iframe').contentWindow.postMessage(payload, originOfIframe);`

Note: I've been using just a string as the message in examples, but it can be a json as well.

## Bonus content

### Security of receiving content

Always check what is the origin of the message before processing it.

```javascript
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://example.com') {
    // Or `if (['https://example.com', 'https://foo.com].includes(event.origin))` when you have multiple expected origins
    return;  // Ignore all messages from unknown origin
  }

  // Start to process the data
  // ...

  // It's also a good idea to have some structure of the message
  // For example, the sender can send messages like `.postMessage({type: 'foo', value: 123}, origin)`
  switch (event.data.type) {
    case 'foo':
      // ...
    case 'bar':
      // ...
  }
});
```

### Hand shake

This is a very basic version of checking both pages are ready (mentioned in the "Timing" section above).

The idea is one party keeps sending messages to another party, until it got reply from the other party. Then they both know they both ready. (It's not tested or used in any real work, just as a demenstration purpose).

```javascript
// Parent page
window.addEventListener('message', (event) => {
  if (event.origin !== IFRAME_ORIGIN) return;

  switch (event.data.type) {
    case 'iframeReady':
      clearInterval(interval);
      sendRealFunctionalMessage();
      break;
    case 'foo':
      // ...
  }
});

const interval = setInterval(() => {
  document.querySelector('iframe').contentWindow.postMessage({type: 'parentReady'}, IFRAME_ORIGIN)
}, 500);
```

```javascript
// iframe page
window.addEventListener('message', (event) => {
  if (event.origin !== PARENT_ORIGIN) return;

  switch (event.data.type) {
    case 'parentReady':
      window.top.postMessage({type: 'iframeReady'}, PARENT_ORIGIN);
      break;
    case 'foo':
      // ...
  }
});
```