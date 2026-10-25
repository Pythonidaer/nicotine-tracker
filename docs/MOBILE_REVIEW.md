# Mobile interface review — implementation

This specification records the user-approved changes from the mobile review. It takes precedence over earlier dated interface choices in DESIGN_GUIDANCE.md. Preserve local logs, existing backups, notes, activities, custom options, theme preferences and tapering calculations.

## Completed changes

| Review finding | Current behavior |
| --- | --- |
| Ambiguous totals/averages and mismatched week definitions | Today, History and Trends use Monday–Sunday calendar weeks. Trends current week is week-to-date. Spending totals are named totals; nicotine means say Daily average · logged days with the contributing count. |
| Condensed/serif tracking text and small labels | Tracking uses system UI, 16px body/input text, 14px supporting text, 22px primary headings, 18px section headings and 600-weight hierarchy. Oswald remains the wordmark; Merriweather remains article reading text. Compact seven-column chart annotations remain 12px with exact values in accessible button labels. |
| Equal emphasis for primary logging and spending | Today leads with nicotine (40px) then pouch count (30px). Add pouch is a compact full-width row button. Spending values are 22px, with a smaller labelled Add purchase action. Remove Summary and duplicated Add purchase/Spending heading layers. |
| Frequent destinations hidden in hamburger | Today, History and Trends stay visible beneath the header. Fight the craving, Quitting nicotine, Settings and Dark mode stay in the dropdown. No fixed bottom overlay. |
| Different navigation patterns within Trends | A labelled Measure dropdown selects Nicotine, Spending or Activities. It is visually distinct from the persistent primary navigation. Switching preserves the selected week and returns focus to the selector. |
| Automatic per-week chart rescaling | Daily nicotine and spending use an all-logged-days maximum, rounded up, independently by measure. Every displayed week shares that scale, shown with units. Heights encode actual daily totals; no assumed zero nicotine on missing days. |
| Pie chart difficult to compare | Activities use sorted horizontal blue bars, each with direct label, percentage and count, and a total. All bars represent a share of the same week's logged pouches on 0–100%; missing activity stays Not specified. No decorative category hues or slice-selection interaction. |
| Uneven local spacing | Three named spacing roles: field 8px, group 16px, section 24px. Related controls/copy stay grouped; dividers separate larger sections. Keep date controls shrinkable and mobile pouch fields full width. |
| Settings maintenance too prominent and tapering unexplained | Three groups: Tracking preferences, Reduction target, Data and app maintenance. Explain the previous week's logged-day average. Reuse the visible rounded theme-switch track/thumb for target enablement. Update app is a quiet text action beside its copy. |
| Small branding mismatch | Header uses an original matching blue SVG pouch mark. Legacy installed-PWA PNG images remain compatible with existing iOS installations. |

## Calculation details

- Calendar weeks start Monday at local noon to avoid midnight/DST boundary shifts. Week navigation stops at the earliest recorded pouch or purchase week and cannot advance beyond the current week.
- Current-week future days have no bars. The chart does not infer that a day without a record means zero use.
- Daily nicotine totals sum labelled mg. Logged nicotine-free pouches retain a real zero-mg entry.
- Daily averages divide by days containing pouch logs, including today if logged; explicitly note that today is still in progress. These are not seven-day averages when fewer days were recorded.
- Spending week value is the selected week's recorded purchases through its cutoff. Month value is the calendar month containing that cutoff, through the explicitly labelled date.
- Pouch and tin counts still appear when pressing a daily bar. Hover/focus reveal them too. Repeating a press hides them; selecting another bar closes the previous reveal. Keep transparent stacked text, and page-colored text above short bars.
- Chart maxima include all valid recorded days through today and are unchanged by carousel navigation. New/edited data can change the shared scale. Large historical outliers can compress smaller bars; the visible scale explains that trade-off.
- Activity shares count each pouch once, regardless of mg, and retain unknown/custom activity strings safely escaped.

## Interaction and responsive behavior

- Keep the Add pouch row available after saving. Success/Undo is separate; immediate repeat logging, cancel, storage rollback, target prompt and game return remain.
- Shared pickers remain bounded, field-width and scrollable, with keyboard support. Keep 44px target heights.
- Theme switching keeps page/form state and saved preference. Reuse switch markup for reduction enablement; preserve focus-visible and forced-colors treatments.
- History remains weekly and editable, with wrapping date/activity metadata and full-width notes. Today no longer renders Recent entries; History is the single record list.
- Article typography is a separate reading context. No redesign of its source content or treatment claims.
- Never delete/reinstall the PWA to receive this change; use Settings → Update app.

## Verification

Automated checks cover calendar/year boundaries, cross-week shared scales, logged-day means, missing/zero days, actual spending totals, escaped activity labels, count-toggle behavior, full-row logging, grouped Settings, shared switches, both theme palettes and existing backups/game/custom-option flows. JavaScript syntax and cache-asset inventory are checked.

Native iOS PWA safe areas, larger text, actual touch/VoiceOver and true offline reopening still require device review. Browser checks of the published screens are reported separately; they do not imply a native iPhone test.


## Later approved warm direction

See [WARM_DIRECTION.md](WARM_DIRECTION.md). It replaces the muted blue palette with cyan/magenta accents and warm plum/blush surfaces, uses equal metric columns across Today/Spending, removes Recent entries from Today and replaces stacked Trends tabs with a Measure dropdown. Menu destinations are Sudoku break and Cutting back guide. Tracking, History, backup and tapering behavior remain.
