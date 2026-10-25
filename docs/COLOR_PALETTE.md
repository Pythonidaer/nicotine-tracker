# Measurement color palette

User-approved direction: a precise nicotine measurement tool. Muted blue supports interaction and observation; neutral surfaces keep attention on values. These are intentional interface conventions, not a claim that specific hues cause nicotine reduction.

## Theme values

| Responsibility | Token | Light | Dark |
| --- | --- | --- | --- |
| Page/menu/control surface | --p-bg | #FAFAF8 | #191B1E |
| Primary text | --p-fg | #242B33 | #E8EDF2 |
| Secondary text | --p-muted | #5C6773 | #AAB5C2 |
| Decorative divider | --p-line | #DCE1E6 | #37414C |
| Actions, links and selection | --p-accent | #365F85 | #A6C6E8 |
| Text on action/data fill | --p-on | #FFFFFF | #14283C |
| Field/picker boundary | --p-control-border | #687786 | #91A0AF |
| Outside keyboard focus | --p-focus-ring | #242B33 | #E8EDF2 |
| Inset focus on selection | --p-focus-on-selected | #FFFFFF | #14283C |
| Nicotine/spending data | --p-data | #365F85 | #A6C6E8 |
| Verified reduction, reserved | --p-progress | #276447 | #94CBA9 |
| Target attention | --p-attention | #805500 | #E8BE68 |
| Error/invalid input | --p-error | #A02D36 | #F1A0A6 |

## Responsibilities and states

- Blue: Save, links, add controls, disclosure icons, menu/picker selection, article headings, switches and nicotine/spending bars. Bar height represents quantity; every amount keeps the same data blue. Larger consumption is not rewarded with green.
- Neutral: Pouch added, Entry updated and routine Saved confirmations. Keep the actual wording and Undo; neutral confirmation acknowledges record keeping.
- Green: reserved for explicit, measured reductions against a stated baseline. No green reduction indicator is added by this update because no such comparison is currently displayed. A partial day, an unlogged day, game completion, and being below a target do not prove reduced use.
- Amber: with tapering enabled and a usable baseline, a pouch or nicotine total becomes attention-colored when at least 80% of that metric's guide has been used, including reaching/exceeding it. This threshold is a UI choice, not a clinical rule. Preserve Pouches/Nicotine remaining or over target labels and the existing optional craving prompt. Never block logging or apply failure language.
- Red: invalid taper percentage, native user-invalid form-field borders and Update app failures. Keep explanatory text, native validity messages and aria-invalid where applicable. Native alert dialogs remain OS-controlled, including storage failures.
- Focus: use the independent primary-text ring outside ordinary controls and on-fill ring inside selected picker options. Existing hover, focus-visible, pressed, selected and disabled behaviors stay. Theme toggling preserves the current page and form drafts.
- Short chart bars: revealed counts above short/zero bars use primary page text color and replace the usual value label during the reveal. Taller-bar labels use on-fill text. Mobile pouch counts remain stacked with transparent backgrounds.
- Activity charts: use horizontal bars in the same data blue, with a direct activity label, percentage and pouch count. All categories share the same 0–100% scale; color does not rank activities as good/bad. This supersedes the earlier pie and multicolor legend.
- Brand artwork: the header uses a matching blue SVG pouch mark. Existing PNG installed-PWA icons remain for iOS compatibility and existing installations; they are identity artwork, not progress indicators.

## Token dependencies

Action and data tokens currently have identical blue values but are independent semantic decisions. Progress, attention and error colors must not inherit the action token. Decorative dividers do not supply the sole form-field boundary. Extra primitive/component token layers are unnecessary for this bounded palette.

Light/dark values use CSS light-dark(). theme.js applies the system or saved explicit preference before the stylesheet, and updates browser theme-color metadata to the matching surface. Preference key pouch-tracker-theme, log key pouch-tracker-v1 and backup version 1 are unchanged.

## Contrast checks

sRGB contrast, rounded to two decimals:

| Foreground / background | Light | Dark |
| --- | --- | --- |
| Primary / page | 13.68:1 | 14.65:1 |
| Secondary / page | 5.52:1 | 8.30:1 |
| Action or data / page | 6.41:1 | 9.75:1 |
| On-fill text / action or data | 6.70:1 | 8.48:1 |
| Control boundary / page | 4.40:1 | 6.45:1 |
| Progress / page | 6.70:1 | 9.35:1 |
| Attention / page | 6.25:1 | 9.86:1 |
| Error / page | 6.87:1 | 8.48:1 |

Text pairs meet the checked 4.5:1 threshold; control boundaries meet 3:1. These calculations do not establish complete WCAG conformance, distinguishability of every activity category, or verified usability.

## Validation

Run:

```sh
node tests/mobile-layout.test.cjs
node tests/color-contrast.test.cjs
node tests/palette-states.test.cjs
node tests/feedback-theme.test.cjs
node tests/nicotine-trends.test.cjs
node tests/material-icons.test.cjs
node tests/tapering-sudoku.test.cjs
node tests/custom-options.test.cjs
```

Checks cover explicit light/dark pairs, attention thresholds/off/no-baseline behavior, error recovery, neutral saved feedback, theme persistence and existing tracking/chart/game behavior. Browser executable is unavailable in this environment: true offline reopening, native Safari focus, larger text and appearance in both themes still need iPhone review.
