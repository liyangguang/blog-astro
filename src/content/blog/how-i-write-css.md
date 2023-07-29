---
title: How I write CSS
pubDate: 2021-06-06
tags:
  - CSS
description: A short blog to describe how I structure my CSS
---

![css meme](@assets/css-meme.gif)

> If you haven't, check out my thoughts on [BEM, tailwind, and more](../../../2021/06/bem-vs-atomic-vs-tailwind-css/)

## How I structure my CSS

When I write CSS, the two main goals are:

- Easy to maintain
- Code readability

And in these years of writing frontend code, I tried many different ways to structure CSS - BEM, atomic, OOCSS, etc. (I have a quick summary of them at the end of this blog). The structure I liked the most is [rscss](https://rscss.io/) (a variation of BEM). And with some modifications, here's how I write CSS nowadays:

### Overall structure

```
- root
  - index.html
  - global.css
    content inside:
      /* CSS variables */
      /* Resets */
      /* Utilities */
  - components
    - ComponentFoo (with its CSS)
    - ComponentBar (with its CSS)
```

### Global CSS file - Resets

```css
/* Global resets are very very basic. I just want a baseline. */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;  /* Now I think about it, this is not really necessary... */
}

/* Optional (depending on the design), but common resets I use */
a {
  text-decoration: none;
}

button {
  background-color: transparent;
  border: 0;
}

img {
  max-width: 100%;
}

/* Only show the browser default outline when keyboard navigating */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### Global CSS file - CSS variables

I really like CSS variables (Check out my blog on [CSS variables](../../../2020/05/css-variable)). So I always use it for global themes. Some common variables I have:

```css
:root {
  --primary-color: orange;
  --accent-color: lightgreen;
  --background-color: #ddd;

  --shadow: 0 0 6px rgba(0,0,0,.4);
  --transition: .5s ease-in-out;

  /* I always use variables for z-index.
   * It's very easy to mess up z-index, and have smelly code like `z-index: 9999`.
   * For nested z-index values, they are often defined within the component. */
  --z-header: 10;
  --z-modal: 20;
  --z-mask: 19;
  --z-above-content: 1;

  /* If the site is using a design style guide, not using `em` system. I define them as variables */
  --font-size-header: 20px;
  --font-size-subheader: 18px;
  --font-size-caption: 14px;
}
```

### Global CSS file - Utilities

Depending on the design language of the site, and how the components are structure, I usually have some global utility classes. These are shared styles used in many places. Some examples:

```css
._flex-space {
  flex: 1;
}

._card {
  box-shadow: var(--shadow);
  border-radius: 1em;
  padding: 1em;
}

._main-button {
  color: white;
  background: var(--primary-color);
  border-radius: 1em;
  padding: .5em 1em;
}
```

Some of them can be wrapped as a component (like `._card`), but sometimes it's more flexible as a simple CSS class.

I always start utility classes with `_` (learned from [rscss](https://rscss.io/helpers.html)), so it's always easy to identify - when looking at a piece of HTML `<div class="_card notification"></div>`, I can instantly know this class is in the global css, not component's CSS.

### Component CSS - tags are okay

All the above sections are in the site root level. One CSS file directly added to the HTML. And within each component, are the styles for that component.

Because we now have scoped CSS available in almost all frameworks, I don't need to worry about rules leaking outside of the component.

> You *CAN* use tags as CSS selectors now (if you have scoped CSS)

It's commonly know as a best practice to not use tags or ids as CSS selectors. But with scoped CSS, it's not really a pain anymore. Each component are so tightly encapsulated, it's easy to manage them. Plus, as we all know - **The hardest thing in programming is naming**, we can just use tags when applicable, so we don't need to come up with a new class name. Quick example:

```html
<button>Click me to open the list</button>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

If this is the whole component, there's no need to give class names like `.toggle-button`, `.list`, `.item`. It's much easier to just use `button, ul, li` as the CSS selectors.

### Component CSS - nesting

I use CSS nesting. It's a little dangerous - in a complex page, deeply nested CSS selectors can hurt performance. But in most cases, I won't nest more than 2 levels, and the performance loss is negligible. And with CSS nesting, I gain a the code readability, and avoid css leaking within the component.

```css
/* What I prefer */
.card {
  .title {}
  .description {}
  img {}
}

/* Nay: I need to check the HTML to know which class is used where */
.card {}
.description {}
.title {}
```

### Component CSS - modifiers

This is the same as RSCSS - if an element has different states, use a modifier class. And I always has start them with `-`:

```scss
.panel {
  opacity: 0;

  &.-expanded {
    opacity: 1;
  }
}
```

HTML looks like (use vue as an example): `<div class="panel" :class="{'-expanded': isPanelExpanded}"></div>`, so in DOM, it would be renders as `<div class="panel"></div>` or `<div class="panel -expanded"></div>`

### Component CSS - No block-element

Both BEM and RSCSS has the concept of **block & element**, and are fairly strict on the relationship. But I don't find it very useful for me. Mostly because I exclusively build frontend using component-capable libraries (react, vue, angular, etc.). So in most cases, the component is the "block", and everything I write is "element".
