---
title: From a funny CSS tweet to Tailwind
pubDate: 2021-06-12
tags:
  - CSS
description: Today I read a funny/sarcasm CSS tweet, and it led me to think about tailwind.
---

Today I read a funny/prank CSS tweet, and it led me to think about tailwind.

## The tweet

[link](https://twitter.com/samthor/status/1402825668061130755)

Here's the code:

```html
<style>
  .display\:.flex\; {
    display: flex;
  }
</style>

<main class="display: flex;">
  <div></div>
  <div></div>
</main>
```

This is legit CSS. It defines two classes `display:` and `flex;`. The `\` in CSS is to escape special char. And in the HTML, just read the `class` value normally - it's a space separated list of class names - so it's exactly `display:` and `flex;`. If you still feel confused, here's a "normal" version (just changed the name of classes, and we all know, CSS class names doesn't matter):

```html
<style>
  .foo.bar {
    display: flex;
  }
</style>

<main class="foo bar">
  <div></div>
  <div></div>
</main>
```

Some pointed out in the tweet thread, it makes `<main class="display: flex;">` and `<main style="display: flex;">` interchangeable! And some more brilliant examples in the thread:

```css
[style*="display: flex"] {
  display: flex;
}
/* Usage: <div style="display: flex">. (So, it basically does nothing) */

[style*="display: flex"] {
  display: block !important;
}
/* Usage: <div style="display: flex">. (But still renders as display block. LOL) */

[background-color="red"] {
  background-color: red;
}
/* Usage: <div background-color="red">. (No style="" or class="") */
```

## Hascc

I saw one reply mentioned [hacss.io](https://hacss.io/) (They also has a dope domain - [inline.style](https://inline.style/))

```html
<div
  class="  
    background:#fff;  
    color:$gray70;  
    padding:$len24;  
    box-shadow:$md;  
    @lg{display:flex}  
    @lg{padding:0}  
  "
></div>
```

At first, I thought someone build this site as a prank. But when I look around the site... seems there's a little bit of seriesness in it. It's actually designed to really for use.

## Tailwind

Wait a second - isn't this the same as what tailwindcss doing? The only difference is the naming is shorter in tailwind:

| funny tweet / hacss       | tailwind              |
| ------------------------- | --------------------- |
| `class="background:#fff"` | `class="bg-grey-100"` |
| `class="display: flex;"`  | `class="flex"`        |
| `class="padding-top:0"`   | `class="pt-0"`        |

I just found it quite funny that a funny/prank/crazy CSS has so much in common with a very useful framework many devs like.

Also check out my comparison of Tailwind with other CSS structures - [BEM, tailwind, and more](../../../2021/06/bem-vs-atomic-vs-tailwind-css/), and [how I structure my CSS](../../../2021/06/how-i-write-css)
