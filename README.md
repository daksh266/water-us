<p align="center">
  <img src="images/logo.svg" alt="Water Us: keep your houseplants happy" width="560">
</p>

<p align="center">
  A small website that tells you which houseplants are thirsty.<br>
  Plain HTML, CSS, and JavaScript. Nothing to install and nothing to build.
</p>

This is the practice project for the course *AI-Assisted GitHub Fundamentals*. You will change it the way a team changes any project: from an issue, through a branch and a pull request, to a merge, with GitHub Copilot helping at each step.

## Preview

| Home | Plants | Care guide |
|:-:|:-:|:-:|
| <img src="images/preview-home.jpg" alt="The Home page, with a leafy background and a Get started button" width="290"> | <img src="images/preview-plants.jpg" alt="The Plants page, with a card for each plant" width="290"> | <img src="images/preview-care.jpg" alt="The Care guide page, with a table of watering schedules" width="290"> |

Press **Water now** and the rain falls, the plant perks up, and the day is saved in your browser. Plants get thirsty again as real days pass.

## Get started

1. **Fork this repository.** Untick **Copy the main branch only**, so that you get every branch.
2. **Turn on Issues** in your fork: **Settings → General → Features → Issues**.
3. **Turn on GitHub Pages** to see your changes live: **Settings → Pages**, then set **Source** to **Deploy from a branch** and choose `main` and `/ (root)`.
4. Follow along with the course.

> [!IMPORTANT]
> When you open a pull request, set the **base repository** to **your fork**, not to this repository.

## How a change travels

```mermaid
flowchart LR
    I[Issue] --> B[Branch] --> C[Commit] --> P[Pull request] --> R[Review] --> M[Merge]
    M -. closes .-> I
```

## Care guide

The care guide is the source of truth for how often each plant needs water.

| Plant | Water every |
|-------|-------------|
| Spike the Cactus | 14 days |
| Fernando the Fern | 3 days |
| Basil | 2 days |
| Aloe Vera | 10 days |
| Monstera | 7 days |

## What is inside

<details>
<summary>Open the repository tour</summary>

| Path | What it contains |
|------|------------------|
| [`index.html`](index.html), [`plants.html`](plants.html), [`care.html`](care.html), [`about.html`](about.html) | The four pages |
| [`css/`](css) | The styles, one file for each part of the site |
| [`js/`](js) | The code. Plants, their rules, and saving the dates are in `js/features/plants/`. The list of plants is in [`plants.js`](js/features/plants/data/plants.js) |
| [`images/`](images) | The banner, the background artwork, and the preview pictures above |
| [`favicon.svg`](favicon.svg) | The icon in the browser tab |
| [`tests/`](tests) and [`scripts/`](scripts) | Optional checks you can run with Node: `node --test` and `node scripts/check-plants.mjs` |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | How changes are made in this project |

To preview the site on your own computer, run `python3 -m http.server 8000` in the project folder and open http://localhost:8000. The pages use JavaScript modules, which browsers only load from a web server.

</details>

## License

Released under the [MIT License](LICENSE).
