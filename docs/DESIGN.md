# Blog Design Guidelines

This document defines the long-term visual and interaction baseline for the blog. It draws from Vercel's [design.md](https://vercel.com/design.md), especially its content-first hierarchy, shared grids, restrained boundaries, and responsive verification, without copying Vercel's brand expression.

## Design Direction

**A quiet technical journal.** The site should feel like a personal technology magazine that keeps growing: rational, warm, and comfortable to read over time. Its memorable traits are Song/Ming-style display type, generous space, olive details, and a clearly structured article index.

- Let readers understand what the author writes before presenting site features.
- Establish hierarchy through typography, alignment, and space. Use borders only for meaningful grouping.
- Preserve an editorial character. Do not resemble a generic dashboard, marketing landing page, or card wall.
- Decoration must serve the content. Avoid gradients, glows, glass effects, simulated paper, and purposeless motion.
- Keep the hierarchy equivalent across light and dark themes. Dark mode is not a separate product.

## Color

Use semantic variables throughout the interface. Components must not contain theme-specific color literals.

| Role | Warm light | Graphite dark | Purpose |
| --- | --- | --- | --- |
| `canvas` | `#EFECE4` | `#101211` | Outer page background |
| `surface` | `#FAF8F3` | `#191C1A` | Primary content canvas |
| `text` | `#171814` | `#ECEDE8` | Headings and body copy |
| `muted` | `#65675F` | `#A5AAA2` | Dates, summaries, and supporting information |
| `line` | `#D9D5C9` | `#363A36` | Dividers and necessary boundaries |
| `accent` | `#3F6335` | `#B1C778` | Links, current states, and short decorative rules |
| `accent-soft` | `#EFF2E8` | `#22281F` | Low-emphasis featured content |

Constraints:

- Body text and its background must meet WCAG AA contrast.
- Reserve olive for actions, current states, and a small amount of emphasis. Do not use it as a large color field.
- Never communicate state through color alone. Add text, an icon, or a structural cue.
- Use shadows only to separate the wide-screen content canvas from the outer background. Keep them neutral and subtle. Prefer a border over a shadow in dark mode.

## Typography and Copy

- Display headings, article headings, and long-form Chinese text: `Noto Serif SC`, falling back to `Source Han Serif SC` and `serif`.
- Navigation, labels, dates, and Latin interface text: the bundled `Atkinson Hyperlegible`, with `Noto Sans SC` and `sans-serif` for Chinese fallback.
- Code: a monospace family. Apply it only to code, commands, paths, and short identifiers.
- Self-host any new web font, use `font-display: swap`, and include only the weights that the site uses.

Recommended sizes:

| Role | Wide screens | Mobile | Notes |
| --- | --- | --- | --- |
| Home statement | `clamp(1.75rem, 3vw, 2.75rem)` | `clamp(1.5rem, 7vw, 2rem)` | Typewriter text with a stable line box |
| Page title | `clamp(2.25rem, 4vw, 3.75rem)` | `clamp(2rem, 8vw, 2.75rem)` | One per page |
| Section title | `1rem` | `0.95rem` | Grouped with rules on both sides |
| Body | `1.0625rem` | `1rem` | Line height between 1.75 and 1.9 |
| Summary | `0.9375rem` | `0.875rem` | Never smaller than 14px |
| Metadata | `0.8125rem` | `0.75rem` | Use tabular numerals for dates |

Keep prose near 60–68 Latin characters or about 34 full-width Chinese characters per line. Inspect major heading wraps manually and avoid leaving one character on its own line.

## Grid and Spacing

- Use a 12-column grid on wide screens, 8 columns on tablets, and 4 columns on mobile.
- Keep the page canvas edge-to-edge at every width. Do not enclose the site in a card, rounded frame, or page-level shadow.
- Limit the main content area to approximately `1080px`. Keep long-form prose in a narrower reading column.
- Base spacing on `4px`. Prefer 8, 12, 16, 24, 32, 48, 64, and 96px.
- Give each gap one owning container. Do not stack child margins to repair layout.
- Align peer content to shared edges, baselines, and internal spacing. Every element needs an alignment relationship.

## Page Structure

### Header

- Use `Cao Xin 的小站` as the document and metadata title. Place the `LANTERNCX` author mark on the left, using letter spacing to make it quiet but recognizable.
- Keep the header attached to the top edge while scrolling, with an opaque or lightly translucent theme surface that preserves legibility.
- On wide screens, center links to Home, Categories, Friends, and About. Categories lead to the archive; Note remains one category rather than a primary destination. Place search and theme controls on the right.
- On mobile, keep the author mark, search, theme, and menu buttons in the header. Move the navigation links into the menu.
- Show the current page with both a text state and an underline or boundary cue.
- Keep interaction targets at least `44 × 44px` and make keyboard focus clearly visible.

### Home Introduction

- Use a modest typewriter statement as the only visual protagonist. Preserve the author's established multilingual welcome and quotation captions; do not replace them with invented summaries of the blog.
- Match the established Typewriter.js rhythm: loop continuously, pause for 2500ms after each phrase, then delete it before the next phrase.
- Preserve the original hero's content: the author avatar, typewriter, and GitHub, Bilibili, and X links. Present them in the theme's flat light/dark palette without a background image. Do not add explanatory copy or a reading call to action beneath the typewriter.
- Keep the hero fixed behind the document while the article index scrolls over it. This sticky depth effect replaces script-driven translation.
- Keep the hero shorter than the viewport and visually quiet so it introduces the author without delaying access to recent articles.

### Article Index

- Build each section heading from a label and rules on both sides to create editorial rhythm.
- On wide screens, arrange each row as date / title and summary / topic, separated by a fine rule.
- On mobile, place the date and topic in one metadata row, followed by the title and summary.
- Give every recent entry a short, two-line content preview. Prefer the authored description; otherwise derive a clean excerpt from the opening prose.
- Make entry titles visibly dominant over previews through display type, size, and weight; dates and categories remain supporting metadata.
- If the whole row is interactive, preserve a real link and keyboard focus. Do not simulate links with JavaScript.
- Paginate the homepage chronologically with eight articles per page. Keep the first page at `/` and use `/page/{number}/` for later pages. Use borderless page numbers with previous and next chevrons, collapsing distant pages behind an ellipsis.

### Featured Entry

- Use `accent-soft` for one low-intensity highlight. Only one featured region should appear on a page.
- Arrange the label, title, summary, and action horizontally on wide screens and as a natural vertical flow on mobile.
- Use a leaf or similar icon only when it communicates “featured,” never as repeated decoration.

### Categories

- Organize the archive chronologically by month. Give each entry the authored description, or an excerpt from its opening content when no description exists. Show the total article count as the only supporting copy in its header.
- Keep category filtering in a floating tray anchored 40px from the archive timeline's right edge, outside its layout flow. At the top of the archive, place it below the first visible month heading; as the page scrolls, let it rise only until it is vertically centered. Open it automatically on wide screens.
- On mobile, use a neutral icon-only bottom button that opens an independent category panel centered in the viewport. Move the button above the footer as the footer enters the viewport. Choosing a filter or tapping outside closes the panel.
- Use the first-level content folder names verbatim, preserving their English spelling and capitalization. Keep the filter typographic rather than presenting categories as pills.

### Article Page

- Group the title, publication date, topic, and summary into a compact article header.
- Prioritize uninterrupted reading. Add a table of contents only when the article length warrants it.
- Images, tables, and code blocks may escape the prose measure but must remain inside the main content boundary.
- Preserve semantic table markup. On narrow screens, recompose first and allow local horizontal scrolling only when reflow is not practical.
- Distinguish quotations and callouts with a boundary and minimal background change. Do not nest cards.

### Footer

- Keep the footer to one or two lines: `© 2024-2026 Cao Xin`, a short phrase, and RSS and email links. Use `caoxin@xysu.tech` for email.
- Allow wrapping on mobile while retaining adequate interaction targets.
- End the page quietly. Do not repeat the full navigation or topic list.

## Responsive Behavior

Choose breakpoints according to content pressure. Verify at `360px`, `768px`, and `1280px` as baseline widths.

- `≤ 720px`: use 4 columns, collapse navigation, stack every split section, move article metadata above the title, and use 20px horizontal page padding.
- `721–1099px`: use 8 columns, preserve the full content hierarchy, reduce outer space, and never shrink text to retain a desktop arrangement.
- `≥ 1100px`: use 12 columns, an edge-to-edge canvas, and full navigation.
- Do not hide essential content to fit a small screen. Prevent page-level horizontal scrolling and keep body copy at 16px or larger.
- Recompose naturally after an orientation change. Do not rely on fixed heights.

## Light and Dark Themes

- Follow `prefers-color-scheme` on the first visit and persist an explicit user choice.
- Put the theme control beside search on wide screens and inside the mobile menu. Give it a readable name and visible focus.
- Theme switching changes semantic colors only. It must not change type size, spacing, information hierarchy, or component position.
- Apply a stored theme before the page paints to avoid a flash of the wrong theme.
- Declare the matching `color-scheme` for native controls.
- Check body copy, links, dividers, code, image boundaries, focus, and selected text in both themes.

## Interaction and Motion

- Keep most of the experience still. Reserve continuous motion for the home typewriter; create depth with native sticky positioning rather than a scroll listener.
- Keep state transitions between 120 and 180ms with standard easing. Avoid bounce, scroll reveals, and motion elsewhere in the reading flow.
- Respect `prefers-reduced-motion`. Show a complete static hero statement and disable parallax when reduced motion is requested.
- Use color and underline changes for link hover. Do not move surrounding content or change layout.

## Content and Accessibility

- Use semantic `header`, `nav`, `main`, `article`, `section`, and `footer` landmarks.
- Give each page one primary heading and preserve heading order.
- Provide a skip link to the main content.
- Give icon buttons accessible names and hide decorative icons from assistive technology.
- Make navigation, search, menus, and theme controls fully operable by keyboard. Focus must never be hidden or trapped.
- Give images context-appropriate alternative text. Use empty alternative text for purely decorative images.
- Use machine-readable dates while keeping their visual format concise and consistent.

## Acceptance Checklist

Before handing off an interface, confirm that:

- Warm light and graphite dark themes preserve equivalent hierarchy and switch without a flash of the wrong theme.
- The page has no horizontal overflow, overlap, or orphaned Chinese characters at 360px, 768px, and 1280px.
- The first viewport clearly communicates the author, subject matter, and primary reading path.
- The header remains attached to the top edge, and the page has no outer card or framed canvas.
- The typewriter keeps a stable layout while cycling, the hero remains fixed behind scrolling content, and both become static under reduced motion.
- Every interaction works with a keyboard, focus is visible, and touch targets are at least 44px.
- Body text and key controls meet WCAG AA contrast, and the experience remains complete with motion disabled.
- The page contains no purposeless cards, repeated emphasis, decorative icons, or effects that compete with the content.
