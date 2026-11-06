# IndiBlock

A small browser extension that hides India-related posts and communities on Reddit, for people who would rather not see that content in their feeds.

Everything runs locally in your browser. No accounts, no tracking, no data leaves your device.

## What it does

- Hides posts from a built-in list of India-related subreddits (cities, regions, languages, culture).
- Hides posts from any subreddit whose name contains "india" (IndiaSpeaks, IndianFood, ...), while leaving Indiana and Indianapolis alone.
- Hides posts in any subreddit whose **title** contains a listed keyword.
- Covers new Reddit and old Reddit (feeds, r/all, r/popular, search results).
- If you open a hidden community directly, shows a plain "hidden" screen instead of the page.
- Popup lets you add your own subreddits and keywords, pause filtering, and see how many posts were hidden on the current page.

## Install

### Chrome, Edge, Brave

1. Download the latest zip from the [Releases](../../releases) page and unzip it.
2. Open `chrome://extensions` (or `edge://extensions`).
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the unzipped folder.

### Firefox (TODO set up working xpi)

1. Download the `.xpi` file from the [Releases](https://github.com/indiblock/indiblock/releases) page.
2. Open it in Firefox (double-click it, or drag it into a Firefox window).
3. Click **Add** when Firefox asks for permission.

## Customising

- **Quick:** use the extension popup to add subreddits or keywords. They are stored in your browser only.
- **Built-in lists:** edit `lists.js`. Subreddit names are lowercase without `r/`; keywords match whole words, case-insensitively.

## Limitations

- Only post titles and subreddit names are checked. Images, thumbnails, comments, search suggestions and sidebar recommendations are not filtered.
- Keyword matching can over-block (for example, "Indian Ocean"). Remove a keyword from `lists.js` if it bothers you.
- Reddit changes its page markup from time to time, which can break detection. If posts stop being hidden, please open an issue.

## Privacy

IndiBlock requests only the `storage` permission (to save your lists) and runs only on reddit.com pages. It collects nothing and makes no network requests.

## Contributing

Issues and pull requests are welcome, especially for broken selectors, missing subreddits, and other browsers.

## License

MIT, see [LICENSE](LICENSE).
