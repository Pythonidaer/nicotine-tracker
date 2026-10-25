# Pouch Tracker instructions

Read DESIGN_GUIDANCE.md and docs/color-theory-rules.md before interface changes involving color, controls, charts or states. The shared source is Pythonidaer/llm-instruction-toolkit, design/, color-theory/ and clean-code/. Apply only relevant guidance within the requested scope; preserve tracking behavior and existing device data.

Keep this compact, local-first PWA. Preserve the pouch-tracker-v1 localStorage key and backup version unless explicitly implementing a migration. The service-worker cache version is independent of the data schema.

Use clear task labels, no emojis or text-character substitute icons, real SVGs where useful, readable input text, visible keyboard focus, and usable touch targets. Use the approved opaque, non-sticky logo header and hamburger disclosure on all screen sizes, as documented in DESIGN_GUIDANCE.md. Do not add motion or the learning roadmap automatically.

After app-shell changes, update the service-worker cache version. Check JavaScript syntax, affected user journeys, offline behavior, and narrow-screen layout. Report browser/device verification limits honestly.

Use the color responsibilities and validation notes in DESIGN_GUIDANCE.md. Preserve the established green palette; seek human review before broad palette or hierarchy changes. Keep functional control boundaries separate from decorative dividers and test focus in selected states, not only against page backgrounds.
