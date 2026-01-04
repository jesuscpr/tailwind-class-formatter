# Changelog

All notable changes to the "Tailwind Class Formatter" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2025-01-04

### Added
- Initial release of Tailwind Class Formatter
- Automatic grouping of Tailwind classes by category (layout, spacing, typography, background, borders, effects, etc.)
- Responsive variant grouping (e.g., `pt-4 sm:pt-6 md:pt-8` stay together)
- Correct ordering of responsive breakpoints (base → sm → md → lg → xl → 2xl)
- Format on save functionality (configurable)
- Format on paste functionality (configurable)
- Manual format command via Command Palette
- Configurable maximum line width with smart wrapping
- Two indentation styles for wrapped lines: "same" or "extra"
- Option to place closing quote on new line or same line
- Support for both `class` (HTML) and `className` (React/JSX)
- Support for all Tailwind variants (dark mode, hover, focus, etc.)
- Preserves other HTML attributes in their original positions

### Configuration Options
- `tailwindFormatter.formatOnSave` - Enable/disable format on save (default: true)
- `tailwindFormatter.formatOnPaste` - Enable/disable format on paste (default: true)
- `tailwindFormatter.closeQuoteOnNewLine` - Closing quote on new line (default: true)
- `tailwindFormatter.maxLineWidth` - Maximum line width before wrapping (default: 80, 0 = no limit)
- `tailwindFormatter.wrapIndentStyle` - Indentation style for wrapped lines (default: "same")

## [Unreleased]

### Planned Features
- Configuration to customize category order
- Support for custom Tailwind class patterns
- Integration with Tailwind IntelliSense
- Preserve comments within class attributes
- Format classes in template literals (for styled-components, emotion, etc.)
- Sorting options within categories (alphabetical, by specificity, etc.)

---

**Note:** This changelog follows the format from [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).