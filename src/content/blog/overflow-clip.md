---
title: TIL - overflow clip
pubDate: 2023-04-25
tags:
  - CSS
  - Short TIL
description: An elegant way to solve overflow + padding
---

A very common design - a card with some content inside, and the content should be truncated if too long, but the card should have padding around, including bottom. (Example below)

![requirement](@assets/overflow-clip.png)

It seems obvious - set the height of the card (or `line-clamp`), then `overflow: hidden`.

BUT, after setting it, the padding buttom will be "gone". Or more accurately, the "overflow-hidden" content will show through the buttom padding.

![requirement](@assets/overflow-clip-issue.png)

It's not the end of the world, for a long time, I just always add another div inside to wrap all content. It works, but not very elegant... extra div...

TIL - `overflow: clip` that can solve it! Just change `overflow: hidden` to `overflow: clip; overflow-clip-margin: content-box;`, and it works just like I wanted.

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="KKxEqGw" data-user="liyangguang" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/liyangguang/pen/KKxEqGw">
  overflow-clip-margin</a> by Yangguang Li (<a href="https://codepen.io/liyangguang">@liyangguang</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

See more [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)
