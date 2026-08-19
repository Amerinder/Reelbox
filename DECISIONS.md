# Reelbox — Decisions

## 1. Why this frontend approach?

For the prototype, adding a movie is deliberately simple: choose a poster, fill in a few details, and see it appear in the collection immediately. The poster preview uses the browser's `URL.createObjectURL()` API, while the movie is kept in React state for the current session.

I chose this frontend-only approach instead of building an upload API or database because the main goal of this project is to demonstrate the product experience and UI. A backend would add accounts, storage, authentication, and additional failure states without improving the core interaction of adding a personal movie to the collection.

## 2. What did you trade off?

I prioritized one polished personal collection experience instead of building separate, fully featured pages for every category. The prototype still supports searching the library, favoriting a film, managing a watchlist, creating collections, viewing movie details, and adding a poster.

With a full week, I would extend the same design system into a more complete product with persistent user accounts, cloud storage for uploaded posters, richer collection management, and more detailed movie discovery.

## 3. Where did you use AI?

I used AI to move faster on the first pass of the component structure, CSS, and copy options. I personally reviewed and edited the generated output, refined the value proposition to make it more direct, kept the supplied poster assets rather than generating replacements, and removed anything that could imply unverified traction, such as testimonials, customer logos, or platform-wide user numbers.

I also verified the responsive behavior by design. The mobile layout adapts the movie shelves, hides desktop-only navigation where appropriate, and constrains the animated poster wall so it does not create horizontal scrolling.
