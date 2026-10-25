# Color Theory & Design System Rules

## Purpose

Apply color intentionally across web interfaces to support brand identity, readability, accessibility, visual hierarchy, usability, and maintainability.

These rules apply to new designs, existing interfaces, component libraries, and redesigns.

**Core principle:** Every color decision should have a purpose. A visually attractive palette is not necessarily an effective or accessible interface.

## 1. General Principles

- Understand the purpose of an interface before recommending color changes.
- Evaluate color in relation to user goals, content, surrounding elements, and interaction patterns.
- Never assume a color is appropriate simply because it matches the brand.
- Distinguish decorative color from functional color.
- Preserve consistency without requiring every element to look identical.
- Avoid introducing new colors when existing colors or their variations can accomplish the same goal.
- Prefer controlled experimentation over changing multiple properties simultaneously.
- Treat color theory guidelines as useful starting points, not universal laws.

## 2. Color Fundamentals

Evaluate three primary color properties:

**Hue:** The color family, such as pink, blue, green, or purple.

**Saturation:** The intensity or vividness of a color.

**Value / Lightness:** How light or dark a color appears.

Understand common color variations:

- **Tint:** A color made lighter by mixing with white.
- **Shade:** A color made darker by mixing with black.
- **Tone:** A color made less vivid by mixing with gray.

When adjusting an interface, consider whether changing saturation, lightness, or contrast would solve the problem before introducing a new hue.

Do not assume that lighter colors are always less prominent. Evaluate contrast against surrounding surfaces.

## 3. Brand Identity and Color Psychology

- Define the personality and associations a brand intends to communicate.
- Use color to reinforce those qualities rather than relying on color to communicate them alone.
- Recognize that color associations vary by culture, context, industry, and personal experience.
- Avoid treating color psychology as a set of guaranteed emotional responses.
- Consider audience expectations and the type of experience being designed.
- Distinguish the brand’s signature color from the colors used for particular interface actions.

A brand color does not automatically need to be the primary button color.

Brand expression can appear through typography highlights, decorative shapes, illustrations, icon backgrounds, borders, and other intentional details.

## 4. Color Harmony

Evaluate relationships between colors using established harmony models:

- **Complementary:** Hues opposite each other on the color wheel.
- **Analogous:** Neighboring hues.
- **Triadic:** Three hues approximately equally spaced around the wheel.
- **Split-complementary:** One hue combined with the two hues adjacent to its complement.
- **Square:** Four hues approximately equally spaced around the wheel.

Rules:

- Use color harmony to explore possible relationships, not to guarantee a successful interface.
- Assign responsibilities to colors before distributing them throughout a design.
- Avoid giving every hue equal prominence unless the composition intentionally calls for it.
- Adjust saturation and lightness to manage competing colors.
- Evaluate colors alongside typography, imagery, spacing, and background surfaces.
- Do not confuse color harmony with accessibility contrast.

## 5. Palette Size

There is no universal minimum or maximum number of colors a website should use.

When evaluating palette size:

1. Identify the existing foundational colors.
2. Determine their intended responsibilities.
3. Review how effectively they are being used.
4. Explore existing tints, shades, and tones.
5. Identify any functional or expressive need that remains unmet.
6. Introduce additional hues only when there is a defensible reason.

A five-color foundational palette does not mean the website must use only five CSS color values.

A design system may require additional values for surfaces, text, borders, feedback, interactive states, and accessibility.

A colorful, expressive website can use many hues successfully. A restrained interface can use very few.

Neither approach is inherently superior.

## 6. Color Distribution

Use the 60–30–10 rule as an optional composition guideline:

- Approximately 60% dominant color.
- Approximately 30% supporting color.
- Approximately 10% accent color.

Do not enforce these percentages mechanically.

Evaluate three separate properties:

**Coverage:** How much visible space a color occupies.

**Frequency:** How often a color appears.

**Prominence:** How strongly the color attracts attention.

A color occupying little space can still dominate attention through saturation, contrast, repetition, or placement.

Before introducing new colors to a repetitive design, investigate whether the existing palette needs redistribution.

## 7. Visual Hierarchy

Color must support the intended order of attention.

Evaluate:

- Contrast against surrounding surfaces.
- Saturation and lightness.
- Element size.
- Position and alignment.
- Frequency and repetition.
- Proximity and grouping.
- Typography and spacing.
- Competing imagery.
- User expectations and task priorities.

Use the squint test as an informal way to inspect visual prominence.

Do not treat the squint test as proof of usability. Validate important assumptions through user observation or testing when practical.

When visual hierarchy is ineffective:

1. Identify what attracts attention first.
2. Identify what users should notice first.
3. Form a hypothesis about the mismatch.
4. Change one relevant variable.
5. Evaluate the result.
6. Repeat if necessary.

Do not assume the visually dominant element is wrong without understanding the user’s actual goal.

## 8. Decorative vs. Functional Color

Distinguish between:

**Brand expression:** Color used to communicate identity or personality.

**Functional emphasis:** Color used to identify actions, states, or important information.

Decorative elements should not unintentionally compete with important functional elements.

When decorative elements are overly prominent, consider:

- Reducing saturation.
- Adjusting lightness.
- Reducing size.
- Changing placement.
- Reducing repetition.
- Increasing separation from functional elements.
- Using subtler variations of the same hue.

Preserve brand personality while improving the hierarchy.

## 9. Accessibility and Contrast

Follow applicable WCAG requirements.

For WCAG AA:

- Normal text generally requires at least 4.5:1 contrast.
- Large text generally requires at least 3:1 contrast.
- Essential non-text UI indicators and graphical objects generally require at least 3:1 contrast against relevant adjacent colors, where the WCAG criterion applies.

Large text means at least 18 pt regular or 14 pt bold, approximately 24 CSS px regular or 18.7 CSS px bold.

Additional rules:

- Test actual foreground/background combinations.
- Do not assume a lighter or darker variation automatically improves contrast.
- Do not rely on color alone to communicate information.
- Use labels, text, icons, patterns, or other cues when needed.
- Check interactive states separately.
- Test focus indicators against adjacent colors.
- Recognize that passing a contrast test does not guarantee readability or usability.
- Consider color-vision differences and real-world viewing conditions.

Color accessibility is not a one-time palette approval. It must be evaluated where colors are actually used.

## 10. Color Vibration and Visual Comfort

Avoid unnecessarily uncomfortable combinations of highly saturated colors, particularly when they are directly adjacent.

When evaluating visual vibration:

- Examine the relationship between neighboring colors.
- Consider reducing saturation.
- Consider adjusting lightness.
- Introduce visual separation when useful.
- Evaluate whether the combination remains consistent with the intended brand expression.
- Recheck accessibility after modifying colors.

**Important:** Measurable contrast and visual comfort are separate considerations.

A combination can pass WCAG contrast requirements and still be visually uncomfortable.

## 11. Design Token Architecture

Prefer a structured token system when it improves consistency and maintainability.

### Primitive tokens

Describe raw color values without assigning interface responsibilities.

Examples:

```css
--pink-500: #EC4899;
--near-black: #111111;
--white: #FFFFFF;
--purple-500: #9333EA;
```

### Semantic tokens

Describe the role a color performs.

Examples:

```css
--brand-primary: var(--pink-500);
--text-primary: var(--near-black);
--surface-primary: var(--white);
--feedback-error-text: var(--red-700);
```

### Component tokens

Describe styling decisions for specific components.

Examples:

```css
--button-primary-bg: var(--brand-primary);
--button-primary-text: var(--near-black);
--nav-link-color: var(--brand-primary);
```

Token architecture should distinguish:

- What the color is.
- What responsibility the color serves.
- How a particular component uses that color.

Do not introduce additional token layers without a meaningful maintainability benefit.

## 12. Token Dependencies

- Elements sharing a color do not necessarily share a responsibility.
- Do not create token dependencies solely to eliminate duplicated color references.
- Allow different responsibilities to evolve independently.
- Reference shared semantic tokens when elements should intentionally follow the same design decision.
- Reference primitives directly when independence from a broader semantic role is intentional.
- Understand that token changes propagate only through established references.

For example, error feedback should not automatically inherit the brand color simply because both currently use pink.

A brand redesign must not unintentionally change critical feedback colors.

## 13. Interactive States

Define and evaluate relevant component states:

- Default.
- Hover.
- Focus / focus-visible.
- Active / pressed.
- Disabled.
- Selected, where applicable.

Each state should communicate useful information.

Rules:

- Ensure interactive feedback is perceptible.
- Preserve appropriate foreground/background contrast.
- Do not rely exclusively on hover.
- Provide visible keyboard focus indicators.
- Do not remove browser focus indicators without an accessible replacement.
- Do not assume every state requires a different hue.
- Avoid using color alone to distinguish critical states.
- Evaluate disabled-state usability and applicable accessibility requirements.

When changing a button background, review its text, border, icon, and focus styles as well.

## 14. Contextual Focus Indicators

Focus indicators must remain visible in their actual context.

A single focus color may not work on every background.

Consider contextual tokens such as:

```css
--focus-ring-on-light: var(--near-black);
--focus-ring-on-dark: var(--white);
```

Rules:

- Test focus indicators against surrounding surfaces.
- Check whether the ring remains distinguishable from the component itself.
- Consider outline thickness, offset, and shape.
- Use two-color indicators or other robust treatments when necessary.
- Verify applicable WCAG focus visibility and appearance requirements.

Do not assume a focus indicator is accessible merely because its color appears somewhere in the palette.

## 15. Scoped Overrides and Component Variants

Use scoped overrides when styling should change because of a component’s context.

Example:

```css
.hero {
  --button-primary-bg: var(--pink-500);
}
```

Use reusable component variants when multiple instances share the same styling responsibility.

Example:

```css
.button--featured {
  background: var(--button-featured-bg);
}
```

Rules:

- Prefer meaningful variant names over color-specific names.
- Avoid names such as `.button--pink` when the color may change.
- Prefer names such as `.button--featured`, `.button--secondary`, or `.button--destructive` when they accurately describe intent.
- Avoid fragile selectors dependent on incidental DOM positions.
- Use component variants when consistency across multiple contexts is required.
- Use contextual overrides when the surrounding environment legitimately changes styling requirements.

## 16. Separate Meaning From Emphasis

An action’s meaning and visual importance are different dimensions.

For example:

```html
<button
  data-variant="destructive"
  data-emphasis="secondary">
  Delete account
</button>
```

`data-variant` describes the action’s semantic type.

`data-emphasis` describes its visual priority.

Do not assume destructive actions should automatically receive the strongest visual emphasis.

Avoid assigning the same variant to components simply because they currently share a color.

## 17. Destructive Actions

Destructive actions should be recognizable without unnecessarily encouraging accidental activation.

Rules:

- Use clear, specific labels.
- Communicate consequences.
- Avoid relying exclusively on red or another warning color.
- Consider restrained visual emphasis when appropriate.
- Provide confirmation for consequential or irreversible actions when justified.
- Avoid redundant confirmation dialogs that add friction without improving understanding.
- Consider recovery, undo, or additional safeguards when appropriate.

Visual prominence should reflect user goals and interaction consequences, not merely the severity of an action.

## 18. Brand Changes and Theme Evolution

When updating a brand color:

1. Identify the primitive color being introduced or changed.
2. Identify the semantic brand token.
3. Inspect which tokens reference that brand token.
4. Determine which components should follow the change.
5. Identify components that should remain independent.
6. Update the appropriate references.
7. Verify accessibility and hierarchy after the change.

Do not redefine a primitive color merely to change one component’s appearance.

A brand-color update should propagate intentionally, not indiscriminately.

## 19. Human-in-the-Loop Review Process

When reviewing or modifying an existing interface, the AI assistant must work collaboratively with the human designer.

### Step 1 — Understand

Ask what the page or component is intended to accomplish.

Identify the primary user goal and the intended attention order.

### Step 2 — Inspect

Review the existing palette, token structure, color roles, distribution, contrast, and interaction states.

Do not assume that an apparent visual problem requires new colors.

### Step 3 — Diagnose

Identify the most important potential issue.

Explain whether it concerns:

- Brand identity.
- Color harmony.
- Palette size.
- Distribution.
- Visual hierarchy.
- Accessibility.
- Token architecture.
- Interaction states.
- Semantic meaning.

### Step 4 — Propose

Recommend the smallest useful change first.

Explain the expected effect and any trade-offs.

Distinguish established accessibility requirements from subjective design judgments.

### Step 5 — Obtain Approval

Do not make broad color-system changes without human approval.

Present the proposed change and allow the human designer to accept, reject, or modify it.

### Step 6 — Implement

Make approved changes while preserving existing design-system conventions where appropriate.

Avoid introducing unnecessary tokens, variants, or dependencies.

### Step 7 — Validate

Review the updated interface for:

- Intended visual hierarchy.
- Accessible contrast.
- Keyboard focus visibility.
- Interactive-state consistency.
- Brand consistency.
- Token dependencies.
- Responsive layouts.
- Unintended changes elsewhere.

### Step 8 — Reflect

Ask whether the change improved the intended user experience.

If the result remains unsatisfactory, revisit the hypothesis rather than making arbitrary additional changes.

## 20. AI Assistant Operating Rules

When assisting with web design or implementation:

1. Do not make color decisions based on aesthetics alone.
2. Do not blindly apply the 60–30–10 rule.
3. Do not assume a larger palette is worse than a smaller palette.
4. Do not add colors without considering existing variations.
5. Do not conflate brand colors with functional action colors.
6. Do not use color as the sole means of communicating meaning.
7. Do not assume semantic tokens automatically guarantee accessibility.
8. Do not couple unrelated components simply because they share a color.
9. Do not introduce component variants solely to represent fixed hues when a semantic name would be more appropriate.
10. Do not prioritize destructive actions automatically.
11. Do not make multiple unrelated design changes without a clear reason.
12. Explain recommendations in terms of user goals, hierarchy, accessibility, and maintainability.
13. Distinguish hypotheses from verified usability findings.
14. Ask for human input when a decision depends on brand intent or user priorities.
15. Favor understandable, maintainable systems over unnecessary abstraction.

## Guiding Principle

Color is not merely decoration. It is a communication tool.

An effective color system should help users understand:

- What belongs together.
- What deserves attention.
- What can be interacted with.
- What an action means.
- What feedback the interface is providing.
- Where they are in an interaction.
- How to complete their intended task.

The goal is not to maximize the number of colors, enforce arbitrary ratios, or create the most visually striking interface.

The goal is to make color decisions that are intentional, accessible, consistent, maintainable, and supportive of the user’s experience.
