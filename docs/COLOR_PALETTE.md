# Warm vivid color palette

Approved direction: cyan and magenta accents, a warm plum dark surface and soft blush light surface. This is a vivid accent palette with warm neutrals, not a strict three-hue triad. Treat 60–30–10 as an optional distribution guide, never a measured quota.

## Values

| Token | Light | Dark |
| --- | --- | --- |
| `--p-bg` | `#FFF1ED` | `#34232E` |
| `--p-surface` | `#FFFAF7` | `#44323F` |
| `--p-fg` | `#34232E` | `#FFF1ED` |
| `--p-muted` | `#65505D` | `#DEC9D5` |
| `--p-line` | `#E0CCD3` | `#654A5C` |
| `--p-accent` | `#00758B` | `#5ED9ED` |
| `--p-on` | `#34232E` | `#34232E` |
| `--p-action-fill` | `#00B8D9` | `#00B8D9` |
| `--p-control-border` | `#826875` | `#B79AAA` |
| `--p-focus-ring` | `#34232E` | `#FFF1ED` |
| `--p-focus-on-selected` | `#34232E` | `#34232E` |
| `--p-data` | `#008097` | `#00B8D9` |
| `--p-data-on` | `#FFFFFF` | `#34232E` |
| `--p-spending` | `#CF166B` | `#FF79B6` |
| `--p-spending-on` | `#FFFFFF` | `#34232E` |
| `--p-progress` | `#276447` | `#94CBA9` |
| `--p-attention` | `#805400` | `#F1CC76` |
| `--p-attention-bg` | `#FFF0CC` | `#493919` |
| `--p-error` | `#A02D36` | `#FFADB7` |

## Semantic use

- Cyan action fill is #00B8D9 with dark plum text in both themes. Accessible text links use a deeper cyan in light mode and a softer cyan in dark mode.
- Nicotine and activity-share bars use the cyan data token; light-mode cyan is deepened enough for chart/background and white-on-fill label contrast.
- Spending bars/values use magenta, with a brighter soft pink variant in dark mode. Spending is a distinct measure, not a warning or reward.
- Warm plum supplies dark-mode page surfaces and light-mode text. Soft blush supplies the light-mode page and dark-mode text. Quiet raised surfaces organize content without covering the interface in large saturated panels.
- Routine saves use neutral text. Green remains reserved for explicitly measured reductions and is not displayed as a reward for logging.
- Amber is confined to target captions/a small guide notice and the optional target prompt. Large over-target values remain primary text. Errors use independent red plus explanatory labels.
- On-fill text, data text, spending text and focus-on-selection are separate roles so cyan/magenta changes cannot silently break contrast.
- Light/dark preference and browser theme-color metadata still update before the stylesheet paints. Existing log and preference storage keys and version-1 backups are unchanged.

## Verification

Automated contrast checks cover text/page, action fill/text, nicotine fill/text, spending fill/text, boundaries, selection focus, attention, error and reserved progress in both themes. All checked text pairs are at least 4.5:1; non-text boundaries/data are at least 3:1 where checked. These pairwise calculations are not a claim of complete WCAG conformance.

The header SVG uses plum and cyan; legacy PNG Home Screen artwork is retained for installed-iOS compatibility. See [WARM_DIRECTION.md](WARM_DIRECTION.md) for layout, naming and interaction changes.
