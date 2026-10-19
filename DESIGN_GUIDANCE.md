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
