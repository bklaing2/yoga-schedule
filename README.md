# [Yoga Class Aggregator](https://bklaing2.github.io/yoga-schedule/)

I created this tool for my mom to aggregate class information from multiple yoga studios. It was originally supposed to be a simple schedule, but I was having fun and may have gotten carried away...

## Features

- View class information by day in chronological order
  - Class Name
  - Class Time
  - Instructor Name
  - Studio
- Filter by studio, class, and instructor
- Favorite studios, classes, and instructors _(by right clicking in the sidebar)_
- Filter by favorites

## Implementation Design

The website is designed such that it can easily be hosted on [GitHub Pages](https://docs.github.com/en/pages). Since the data is fairly static, I just prerender the site every night. This side-steps any CORS restrictions--as the API calls now happen in the loader on the server--and removes the need for [TanStack Query](https://github.com/tanstack/query).

Favorites are saved in `localStorage`.

## Technology Choices

- [TSRX](https://tsrx.dev/) _(purely for fun)_
- [SolidJS](https://github.com/solidjs/solid)
- [TanStack Start](https://github.com/tanstack/router) _(prerender enabled)_
- [Tailwind](https://github.com/tailwindlabs/tailwindcss)
- [jsdom](https://github.com/jsdom/jsdom) _(to parse the response of one of the studios)_
