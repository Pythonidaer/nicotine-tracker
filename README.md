# Pouch Tracker

Compact, offline-first PWA for personal nicotine-pouch logging. No accounts, database, or analytics services. Starts with empty logs. Defaults to Zyn 6 mg until changed in Settings.

## Features
Nicotine-first Today overview, full-row Add pouch action, default brand/strength, optional activity, separate saved feedback and Undo; actual tin purchases; Monday-start calendar weeks; editable weekly History; labelled nicotine/spending/activity Trends with shared daily scales and horizontal activity bars; custom brands/strengths, optional reduction target, Sudoku craving break, light/dark switch and validated JSON export/restore.

Data remains in this browser/device. Unlogged days are unknown. Export backups regularly. Labeled mg is product content, not absorbed nicotine.

## Run
Serve this folder with any static HTTP server. Service workers require HTTPS or localhost. GitHub Pages: deploy main branch, repository root. All paths are relative for project Pages hosting.

## Future improvements checklist

### Personal PWA trial
- [x] Publish the PWA on GitHub Pages.
- [x] Confirm iPhone Home Screen installation and saved logs after reopening (user verified).
- [ ] Complete a month of personal testing and record usability findings.
- [ ] Verify offline reopening and logging on iPhone.
- [ ] Add editing and backdated pouch entries.
- [ ] Add explicit zero-use day confirmation so unknown days remain distinct from zero.

### Native iOS development and launch
- [ ] Confirm active paid Apple Developer Program membership and renewal date.
- [ ] Create step-by-step Mac development instructions: tooling, React Native/Expo setup, simulator, physical iPhone testing, signing, builds, and submission.
- [ ] Build the native iOS app and provide migration of existing PWA logs.
- [ ] Test through TestFlight; resolve reported issues before launch.
- [ ] Finalize one-time purchase price (working proposal: US $3.99; not finalized).
- [ ] Complete App Store Connect paid-app agreements and required tax/banking setup using the account owner's secure Apple account. Do not store banking information in this repository.
- [ ] Prepare privacy policy, support contact, App Store screenshots, description, and required privacy disclosures.
- [ ] Submit for App Review and release after approval.

### Mobile visual design and animation
- [ ] Choose a consistent visual style, color palette, typography, and spacing system while preserving compact controls and minimal layouts.
- [ ] Design and review one polished native screen before extending the design across the app.
- [ ] Build reusable native components for navigation, buttons, selection states, progress indicators, and chart labels.
- [ ] Improve chart readability and add satisfying, subtle pouch-logging feedback first.
- [ ] Create original matching illustrations, optional pouch characters, and icons as SVG or transparent PNG assets.
- [ ] Explore illustrated onboarding after the core tracking screens are polished; use competitor references for inspiration rather than copying assets.
- [ ] Evaluate Lottie for illustrated character animations; prepare separate artwork layers and animation exports rather than assuming a static generated image is animation-ready.
- [ ] Evaluate react-native-svg for circular indicators and data-driven bars; animate meaningful changes where helpful.
- [ ] Evaluate Reanimated for screen transitions, selection changes, and simple floating, scaling, or fading effects.
- [ ] Add motion after layouts and interactions work, support reduced motion, and ensure charts and states remain accessible without animation or color alone.
- [ ] Use real data and transparent calculations for comparisons; show a community benchmark only when supported by an appropriate dataset.
- [ ] Maintain a true one-time purchase for permanent access, with no subscription or expiring trial (price remains tentative).

### Feedback
- [ ] Add an in-app feedback form with categories: issue, feature request, and other feedback.
- [ ] Choose a submission destination and optional reply contact; obtain consent before attaching logs or diagnostics.

### Reduction, replacements, and cravings
- [x] Add a source-linked introductory resource covering nicotine reduction, cravings, withdrawal and treatment options, distinguishing evidence for pouches, smoking, and smokeless tobacco.
- [ ] Continue reviewing new pouch-specific cessation research and expand the resource when supported.
- [x] Record source links, populations, evidence qualifications, and review triggers in RESOURCE_SOURCES.md.
- [ ] Add optional craving intensity (1–5) and replacement/delay tracking.
- [ ] Add later daily/weekly reflections on a separate screen.
- [ ] Add personal experiment comparisons without implying that observed associations prove causation.

### Broader nicotine tracking and optional sync
- [ ] Support alternative forms of nicotine with product-appropriate units and measurements.
- [ ] Evaluate optional Google login and cloud sync after the local-first trial.

## Quitting nicotine resources

Open Cutting back guide in the header menu for practical guidance on patterns, changes, cravings, withdrawal, and professional support. Original summaries link to CDC, Smokefree, Health Canada, FDA, and Cochrane; evidence limitations are explicit. The guide works offline after updating; external articles need a connection. See [RESOURCE_SOURCES.md](RESOURCE_SOURCES.md) for provenance and review triggers.

## Design instructions

Read [AGENTS.md](AGENTS.md), [DESIGN_GUIDANCE.md](DESIGN_GUIDANCE.md) and the [color theory rules](docs/color-theory-rules.md). This app applies the shared toolkit design and content guidance with an opaque, non-sticky logo header and hamburger dropdown at every screen size. Today, History and Trends stay visible below the header; occasional destinations remain in the dropdown. Tracking uses system UI text for readability; Oswald remains in the wordmark and Merriweather in the resource article. See [the mobile review specification](docs/MOBILE_REVIEW.md) for current layout, typography, chart calculations and Settings organization. Motion reveals and the roadmap are optional patterns and are not enabled here.

## Color palette

The app uses cyan and magenta accents with warm plum dark mode and soft blush light mode. See [docs/COLOR_PALETTE.md](docs/COLOR_PALETTE.md) for exact colors, semantic responsibilities, contrast checks and state behavior. Cyan identifies actions and nicotine data, magenta identifies spending, amber marks daily-target attention, red marks errors, and green is reserved for verified reductions. The menu switch remembers your appearance preference.

## Refresh the installed app

Settings → Update app checks for a service-worker update, refreshes the current app files, and reloads. It requires an internet connection and does not clear localStorage, logs, settings, or backups. There is no need to delete or reinstall the PWA. Export a backup regularly. Older installed versions can receive this Settings action by closing and reopening the app while online.

## Entry notes

In History, expand an entry and choose Edit entry to update its brand, strength, activity and optional note. Purchase entries expose purchase fields and notes. Today’s Recent entries stays read-only. Notes support up to 1,000 characters; exports/restores preserve them, and older backups may omit them.

The resource article’s contents links scroll directly to their section and move focus to the section heading. Reduced-motion preferences disable smooth scrolling.

## Add a pouch entry

On Today, tap anywhere on the Add pouch row. Brand and nicotine per pouch are prefilled from Settings. Adjust them for this entry, optionally choose what you are doing, then tap Save. Saving closes the form and shows Pouch added with Undo for about four seconds before restoring the add icon. Keyboard focus on Undo keeps the feedback available. Cancel discards the unsaved entry. Per-entry changes do not overwrite your default product, and activity starts unspecified to avoid carrying a stale situation forward.

Activities: Working at kiosk, Concentrating on computer, At comedy, At a movie, At home, After eating, Traveling, Taking a break, Socializing, After waking up, Other. Activity is shown in History/Recent entries and included in backups. Existing version-1 entries without activity still work. This is descriptive context, not a diagnosis or treatment recommendation.

## Current visual direction

See [docs/WARM_DIRECTION.md](docs/WARM_DIRECTION.md). Today has no duplicate Recent entries list; open History for records. Trends uses one Measure dropdown. Sudoku break identifies the puzzle; Cutting back guide identifies the article. The approved vivid colors use accessible light/dark variants.
