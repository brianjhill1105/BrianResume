# Brian Hill -- Resume Website

**The best way to show you what I can do is to just do it.**

A fully interactive, single-page resume website built as a living proof of concept for the **Associate Web Producer (AI-Assisted)** role at [Anntoine Marketing + Design](https://anntoine.com/) in Hammond, LA. No frameworks. No build tools. No dependencies. Just clean HTML, CSS, and JavaScript -- built with AI.

---

**Live Site:** [brianjhill1105.github.io/BrianResume](https://brianjhill1105.github.io/BrianResume/)

**Source Code:** [github.com/brianjhill1105/BrianResume](https://github.com/brianjhill1105/BrianResume)

---

## Why This Exists

Most applicants send a PDF. I built a website.

Anntoine Marketing + Design is looking for someone who can use AI to build fast, polished web experiences. Rather than just *telling* you I can do that, I decided to *show* you. This site is the resume, the portfolio piece, and the proof of concept -- all in one.

Every section of this site maps to the job requirements: AI fluency, design instincts, technical competence, communication skills, and the ability to ship production-quality work on a deadline. If you are reading this, the proof is already delivered.

## Features

### Content Sections
- **Hero** -- Full-viewport landing with an animated canvas particle network (60 particles with mouse-reactive connections) and a cycling typed-text effect ("Tech Leader. AI Expert. Web Producer.")
- **About** -- Bio, location (Ponchatoula, LA -- local to Hammond), and contact links
- **Experience** -- Interactive vertical timeline spanning 15+ years, from Apple through IT Director at Hood Memorial Hospital
- **Skills** -- Six-card grid covering AI & Automation, Web Technologies, IT Infrastructure, Design Sensibility, Communication, and Problem Solving
- **How I Work** -- Twelve clickable philosophy cards with expand/collapse behavior, each revealing a detailed explanation behind the principle
- **Why Me** -- Seven side-by-side requirement-to-experience mappings that directly address the Anntoine job posting
- **Education** -- Southeastern Louisiana University, Business Administration and Management
- **Contact** -- Email and LinkedIn call-to-action with decorative gradient blobs
- **Footer** -- Copyright and AI-assisted attribution

### Design and UX
- Dark theme with a blue-to-violet gradient accent palette (`#0ea5e9` to `#8b5cf6`)
- Typography: [Inter](https://fonts.google.com/specimen/Inter) for body text, [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) for headings
- CSS custom properties for consistent theming across the entire stylesheet
- Custom `::selection` styling
- Decorative gradient border accents on hover states for cards and timeline items

### Interactivity
- Canvas-based particle animation with mouse repulsion physics, connection lines between nearby particles, and automatic pause/resume via IntersectionObserver (saves resources when the hero is off-screen)
- Typed-text effect that cycles through roles with realistic typing and deleting speeds
- Scroll-triggered fade-up animations with staggered delays using IntersectionObserver
- Sticky navigation with a frosted-glass backdrop blur that darkens on scroll
- Active navigation link highlighting based on visible section
- Smooth scroll with offset compensation for the fixed nav bar
- Expandable philosophy cards with accordion behavior (opening one closes the others)

### Responsive Design
- Fully responsive from 320px to ultrawide displays using CSS Grid, Flexbox, and `clamp()` for fluid typography and spacing
- Mobile hamburger menu with slide-in panel, Escape key to close, and click-outside-to-dismiss
- Dynamic viewport units (`dvh`) for correct mobile browser behavior
- Breakpoints at 768px, 640px, and 480px for progressive layout adaptation
- Timeline and card layouts that gracefully restack on small screens

### Accessibility
- Semantic HTML5 (`nav`, `section`, `footer`, `role` attributes, `aria-label`, `aria-expanded`, `aria-controls`, `aria-hidden`)
- Keyboard accessible: all interactive elements are focusable and respond to Enter and Space keys
- `prefers-reduced-motion` media query that disables all animations and transitions for users who request it
- Screen-reader-friendly: decorative elements are hidden with `aria-hidden="true"`

### Print Support
- Dedicated `@media print` stylesheet that strips backgrounds, converts text to black, hides decorative/interactive elements, displays link URLs inline, and applies `page-break-inside: avoid` to cards and timeline entries

## Tech Stack

| Layer        | Technology                                      |
|------------- |------------------------------------------------ |
| Markup       | HTML5 (semantic, no templating)                 |
| Styling      | CSS3 (custom properties, Grid, Flexbox, clamp)  |
| Behavior     | Vanilla JavaScript (ES5-compatible IIFE)        |
| Fonts        | Google Fonts (Inter, Space Grotesk)             |
| Animation    | Canvas 2D API, CSS keyframes, IntersectionObserver |
| Hosting      | GitHub Pages                                    |
| Development  | Claude Code (AI-assisted)                       |

**Zero frameworks. Zero build tools. Zero npm dependencies. Zero technical debt.**

The JavaScript is wrapped in a single IIFE, uses `'use strict'` mode, and targets broad browser compatibility. The CSS uses progressive enhancement -- `color-mix()` for subtle tints, `backdrop-filter` for the frosted nav, and `dvh` units for mobile viewport handling, all of which degrade gracefully in older browsers.

## Running Locally

There is no build step. Clone the repository and open `index.html` in any modern browser.

```bash
git clone https://github.com/brianjhill1105/BrianResume.git
cd BrianResume
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

Alternatively, use any local server:

```bash
python -m http.server 8000
# Then visit http://localhost:8000
```

## Project Structure

```
BrianResume/
  index.html    # Complete page structure, content, and semantic markup
  styles.css    # All styling: layout, theme, components, responsive, print, reduced-motion
  script.js     # Particle canvas, typed text, scroll animations, nav, hamburger, philosophy cards
  README.md     # This file
```

Three source files. That is the entire application. No hidden configs, no transpilers, no `node_modules` folder. What you see is what ships.

## AI-Assisted Development

This project was built using **Claude Code**, Anthropic's AI-powered development tool. Here is what that means in practice:

- **Conversational development** -- I described what I wanted in plain English: the sections, the design aesthetic, the interactions, the accessibility requirements. Claude Code translated those descriptions into production-ready HTML, CSS, and JavaScript.
- **Iterative refinement** -- The site was not generated in a single pass. It was built through a back-and-forth process: requesting features, reviewing the output, giving feedback, and refining the details until everything was right.
- **Human judgment throughout** -- AI generated the code. I made the decisions. Which sections to include, what content to write, how to structure the narrative, what the visual hierarchy should be, which interactions serve the user vs. which are just noise -- those are all human choices.
- **Quality verification** -- Every feature was tested across viewport sizes, checked for keyboard accessibility, and validated for semantic correctness. AI is a powerful tool, but it still needs a person who knows what "done" looks like.

This is the same workflow the Associate Web Producer role calls for: using AI to accelerate production while applying real expertise to guide the result. The site you see is the direct output of that process.

## Author

**Brian Hill**
- Email: [brianjhill@me.com](mailto:brianjhill@me.com)
- LinkedIn: [linkedin.com/in/brianjhill](https://www.linkedin.com/in/brianjhill/)
- Location: Ponchatoula, Louisiana (minutes from Hammond)

---

*Built with AI. Guided by 15 years of experience. Shipped as proof that I am ready for what comes next.*
