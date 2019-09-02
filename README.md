# text-truncation

_text-truncation_ truncates the copy of multiple elements in a container with a fixed height.

If you, for example, have a teaser element with a headline and some copy, both having a variable length, you usually want to show as much text as possible to avoid whitespace at the bottom of the teaser. _text-truncation_ allows you to do so by always only truncating as few characters as possible.
It also works with HTML elements in your truncated copy. That means you can style your copy with, for example, `<b>` or `<i>` or use links.

**_NOTE:_** _text-truncation_ truncates all children (or elements with a given class name) from last to first. That means that in the given example, first the copy gets truncated and afterwards the headline (if truncating the copy is not enough).

## Demo

[https://mgrsskls.github.io/text-truncation/](https://mgrsskls.github.io/text-truncation/)

## What about CSS?

CSS is only able to truncate text for a single line or recently also for multiple lines, but only for one container element. The given use case is not possible with CSS.

## Installation

`npm install text-truncation`

## Options:

- `appendix` (default `…`): The string that is appended at the end of the truncated copy.
- `className` (default `null`): The class name that is used to select your elements that should be truncated. If you omit it, _text-truncation_ will use the direct children of the element, which you passed as the first argument.

## Usage

### HTML

```html
<div class="Teaser">
  <div class="TextTruncation">
    <h2 class="TextTruncation-text">[…]</h2>
    <p class="TextTruncation-text">[…]</p>
  </div>
</div>
```

**_NOTE:_** `.Teaser` needs a fixed height.

### CSS

```CSS
.TextTruncation {
  height: 100%;
  overflow: hidden;
}
```

**_NOTE:_** The `.TextTruncation` wrapper is only necessary if your containing element (here: `.Teaser`) has `padding`. If it does not, you can also add `text-overflow: hidden` directly to your containing element.

### JS

```javascript
import TextTruncation from "text-truncation";

new TextTruncation(document.querySelector(".TextTruncation"), {
  className: "TextTruncation-text"
});
```

## Troubleshooting

- Make sure that you initialize `TextTruncation` _after_ your elements have been rendered completely. Otherwise _text-truncation_ might use wrong dimensions and therefore not work.
