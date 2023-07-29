---
title: CSS structures - BEM vs Tailwind vs Atomic vs Utility
pubDate: 2021-06-06
tags:
  - CSS
description: My thoughts on some of the common CSS structures
---

## CSS is terrible (or not?)

Many backend engineer think CSS is a terrible *thing* (many disagree that it's a programming language, thus just calling it a *thing*). And there are countless memes about how terrible CSS is.

![css meme](@assets/css-meme.gif)

It mostly comes down to:

- CSS is too flexible: you can achieve a layout in many ways in CSS.
- The way CSS is applied: Specificity, inheritance, and global by default make it easy to accidentally break things.

Many brilliant engineers have come up with many ways to solve these problems and make CSS more maintainable. (I didn't include `SMACSS` and `OOCSS`, they are more on how to name & organize CSS, a bit different)

## [BEM](http://getbem.com/)

BEM has been around for a while, and widely adopted. It's pretty straightforward `Block__Element--Modifier` (example from BEM documentation):

```css
.form { }
.form--theme-xmas { }
.form--simple { }
.form__input { }
.form__submit { }
.form__submit--disabled { }
```

```html
<form class="form form--theme-xmas form--simple">
  <input class="form__input" type="text" />
  <input
    class="form__submit form__submit--disabled"
    type="submit" />
</form>
```

Yea:

1. Easy to get started
1. It works, especially for complex applications with many engineers

Nay:

1. Both HTML and CSS are very wordy.
1. I have to come up with many names
1. I need to be careful that block names has no conflicts (not an issue when used in component based frameworks)

## [RSCSS](https://rscss.io/)

This is a variation of BEM, and I like it a lot. It's much cleaner than BEM (both HTML and CSS). The same example translated into RSCSS is:

```scss
.form {
  &.-theme-xmas { }
  &.-simple { }
  
  & > .input { }
  & > .submit {
    &.-disabled { }
  }
}
```

```html
<form class="form -theme-xmas -simple">
  <input class="input" type="text" />
  <input
    class="submit -disabled"
    type="submit" />
</form>
```

Yea:

1. Easy to get started, and works
1. Cleaner HTML and CSS

Nay:

1. It uses nesting, which is not natively supported yet [spec draft](https://drafts.csswg.org/css-nesting/)
1. Some people find class names starting with `-` and `_` werid

## Utilities (Tailwind)

I'm not sure the name "utilities" is accurate, some also call it "atomic", but I want to distinguish from the next one.

```html
<div class="w-32 bg-gray-100 rounded-xl p-8"><div>

<style>
.w-32 {width: 32px}
.bg-gray-100 {background-color: #ddd}
.rounded-x1 {border-radius: .75em}
.p-8 {padding: 8px}
</style>
```

It's easy to get. Basically you can know all the CSS by reading the HTML.

If you think about it, you'll realize the CSS file can be very complex - you might need to have all of `w-32, w-16, w-18, w-8` etc., and adding them one-by-one is tedious. That's why it's commonly used with a tool like [Tailwind](https://tailwindcss.com/). Tailwind can help you generate those rules and optimize them for you.

Yea:

1. Easy to understand css from HTML
1. No css rule specificity wars
1. Optimized for size (with some tools)

Nay:

1. HTML becomes messy. Lost semantic meanings
1. One more naming convension to remember
1. Not practical without supporting tools

Some argues this is getting back to inline styles - [One of the first issues opened on tailwind](https://github.com/tailwindlabs/discuss/issues/3) 😂 . (I agree it's much better than inline styles)

> Checkout how a CSS prank turns out very similar as what Tailwind is [Funny CSS to Tailwind](../../../2021/06/funny-css-to-tailwind)

## Atomic

(Again, I use the word "atomic" just to distinguish from "utility" above. Many people call the one above "atomic css". If you know a better name for this type, let me know~)

This is very similar as the one above, but kinda reversed.

```html
<div class="card">
  <ul class="list">
    <ul class="item"></ul>
    <ul class="item"></ul>
    <ul class="item"></ul>
  </ul>
  <button class="open-button"></button>
</di>

<style>
.card,
.list {
  padding: 1em;
}

.item,
.open-button {
  background: orange;
}

.card
.open-button {
  border-radius: 1em;
}
</style>
```

Yea:

1. HTML is easy to read
1. No css rule specificity wars

Nay:

1. Harder to reason about each element by reading the CSS

## Check out [how I structure my CSS](../../../2021/06/how-i-write-css)
