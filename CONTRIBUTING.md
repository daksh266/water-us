# Contributing to Water Us

Every change starts with an issue and ends with a merged pull request.

1. **Start from an issue.** Find an existing issue or write a new one with a title, a description, and acceptance criteria.
2. **Make a branch.** Never edit `main` directly. Give the branch a short, descriptive name.
3. **Commit your change.** Write a commit message that says what changed and why.
4. **Open a pull request.** Describe the change, and link the issue with a closing keyword such as `Closes #1` so it closes when the pull request merges.
5. **Check your change.** Open your GitHub Pages site and look at every page that your change could affect. If you have Node installed, you can also run `node scripts/check-plants.mjs` and `node --test`.
6. **Get a review.** Someone other than the author reviews the change before it is merged.
7. **Merge.** Merge once the review is done and you have looked at the result.

## Style

- Keep pull requests small and about one thing.
- Match the existing plant entries in `js/features/plants/data/plants.js`.
- Watering intervals must match the care guide in the README.
