# Tailwind Class Formatter

Automatically format and organize Tailwind CSS classes by categories with responsive grouping.

## Features

- ✅ Groups Tailwind classes by categories (layout, spacing, typography, background, borders, effects)
- ✅ Groups responsive variants with their base classes (e.g., `pt-4 sm:pt-6 md:pt-8`)
- ✅ Orders responsive breakpoints correctly (base → sm → md → lg → xl → 2xl)
- ✅ Automatic formatting on save
- ✅ Automatic formatting on paste
- ✅ Manual format command
- ✅ Configurable line width with smart wrapping
- ✅ Customizable indentation styles
- ✅ Works with both `class` (HTML) and `className` (React/JSX)

## Demo

**Before:**
```html
<div class="pt-4 bg-gray-100 sm:pt-6 px-2 lg:pt-8 md:px-4 text-lg dark:bg-gray-800">
```

**After:**
```html
<div
  class="
    pt-4 sm:pt-6 lg:pt-8
    px-2 md:px-4
    text-lg
    bg-gray-100 dark:bg-gray-800
  "
>
```

## Usage

### Automatic Formatting

The extension will automatically format your Tailwind classes when:
- **Saving the file** (if `formatOnSave` is enabled)
- **Pasting content** (if `formatOnPaste` is enabled)

### Manual Command

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac)
2. Search for **"Format Tailwind CSS Classes"**
3. Press Enter

Or use a keyboard shortcut (you can configure this in VSCode's Keyboard Shortcuts).

## Configuration

Access settings via `File > Preferences > Settings` and search for "Tailwind Formatter".

| Setting                                 | Type    | Default  | Description                                                |
| --------------------------------------- | ------- | -------- | ---------------------------------------------------------- |
| `tailwindFormatter.formatOnSave`        | boolean | `true`   | Format classes when saving the file                        |
| `tailwindFormatter.formatOnPaste`       | boolean | `true`   | Format classes when pasting content                        |
| `tailwindFormatter.closeQuoteOnNewLine` | boolean | `true`   | Place the closing quote on a new line                      |
| `tailwindFormatter.maxLineWidth`        | number  | `80`     | Maximum line width before wrapping (0 = no limit)          |
| `tailwindFormatter.wrapIndentStyle`     | string  | `"same"` | Indentation style for wrapped lines: `"same"` or `"extra"` |

### Configuration Examples

#### Standard formatting (default)
```json
{
  "tailwindFormatter.formatOnSave": true,
  "tailwindFormatter.maxLineWidth": 80,
  "tailwindFormatter.wrapIndentStyle": "same",
  "tailwindFormatter.closeQuoteOnNewLine": true
}
```

#### Compact formatting (no line breaks within categories)
```json
{
  "tailwindFormatter.maxLineWidth": 0,
  "tailwindFormatter.closeQuoteOnNewLine": false
}
```

#### Extra indentation for wrapped lines
```json
{
  "tailwindFormatter.wrapIndentStyle": "extra"
}
```

## How It Works

The extension organizes Tailwind classes in the following order:

1. **Layout** - `flex`, `grid`, `block`, `inline`, `hidden`, `absolute`, `relative`, etc.
2. **Sizing** - `w-*`, `h-*`, `min-w-*`, `max-w-*`, etc.
3. **Spacing** - `p-*`, `m-*`, `px-*`, `py-*`, `pt-*`, etc.
4. **Typography** - `text-*`, `font-*`, `leading-*`, `tracking-*`, etc.
5. **Background** - `bg-*`, `from-*`, `via-*`, `to-*`, etc.
6. **Borders** - `border-*`, `rounded-*`, `ring-*`, `outline-*`, etc.
7. **Effects** - `shadow-*`, `opacity-*`, `transition-*`, `animate-*`, etc.
8. **Filters** - `blur-*`, `brightness-*`, `contrast-*`, etc.
9. **Transforms** - `scale-*`, `rotate-*`, `translate-*`, etc.
10. **Interactivity** - `cursor-*`, `select-*`, `pointer-events-*`, etc.
11. **SVG** - `fill-*`, `stroke-*`, etc.
12. **Accessibility** - `sr-only`, etc.
13. **Other** - Any unrecognized classes

### Responsive Grouping

Classes with the same property are grouped together with their responsive variants:
```html
<!-- Input -->
<div class="pt-4 md:pt-8 px-2 sm:pt-6 lg:px-4">

<!-- Output -->
<div
  class="
    pt-4 sm:pt-6 md:pt-8
    px-2 lg:px-4
  "
>
```

### Variant Support

The formatter handles all types of variants:
- **Responsive**: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- **Dark mode**: `dark:`
- **Hover/Focus**: `hover:`, `focus:`, `active:`
- **Combined**: `dark:hover:sm:bg-gray-100`

## Examples

### Complex Example with Multiple Categories

**Input:**
```html
<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
```

**Output:**
```html
<button
  class="
    py-2 px-4
    text-white font-bold
    bg-blue-500 hover:bg-blue-600
    rounded
    shadow-lg
    transition duration-300 ease-in-out transform hover:scale-105
  "
>
```

### Responsive Design Example

**Input:**
```html
<div class="p-4 sm:p-6 md:p-8 lg:p-10 text-sm sm:text-base md:text-lg lg:text-xl bg-white dark:bg-gray-900">
```

**Output:**
```html
<div
  class="
    p-4 sm:p-6 md:p-8 lg:p-10
    text-sm sm:text-base md:text-lg lg:text-xl
    bg-white dark:bg-gray-900
  "
>
```

## Known Limitations

- Only works with `class="..."` and `className="..."` attributes
- Does not format classes in template literals or dynamic class strings
- Requires classes to be in a single string (doesn't support spread syntax)

## Requirements

- Visual Studio Code 1.85.0 or higher

## Contributing

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/your-username/tailwind-class-formatter).

## License

MIT

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for details.

---

**Enjoy!** 🎉