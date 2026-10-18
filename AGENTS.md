# Pouch Tracker instructions

Read DESIGN_GUIDANCE.md before interface changes. The shared source is Pythonidaer/llm-instruction-toolkit, design/ and clean-code/. Apply only relevant guidance within the requested scope; preserve tracking behavior and existing device data.

Keep this compact, local-first PWA. Preserve the pouch-tracker-v1 localStorage key and backup version unless explicitly implementing a migration. The service-worker cache version is independent of the data schema.

Use clear task labels, no emojis or text-character substitute icons, real SVGs where useful, readable input text, visible keyboard focus, and usable touch targets. Preserve the bottom-tab navigation exception documented in DESIGN_GUIDANCE.md. Do not add motion or the learning roadmap automatically.

After app-shell changes, update the service-worker cache version. Check JavaScript syntax, affected user journeys, offline behavior, and narrow-screen layout. Report browser/device verification limits honestly.
