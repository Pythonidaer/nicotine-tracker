# Design guidance and decisions

Updated 2026-10-19. Shared source: [LLM Instruction Toolkit](https://github.com/Pythonidaer/llm-instruction-toolkit/tree/9e136f976f8b63e9063ac518ec36fdcb0804227a/design).

Read the three AI design reset files, content-and-tone/best-practices.md, project-questions.md, and the navigation pattern when changing this interface. Apply relevant clean-code guidance to bounded changes. Explicit user choices take precedence over toolkit defaults.

## Current project choices

| Decision | Reason | Alternative | Check |
| --- | --- | --- | --- |
| Opaque, non-sticky logo header with hamburger disclosure at every width | User requested removing sticky frost and moving the bottom destinations into a dropdown | Toolkit sticky frosted header with desktop links | No blur or sticky header; all five destinations accessible at 320px and desktop |
| Existing pouch icon and Pouch Tracker wordmark link to Today | Reuse approved identity and provide a home action | New branding | Keyboard name, link behavior and image fallback |
| Nonmodal dropdown; no backdrop, focus trap, scroll lock or visible Menu/Close text | Navigation is a short destination list | Modal drawer | Escape/focus return, outside click, focus leaving header, destination selection, hidden focusability |
| Oswald headings/controls and Merriweather reading text | Verified font pair on Atomic Design chapter 1, Designing Systems | Platform system fonts | Correct fonts online/offline, readable inputs and narrow-screen layout |
| Compact tracking screens; larger article text and a distinct heading scale for resources | Logging and reading have different density needs | Same type scale everywhere | Tracker stays quick to scan; article headings and paragraphs remain readable |
| Keep existing green, light/dark surfaces and restrained dividers | Preserve the established app identity | Copy reference orange palette | Contrast, focus visibility and meaningful grouping |
| No reveal animations; only short disclosure and hamburger transitions | Core logging stays immediately available | Toolkit optional motion patterns | Reduced-motion support |

Typography reference: [Designing Systems](https://atomicdesign.bradfrost.com/chapter-1/) and its /css/style.css. The reference uses Oswald for headings, Merriweather for .text passages, a large normal-weight title, 2em section headings with a rule, and 1.5em subheadings. Adapt those relationships to the app, rather than importing the book's full CSS. Fonts are self-hosted under fonts/ with their SIL Open Font Licenses and cached by the service worker. Use plain 1, 2, 3 sequence numbering and real SVG UI icons; no emojis or text substitutes.

## Content and tone brief

Audience: adults already using pouches who want to understand use/spending and explore reduction or quitting. Task: log quickly, find practical next actions, and distinguish supported treatment options from personal experiments.

Voice: conversational, explanatory, concrete and respectful. Informal enough to read naturally; serious about health; restrained encouragement. Use clear questions and familiar examples where useful. The reference's approachable explanation is inspiration, not a request to reproduce Brad Frost's distinctive wording or jokes. No shame, hype, fake success rates, assumed feelings or medical promises. Errors state the problem and recovery action; confirmations state only verified changes. Keep the article's source and limitation context, not repeated generic warnings on every paragraph.

Content owner: repository owner. Source map and maintenance triggers: [RESOURCE_SOURCES.md](RESOURCE_SOURCES.md).

## Data and updates

Keep pouch-tracker-v1 localStorage and version 1 backups unchanged. Never clear stored logs during an interface refresh. Settings → Update app remains the supported installed-PWA refresh path. Asset query versions and service-worker caches advance together; app shell, resource copy, fonts and icons are cached locally. No new database, account, analytics, or cloud dependency.

Keep the skip link available for keyboard focus, hidden during ordinary touch use. Screen changes move focus to main content and return to the top. Current destination is identified with aria-current and a visible selected state.

## Verification, 2026-10-19

- JavaScript syntax and git whitespace checks passed.
- Simulated-DOM regression checks passed for existing version-1 data, menu dismissal/focus, all resource section anchors, settings, log/undo, purchases/totals, history, trends, reload persistence and the update action.
- All service-worker asset paths resolve to files in the repository, including local fonts and resource copy.
- Published GitHub Pages was checked in Chrome. Settings → Update app upgraded the previous app shell and preserved a saved test pouch; test data was then removed. Dropdown destinations and the resource guide rendered correctly. Computed heading/body families and non-sticky header position matched the intended design; no horizontal overflow at the inspected desktop width.
- iPhone narrow-screen appearance, larger text, light/dark mode, and true offline reopening remain for device review. No claim of native Safari verification.

## Compact notes and article navigation, 2026-10-19

History and Recent entries use native details/summary rows with a right-aligned SVG chevron. Controls and optional saved notes stay inside the disclosure on all device sizes. A two-line note editor appears only on request; Save and Cancel operate within the row. The optional note field is included on pouch or purchase records, with a 1,000-character limit. The existing storage key and backup version remain; old backups may omit the field. Notes are escaped as plain text and validated on restore. Failed saves do not display a success message or change the stored note.

Article contents links explicitly scroll to their section instead of relying on fragment navigation inside an installed PWA. Focus moves to the section heading without an extra jump; reduced-motion preferences use instant scrolling.

## Add-entry form, 2026-10-19

Replace the quick-log product row with a 44px icon control and an inline form. Default brand/strength come from Settings; per-entry overrides do not change defaults. Activity is optional and starts blank. Save persists a single pouch, closes the form, and replaces the icon with brief confirmation/Undo before restoring it. Only the entry section refreshes when feedback expires, preserving other open controls. Do not remove Undo while it has keyboard focus. Cancel does not persist. Failed saves roll back the attempted entry and leave the form available for retry.

Optional activity is plain text on the entry, displayed with its timestamp and validated on restore (string, at most 120 characters). The storage key and version-1 backup contract remain backward compatible. Automated checks cover defaults, per-entry overrides, activity omission/selection, cancellation, timed feedback/Undo, saved totals, reload and backup round trips, invalid activity rejection, and quota-failure rollback. Device layout and timing remain for iPhone review.

## Compact activity menu, 2026-10-19

The activity field uses a custom button/listbox to avoid the oversized iOS native select popup. Its opaque popup matches the field width, shows at most 220px of options, and scrolls internally; it opens above when space below is limited. Brand and strength keep their native controls. Support selection, selected state, arrows/Home/End, typing to find an option, Escape, Tab, outside dismissal and focus return. Activity stays optional and uses the same saved value and backup format. Check touch scrolling and VoiceOver on an actual iPhone.

## Shared entry selectors, 2026-10-19

Brand, nicotine strength and activity now share one field-width, scrollable picker component. Brand and strength retain their two-column layout. Opening Add pouch keeps focus on the disclosure control and opens no picker. Tapping any trigger or its SVG arrow toggles its popup; pointer-down state prevents mobile focus changes from closing and immediately reopening it. Only one picker opens at a time. Outside taps, selection, Escape and Tab close it. Hidden selects keep form submission and the existing saved values unchanged.

## Editing saved entries, 2026-10-19

History/Recent entries omit the Note added suffix. Edit entry replaces the note-only action and opens an inline editor on demand. Pouches expose brand, strength, optional activity and note; purchases expose brand, tins, amount, purchase date and note. Shared pickers use unique IDs per record. Legacy entries without an activity start at Not specified; an existing imported activity remains available. Notes start at five rows and expand to fit up to 320px, with internal scrolling and manual resizing for longer notes. Cancel discards the draft; save preserves IDs, pouch timestamps, defaults and unrelated fields, recalculates totals, and persists before showing confirmation. Storage failure restores the original record and leaves the draft available. The storage/backup schema remains version 1.

## Weekly history, 2026-10-19

History groups saved records by Monday–Sunday calendar weeks, newest first, using each record's saved local date. Each nonempty week has a date-range heading and 28px separation from the next group. History rows include weekday/date before time to distinguish days within a week; Recent entries retain time-only labels. Pouches and purchases remain together. Grouping never combines or removes records, including identical-looking logs. Editing a purchase date moves that record to its matching week.

## Purchase section, 2026-10-19

Today mirrors the Add pouch heading/icon treatment with Add purchase and the same right-aligned SVG add control. The existing purchase form opens from this icon. Spending uses the Summary two-column totals treatment: actual purchase amounts above Week and Month captions. No estimated consumption costs or changes to week/month calculations.

## Default product selectors, 2026-10-19

Settings → Default product → Change uses the same shared brand and nicotine pickers as Add pouch: field-width popup, capped height with scrolling, SVG arrow toggle, selection, keyboard navigation and dismissal. The existing stacked form layout and Save/Cancel behavior remain. Saving sets the defaults for future entries; previous records retain their saved values.

## Read-only Recent entries, 2026-10-19

Today's Recent entries keeps its outer disclosure and shows the latest three pouch entries logged today as plain rows (brand, strength, time and optional activity). No per-record disclosure, chevron, note editor, Edit entry or Delete controls appear there. History retains the full expandable editor and saved notes. No records or notes are modified by this presentation change.

## Purchase brand selector, 2026-10-19

Log purchase uses the shared compact Brand picker, matching Add pouch, default product settings and History editing. Preserve the existing purchase fields, default selection and save calculations.

## Purchase date width, 2026-10-19

Native date inputs explicitly use border-box sizing, zero intrinsic minimum width, full available width and a 100% maximum. Remove Safari's default appearance while retaining the native date input/picker; align its displayed value left. Forms and main content can shrink within their available width. Apply the same rule to Log purchase and History purchase editing. Do not hide page overflow as a substitute for correct control sizing. Actual iPhone Safari/PWA verification remains required.

## Dedicated Add pouch screen, 2026-10-19

Opening Add pouch replaces the Today overview with the entry form, following the Log purchase screen pattern. The shared app header and menu remain; Summary, Spending and Recent entries are absent until Save or Cancel returns to Today. Keep default-prefilled shared pickers, optional activity, no automatic picker opening, cancellation without saving, and the brief confirmation/Undo after successful saving.

## Full-width mobile pouch fields, 2026-10-19

Below 640px, the dedicated Add pouch form stacks Brand and Nicotine per pouch at full width, matching its Activity field and the Log purchase inputs. Desktop keeps the existing two-column brand/strength layout. History editing layout remains unchanged.

## Shared form action spacing, 2026-10-19

Add pouch uses the same form-actions class as Log purchase and default product settings: 20px above the action row and 12px between buttons. Remove the separate pouch action spacing rule so these forms stay consistent.

## Heading and action-column alignment, 2026-10-19

Recent entries shares the h2 typography/color rule with Add pouch and Add purchase. Its chevron occupies a centered 44px action column; History disclosure rows use the same 44px final grid column and centered accent-colored chevron. Header and main gutters match at both mobile and desktop widths so hamburger, add controls and disclosure chevrons share their horizontal center. Keep actual SVG dimensions and clickable summary behavior unchanged.

## Settings actions, 2026-10-19

Export backup and Restore backup reuse History’s borderless accent-text actions, including the flush-left first action. Update app uses the same filled primary style as Add pouch and Save. Backup copy and actions reuse History’s note/action spacing (8px after the copy), without the form-actions top margin. Update app retains the shared 20px form-action margin. Both action rows have a 12px button gap. The Add pouch submit label is Save, matching Log purchase.

## Tracking page hierarchy, 2026-10-19

History, Trends and Settings retain the shared 21px h2 type and now use Today’s 44px centered heading-row height with no extra bottom margin. Settings subsection headings use the same 18px h3 treatment as Summary and Spending. Your data and App updates begin after a divider, 12px section separation and the shared h3 spacing; keep backup actions grouped with their copy.

## Browsable seven-day trends, 2026-10-19

Previous/next SVG controls move the chart and paired pouch/nicotine daily averages through consecutive seven-day windows ending today. Date ranges identify the selected window; navigation stops at the earliest pouch and today. Incomplete windows average only days with logs, avoiding assumed zero-use days. Per user request, omit the explanatory days-with-logs line; the chart retains missing-day markers. Chart heights scale to the selected maximum rather than clipping high counts. Remove the Unlogged day footer; accessible chart descriptions still identify missing logs.

## Daily nicotine reveal, 2026-10-19

Chart columns are keyboard-accessible buttons. Tapping a logged day reveals its summed nicotine in mg inside the bar; tapping again hides it, and choosing another day closes the prior reveal. Missing days stay disabled. Navigating periods resets the reveal. Chart is a labelled group rather than an image so controls remain accessible.

## Spending trends, 2026-10-19

Trends has a right-aligned 44px SVG money toggle; spending mode offers a pouch icon to return. Each mode browses seven-day windows bounded by its own earliest record; switching resets to today. Spending charts actual daily purchase totals, with Week (selected seven-day total) and Month (calendar month through the selected end date) beneath Spending averages per requested copy. These are totals, not statistical averages. Nicotine trends omit the former monthly purchase row.

## Trends section dividers and missing purchases, 2026-10-19

Place the divider above each averages heading, between chart and summary, with no bottom border under summary totals. Spending days without a purchase record display the same dash as missing pouch days; a recorded zero-dollar purchase still displays $0.00. Calculations remain unchanged.

## Product summary punctuation, 2026-10-19

Use commas between brand and strength or tin count in History, Today’s Recent entries and Settings default product: Velo, 6 mg; Velo, 1 tin. This is an approved project preference, not a GOV.UK requirement.

## Purchase tin reveal, 2026-10-19

Spending chart columns reuse the nicotine chart’s accessible tap toggle to reveal summed tins bought on that date, with singular/plural labels. Multiple purchases on one date are combined for display only. Missing-purchase days remain disabled.

## Font loading, 2026-10-19

Preload both self-hosted TTF fonts from the document head with matching font MIME type and anonymous crossorigin mode. Serve these two font paths cache-first from the current service-worker cache; fetch and populate it only on a miss. Explicit reload requests still bypass this shortcut. Other app assets keep their existing network-first update behavior. Keep font-display swap and immediately readable text. Verify Update app and reopening on iPhone for perceived flash reduction.

## Weekly Activities trends, 2026-10-19

Nicotine and spending views link to Activities at bottom right with a tag SVG. Activities retains the selected seven-day window and returns to the originating mode. Navigation uses pouch-record bounds. Donut slices count pouches equally, ignoring strength; missing/blank activities are Not specified. A text legend provides every activity, rounded percentage and count, independent of color. The center shows total pouches; empty periods show an empty state. Activity colors stay stable for standard choices across weeks. No data schema changes.

## Bottom-aligned trend navigation, 2026-10-19

Trends main content uses a growing flex column; the Activities/return link has an automatic top margin and safe-area-aware bottom gutter. It sits at bottom right on short pages and follows content on tall pages, without a fixed overlay or obscured controls.

## Activity pie and labelled return icons, 2026-10-19

Activities uses a full pie with a pouch-count caption above it, replacing the donut and center labels. Keep legend percentages/counts and the accessible chart name. A single category renders a full circle. Return links pair Spending trends with the same money SVG and Nicotine trends with the same pouch SVG used by the mode toggle.

## Activity total figure caption, 2026-10-19

Keep Pouches by activity unmodified. Show the total as a small semantic figcaption beside the pie (47 pouches), replacing the separate caption above it. Chart and caption shrink within mobile gutters.

## Activity total and slice selection, 2026-10-19

Center the pie without a side caption. Place TOTAL and the pouch count below the legend. Tapping a slice bolds its matching legend row; tapping again clears selection. SVG slice groups are named keyboard buttons with Enter/Space, visible focus and pressed state; selection resets across periods.

## Activity selection color, 2026-10-19

Selected legend rows use the same accent green as resource section headings, replacing bold. Keep SVG pressed state and keyboard support. Activities are already serialized on entries in version-1 exports and validated/preserved on restore; older records may omit activity.
