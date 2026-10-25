# Warm vivid direction

The user approved the cyan/magenta, warm-plum and soft-blush preview for deployment. This document supersedes earlier muted-blue palette and repeated-tab treatments.

## Interface

- Remove Recent entries from Today, including its read-only rendering branch and related CSS. Keep History, weekly grouping, the full editor, notes, saved records and backups.
- Today uses a quiet theme surface containing its date, totals and Add pouch action. Spending uses the same inset, equal two-column grid and aligned gutters. Main totals share a baseline and size; spending remains secondary.
- Keep text readable and controls compact. The Add pouch row stays available after saving; independent confirmation and Undo remain.
- Primary Today/History/Trends navigation has filled cyan selection. Inside Trends, replace the second row of tabs with a labelled native Measure dropdown. Preserve week on view changes and restore focus to the dropdown.
- Keep actual calendar-week totals, logged-day averages, shared chart scales, count reveals and horizontal activity bars.
- Rename Fight the craving to Sudoku break, with a description identifying the puzzle and elapsed timer. Rename Quitting nicotine to Cutting back guide, identifying it as an article. Preserve the source-linked article and game mechanics.
- Use small amber context for the guide; do not make the largest figures a warning color. Logging remains available.
- Keep Material interface icons. No external icon font, animation or new account/database dependency.

## Data

This is a presentation and content-label update. No log deletion, schema migration, backup replacement or preference-key change. Never publish the user's exports or screenshot records as seed data. The live app still starts empty on a new device.

## Checks

Run every test in tests/. Coverage includes old/custom backups, activity/note preservation, theme persistence/storage failure, independent Undo, custom products, Sudoku uniqueness, calendar weeks, exact chart totals, stable scales, measure-selector focus/week preservation, removed duplicate Recent UI and both theme color pairs.

Native iPhone PWA spacing, larger text, actual touch and true offline reopening remain for user review after Settings → Update app.
