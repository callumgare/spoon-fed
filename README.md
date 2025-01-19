# Spoon Fed
*The Low-Spoons Meal Planner*

**Accessible at [spoonfed.cals.cafe](https://spoonfed.cals.cafe).**

Spoon Fed is a little web app that allows you to sync your [Paprika](https://www.paprikaapp.com/) recipes and then pick some to receive a list of ingredients. Paprika is a fantastic app but I personally find the meal planing feature a little ridged for my tastes. Especially if I'm already feeling low on spoons I find myself quickly feeling overwhelming trying weekly meal planning when I have to pick breakfast, lunch and dinner for each day.

To help with this I threw together Spoon Fed, which doesn't even give you the option to schedule in meals by the day. You simply pick a few meals you think might be good to eat that week. Once you've done a grocery shop for all the ingredients you can figure out which meals you want on a day-by-day basis.

## Setup

Make sure to install dependencies:

```bash
npm install
```

Then setup the following required environment variables. If running locally then the file `.env.example` can be copied to `.env`.

## Environment Variables
  - **CACHE_URL** (or **CACHE_KV_URL**)\
    To reduce load on Papika's servers, API requests are cached. CACHE_URL configures where they're cached. It can either be a local file path (e.g. `/tmp/spoon-fed/cache.json`) or a Redis connection string (e.g. `redis://user:pass@localhost:6379`). If none is given then an in-memory cache is used instead.

## Development Server

Start the development server on `http://localhost:3000`:
```bash
npm run dev
```

## Production

Build the application for production:
```bash
npm run build
```

Locally preview production build:
```bash
npm run preview
```

Start the production server:
```bash
npm run start
```

## Credits
Logo based on the spoon and frame doodle drawings from [Khushmeen Sidhu's Doodle icons set](https://khushmeen.com/icons.html). The placeholder image used for recipes without an image or that have a broken image is the [Knife and Fork Twitter Emoji icon](https://iconscout.com/free-icon/fork-and-knife-cooking-kitchen-emoj-symbol).

## Future plans
- Add to recipe selection view:
  - sorting
  - grouping
  - filtering
- Move to parse-ingredient library to remove headers
- Use key for indicating which ingredients are from which recipes
- Maybe use a third-party library to get more ingredients info
  - Show images
  - Group by aisle
- Maybe provide an option to use without Paprika by allowing users to sign-up for local accounts and save their recipes directly in Spoon Fed, emulating the Paprika API to use the recipes.
- Update to work offline