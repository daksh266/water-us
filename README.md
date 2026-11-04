# Water Us

A small web app that tracks when your houseplants need water. Each plant has a card with a **Happy** or **Thirsty** badge, a water level, and a **Water now** button.

It is plain HTML, CSS, and JavaScript. There is nothing to install and nothing to build.

## Features

- Four pages: Home, Plants, Care guide, and About, with the same header, navigation, and footer on each.
- Real dates. Each plant remembers the day you last watered it, so it gets thirsty as days pass.
- Your progress is saved in your own browser, and **Reset progress** puts every plant back to where it started.
- A care guide that shows how often each plant needs water and when the next watering is due.
- A skip link, page landmarks, and a layout that works on a phone.

This repository is the practice project for the course *AI-Assisted GitHub Fundamentals*. You will work on it the way a team works on any project: from an issue, through a branch and a pull request, to a merge, with GitHub Copilot helping at each step.

## Get started

1. **Fork this repository.** Untick **Copy the main branch only** so that you get every branch.
2. **Turn on Issues in your fork.** In **Settings → General → Features**, tick **Issues**.
3. **Turn on GitHub Pages** so you can see the app: go to **Settings → Pages**, set **Source** to **Deploy from a branch**, and choose the `main` branch and the `/ (root)` folder.
4. Open the **Issues** tab and follow the course.

## How the app decides a plant is thirsty

A plant is **Thirsty** when the number of days since it was last watered is the same as or more than its watering interval. Clicking **Water now** sets the last watered day to today.

The list in `js/features/plants/data/plants.js` is where every plant starts. The first time you visit, a plant with `daysSinceWatered: 15` counts as watered 15 days before that visit. After that, the app remembers the real date for each plant.

## Care guide

| Plant | Water every |
| --- | --- |
| Spike the Cactus | 14 days |
| Fernando the Fern | 3 days |
| Basil | 2 days |
| Aloe Vera | 10 days |

## Project layout

```
index.html                           the Home page
plants.html, care.html, about.html   the other three pages
css/                                 the styles, one file for each part of the site
images/                              the background artwork
js/
├── pages/                           one small script for each page
├── features/
│   ├── home/                        the Home page hero
│   ├── care/                        the care guide table
│   └── plants/
│       ├── models/                  what a plant is
│       ├── data/plants.js           the list of plants
│       ├── rules/plant-care.js      when a plant is thirsty, and the wording on the cards
│       ├── state/                   the plants, watering, and saving the dates in the browser
│       └── components/              the plant list and the plant card
└── shared/                          the date helpers, the scene, and the falling rain
tests/                               tests for the dates, the rules, and the saving
scripts/check-plants.mjs             a check you can run on your computer with Node
```

## Try it on your computer

The pages use JavaScript modules, which browsers only load from a web server. If you want to preview the app locally, run this in the project folder and open http://localhost:8000:

```
python3 -m http.server 8000
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
