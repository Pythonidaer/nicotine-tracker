# Design guidance and decisions

Applied 2026-10-18 from [LLM Instruction Toolkit](https://github.com/Pythonidaer/llm-instruction-toolkit/tree/8fcbf905152c911f2350b9bb6105a1ca3a3de5ab/design).

## Scope

Apply the shared visual, content, and information-architecture reset. Preserve this app's focused logging flow, compact typography, offline-first operation, existing green accent, light/dark themes, storage format, and backups. The palette is an existing product choice, not a new universal theme.

| Decision | Reason | Alternative | Check |
| --- | --- | --- | --- |
| Sticky frosted header with opaque fallback | Keep app identity visible without decorative glass panels | Fully opaque header | Check scrolling, light/dark mode, safe areas, and unsupported blur |
| Keep four bottom tabs instead of adding the default hamburger | Today, History, Trends, and Settings are frequent app destinations; direct access supports quick logging | Toolkit dropdown for a site with more destinations | Review narrow widths, keyboard access, enlarged text, and active state |
| Real SVG recent-entry chevron; plain Log actions | Avoid character-icon substitutes and unnecessary symbols | Clear text only | Check disclosure and labels |
| Labeled nicotine and last-7-days labels | Describe actual figures and remove obsolete preview wording | More explanation in Settings | Check labels against real calculations |
| Consolidated CSS; 44px controls and 16px inputs | Avoid stacked overrides, invisible expanded hit regions, and small mobile input text | Project-specific density changes after device review | Check focus clearance, touch targets, wrapping, and iPhone focus zoom |
| Preserve compact content; no reveal animation or roadmap | Logging does not need a staged entrance or learning diagram | Add a purposeful pattern after review | Primary actions remain immediately available |

Screen changes move focus to the content and return to the page top. A skip link provides direct keyboard access to content. Navigation has explicit current-page semantics. Focus outlines retain reserved clearance; the content focus target itself does not draw a decorative frame.

## Source guidance

- [Visual reset](https://github.com/Pythonidaer/llm-instruction-toolkit/blob/8fcbf905152c911f2350b9bb6105a1ca3a3de5ab/design/ai-design-reset/visual-styling.md)
- [Content reset](https://github.com/Pythonidaer/llm-instruction-toolkit/blob/8fcbf905152c911f2350b9bb6105a1ca3a3de5ab/design/ai-design-reset/content-design.md)
- [Layout and information architecture](https://github.com/Pythonidaer/llm-instruction-toolkit/blob/8fcbf905152c911f2350b9bb6105a1ca3a3de5ab/design/ai-design-reset/layout-and-information-architecture.md)
- [Navigation pattern](https://github.com/Pythonidaer/llm-instruction-toolkit/blob/8fcbf905152c911f2350b9bb6105a1ca3a3de5ab/design/patterns/navigation/frosted-header-dropdown.md)

The toolkit is the shared source; this file records the app's decisions and exceptions. Future toolkit changes require deliberate review rather than automatic UI replacement.

## Verification for this change

JavaScript syntax and whitespace checks passed. A lightweight simulated-DOM smoke check exercised logging, undo, settings, reload persistence, purchases, trends, history, deletion, and navigation state/focus calls. These checks do not establish rendered geometry or browser focus behavior. Browser installation failed in this environment; mobile Safari appearance, safe areas, blur rendering, keyboard behavior, and offline reopening remain for device review. Backup schema and storage key were preserved; export/restore logic was not changed.
