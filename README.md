# Pouch Tracker

Compact, offline-first PWA for personal nicotine-pouch logging. No accounts, database, or analytics services. Starts with empty logs. Defaults to Zyn 6 mg until changed in Settings.

## Features
Pouch logging and undo; labeled mg totals; actual tin purchases; calendar-week (Monday start) and month spending; history and deletion; seven-day trends; default product settings; validated JSON export/restore.

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

### Feedback
- [ ] Add an in-app feedback form with categories: issue, feature request, and other feedback.
- [ ] Choose a submission destination and optional reply contact; obtain consent before attaching logs or diagnostics.

### Reduction, replacements, and cravings
- [ ] Research evidence-supported techniques for nicotine reduction, replacements, and craving management/treatment using authoritative sources and primary research.
- [ ] Record source links, evidence quality, studied nicotine product/population, and limitations; distinguish pouch-specific findings from smoking/vaping evidence.
- [ ] Add optional craving intensity (1–5) and replacement/delay tracking.
- [ ] Add later daily/weekly reflections on a separate screen.
- [ ] Add personal experiment comparisons without implying that observed associations prove causation.

### Broader nicotine tracking and optional sync
- [ ] Support alternative forms of nicotine with product-appropriate units and measurements.
- [ ] Evaluate optional Google login and cloud sync after the local-first trial.
