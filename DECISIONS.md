# Reelbox — Decisions

## 1. Why this ingestion strategy?

For the prototype, adding a movie is deliberately simple: choose a poster, fill in a few details, and see it appear in the collection immediately. The poster preview uses the browser’s `URL.createObjectURL()` API and the movie is kept in React state for that session.

I chose this over building an upload API or database because the important thing to demonstrate here is the feeling of adding something personal to the collection. A backend would add setup, accounts, storage, and failure states without making that core moment better for a homepage project.

## 2. What did you trade off?

I put the time into one strong collection experience instead of trying to build separate, fully featured pages for every category. The result still lets someone search their library, favourite a film, manage a watchlist, create a collection, inspect details, and add a poster.


## 3. Where did you use AI?

I used AI to move faster on the first pass of the component structure, CSS, and copy options. I then edited the value proposition to be more direct, kept the supplied poster assets rather than generating replacements, and removed anything that would imply unverified traction—such as testimonials, customer logos, or platform-wide user numbers.

I also reviewed the responsive rules by design: the mobile layout reduces the shelf to three columns, hides desktop-only navigation, and constrains the animated poster wall so it does not push the page horizontally.
