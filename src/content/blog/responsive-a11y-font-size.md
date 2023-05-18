---
title: Responsive and Accessible font-size
pubDate: 2021-12-10
tags:
  - CSS
description: Responsiveness and Accessibility are two very common best practice in web development. Today, I looked more into how to make `font-size` more responsive and accessible, and came up with this short note.
---

## Basics

I assume you already know about basics of `px` vs `em` & `rem`. (If not, you can check them out [MDN - CSS units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units) and [MDN font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size), as well as a lot of other units like `ex`, `ch`).

### Sidenote - `em` vs `%`

From a quick search and basic testing, `em` and `%` practically does the same thing - both set based on the parent size, both can be inherited. With the only different being `1em === 100%`. But generally, when using `font-size`, `em` is used more often - likely just a common coding style preference.

### Browser rules

The rule of browser font-size is also very straightforward

1. **only the root font-size is controlled by the browser/OS settings.**. Which means if use any value that is not inherited & relative to the root, it won't scale.
1. **All browsers have `16px` as the root font size**. This "root" is even above `<html>`, and CSS cannot change it.
1. **`rem` is based on the font size of `<html>`**. Not `<body>`, not any other special tag.

## The Responsive and Accessible needs

Some users may have vision needs, or display equipments needs to have larger or smaller font-size than general users.

All OS's and browsers have this feature built in. For example, you can visit [chrome://settings/appearance](chrome://settings/appearance) and see the "Font size" dropdown. You can find this in every browser and OS settings. This made testing also very easy for developers. You can simply toggle the settings and check how your site behaves.

> The goal is simple - when the font size setting changes, your web page should scale up/down the font size.

## Implementation

> First rule: Just don't use px (at least for font-size)

`px` doesn't scale. So no matter what the user set the browser/OS font size to be, your web pages will always be the "perfect" 12px you want for the design.

With that said, let's consider a HTML piece (the numbers are the expected final font size in pixel - likely what you get from a design mock):

```html
<div class="root">
  <section>
    <p class="title">Hello - 20</p>
    <p class="quote">Quote - 14
      <b class="large-text">Large - 18</b>
    </p>
    <p class="author">Author - 14</p>
    <p class="price">$99.99 - 14</p>
  </section>
</div>
```

See the HTML and both methods in CodePen below (comment / uncomment CSS to test both methods):

<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="bGowaYR" data-user="liyangguang" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/liyangguang/pen/bGowaYR">
  responsive font-size: em vs 62.5%</a> by Yangguang Li (<a href="https://codepen.io/liyangguang">@liyangguang</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

### Method 1 - Everything `em`

This is a method I used for a long time. I first evaluate the "body font-size" (here, I see `14px` is the most common size), then set the container as the font size, using `em`. After that, just set other font sizes using `em`. Full CSS code to achieve the font size needs are:

```css
section {
  font-size: 0.875em;
}
.title {
  font-size: 1.428571em;
  font-size: calc(20 / 14 * 1em);
}
.large-text {
  font-size: 1.285714em;
  font-size: calc(18 / 14 * 1em);
}
```

It's short and simple, but the size value is ugly. Most times I just use the closest 1 digit - `1.4em`, `1.3em`. But sometimes, designers may require pixel perfect result. Then I have to use `calc()` - which still looks less ideal.

### Method 2 - `62.5%` + `rem`

`62.5%` trick is shared a lot around CSS nerds, and it's an old trick that just works. The key is, setting the root `font-size: 62.5%`, and with the default browser size of `16px`, it's a nice `10px`. The "nice" part is, then it's super easy to conver from a `14px` in a design mock to `1.4rem` - no calculate or approximation needed.

There're a few details I need to note about this method:

1. You have to use `rem`, not `em`. i.e. you have to base every font size on the html, not any parent relationship. Because once you started to use `em` in child tags, it just goes back to the same issue of `14/16` above, and losses the nice thing about `14px === 1.4rem`.
2. `62.5%`
  - It uses `%`, but the only reason I can guess is `0.0625em` just doesn't look good.
  - It's `62.5`. But I personally feel just using `6.25` is fine, and maybe better - `14px === 14rem`. The only reason I can guess is `14rem` means "14 times the font size of the root", which sounds ridiculous, but "1.4 times" sounds more reasonable. Tho, I might just go with `6.25%`.

```css
html {
  font-size: 6.25%;  /* 1rem => 1px */
}

section {
  font-size: 14rem;
  padding: 1em;
}

.title {
  font-size: 20rem;
}

.large-text {
  font-size: 18rem;
}
```

Yeah, that's it. I think I'll start to use this method in my future projects.
