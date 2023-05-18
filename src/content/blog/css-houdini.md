---
title: CSS Houdini Could Change the Way We Write and Manage CSS
pubDate: 2019-03-15
tags:
  - CSS
description: With CSS Houdini coming to browsers, we are having more power in the CSS world. There might be some new ways we can write and manage CSS.
---

*Note: This article was originally posted in CSS-tricks, [link](https://css-tricks.com/css-houdini-could-change-the-way-we-write-and-manage-css/)*

CSS Houdini may be [the most exciting developent in CSS](https://www.smashingmagazine.com/2016/03/houdini-maybe-the-most-exciting-development-in-css-youve-never-heard-of/). Houdini is comprised of a number of separate APIs, each shipping to browsers separately, and some that have [already shipped (see browser support)](https://ishoudinireadyyet.com/). The Paint API is one of them. I’m very excited about it and recently started to think about how I can use it in my work.

One way I’ve been able to do that is to use it as a way to avoid reinventing the wheel. We’ll go over that in this post while comparing it with methods we currently use in JavaScript and CSS. (I won’t dig into how to write CSS Houdini because there are great articles like [this](https://developers.google.com/web/updates/2016/05/houdini), [this](https://houdini.glitch.me/paint) and [this](https://developers.google.com/web/updates/2018/01/paintapi).)

<!--more-->


## Why Houdini can make your work easy

The way CSS Houdini works brings two advantages: **modularity** and **configurability**. Both are common ways to make our lives as developers easier. We see these concepts often in the JavaScript world, but less-so with CSS world… until now.

Here’s a table the workflows we have for some use cases, comparing traditional CSS with using Houdini. I also added JavaScript for further comparison. You can see CSS Houdini allows us to use CSS more productively, similar to how the JavaScript world had evolved into components.

|                                            | **Traditional CSS**                                                      | **CSS Houdini**                                                                                    | **JavaScript**                                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **When we need a commonly used snippets**  | Write it from scratch or copy-paste from somewhere.                      | Import a worklet for it.                                                                           | Import a JS library.                                                                                   |
| **Customize the snippet for the use case** | Manually tweak the value in CSS.                                         | Edit custom properties that the worklet exposes.                                                   | Edit configs that the library provides.                                                                |
| **Sharing code**                           | Share code for the raw styles, with comments on how to tweak each piece. | Share the worklet (in the future, to a package management service) and document custom properties. | Share the library to a package management service (like npm) and document how to use and configure it. |



## Modularity

With Houdini, you can import a worklet and start to use it with one line of code.

```html
    <script>
      CSS.paintWorklet.addModule('my-useful-paint-worklet.js');
    </script>
```

This means there’s no need to implement commonly used styles every time. You can have a collection of your own worklets which can be used on any of your projects, or even shared with each other. (Side note: If you want not only style modularity, but also HTML and JS, then [web components](https://www.webcomponents.org/introduction) is the solution.)

It’s very similar to what we already have in the JavaScript world. Most people won’t re-implement commonly used functions, like throttling or deep-copying objects. We simply import libraries, like [Lodash](https://lodash.com/).

I can imagine we could have CSS Houdini package management services if the popularity of CSS Houdini takes off, and anyone could import worklets for interesting waterfall layouts, background patterns, complex animation, etc.


## Configurability

Houdini works well with CSS variables, which largely empowers itself. With CSS variables, a Houdini worklet can be configured by the user.

```css
.my-element {
  background-image: paint(triangle);
  --direction: top;
  --size: 20px;
}
```

In the snippet, `--direction` and `--size`  are CSS variables, and they’re used in the `triangle` worklet (defined by the author of the `triangle` worklet). The user can change the property to update how it displays, even dynamically [updating CSS variables in JavaScript](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables#Values_in_JavaScript).

If we compare it to what we already have in JavaScript again, JavaScript libraries usually have options that can be passed along. For example, we can pass values for speed, direction, size and so on to a carousel library to make it perform the way we want. Offering these APIs at the element level in CSS is very useful.


## A working example

Let’s see a complete example of how this whole thing can work together to make development easier. We’ll use a **tooltip** design pattern as an example. I find myself using this pattern often in different websites, yet somehow re-implement for each new project.

Let’s briefly walkthrough my old experience:


1. OK, I need a tooltip.
2. It’s a box, with a triangle on one side. I’ll use a pseudo-element to draw the triangle.
3. I can use the transparent border trick to draw the triangle.
4. At this time, I most likely dig up my past projects to copy the code. Let me think… this one needs to point up, which side is transparent?
5. Oh, the design requires a border for the tooltip. I have to use another pseudo-element and fake a border for the pointing triangle.
6. What? They decide to change the direction of the triangle?! OK, OK. I will tweak all the values of both triangles…

It’s not rocket science. The whole process may only take five minutes. But let’s see how it can be better with Houdini.

I built a simple worklet to draw a tooltip, with many options to change its looks. You can [download it on GitHub](https://github.com/liyangguang/css-houdini).

Here’s my new process:


1. OK, I need a tooltip.
2. I’ll import this tooltip worklet and use it.
3. Now I’ll modify it using custom properties.

```html
    <div class="tooltip-1">This is a tip</div>
    <script>CSS.paintWorklet.addModule('my-tooltip-worklet.js')</script>
    <style>
    .tooltip-1 {
      background-image: paint(tooltip);
      padding: calc(var(--triangle-size) * 1px + .5em) 1em 1em;
      --round-radius: 0;
      --background-color: #4d7990;
      --triangle-size: 20;
      --position: 20;
      --direction: top;
      --border-color: #333;
      --border-width: 2;
      color: #fff;
    }
    </style>
```

Here’s a demo! Go ahead and play around with variables!

<iframe width="100%" height="350" style="border: 0; max-width: 95%;" src="https://codepen.io/liyangguang/project/full/XJRjBv"></iframe>

CSS Houdini opens a door to modularized, configurable styles sharing. I look forward to seeing developers using and sharing CSS Houdini worklets. I’m trying to add more useful examples of Houdini usage. Ping me if you have ideas, or want to contribute to [this repo](https://github.com/liyangguang/css-houdini).

