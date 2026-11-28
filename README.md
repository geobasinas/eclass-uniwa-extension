# UNIWA eClass Helper

A Manifest V3 browser extension for [eclass.uniwa.gr](https://eclass.uniwa.gr). It signs you back in when your session expires, keeps the session warm, adds course shortcuts to the portfolio page, applies a dark theme, and opens Office files in a built-in read-only viewer.

This is a personal project. It is not affiliated with the University of West Attica.

## What it does

- Saves your eClass credentials in the browser and submits the normal login form when the landing page appears.
- Checks your session every 10 minutes when keep-alive is enabled.
- Adds Notes and News links next to each course in the portfolio.
- Opens Notes in a small file browser. You can download files, zip folders, or preview DOCX, PPTX, and XLSX files.
- Re-styles eClass pages with a dark theme. The popup and document viewer also have a light theme.

The useful part is the Notes browser. eClass document pages are slow to click through, especially when a course has nested folders. The extension reads the same pages, keeps the folder tree in one modal, and lets you preview Office files without downloading them first.

## Build and install

You need Node.js 22 or newer and npm.

```sh
git clone https://github.com/geobasinas/eclass-uniwa-extension.git
cd eclass-uniwa-extension
npm install
npm run build
```

Then load the extension in Chrome or Edge:

1. Open `chrome://extensions` or `edge://extensions`.
2. Turn on developer mode.
3. Select **Load unpacked**.
4. Choose the `.output/chrome-mv3` folder.

For a zip file, run:

```sh
npm run zip
```

Firefox scripts are included too:

```sh
npm run dev:firefox
npm run build:firefox
npm run zip:firefox
```

## Set it up

Open the extension popup and save your eClass username and password. The login, keep-alive, quick links, and dark mode toggles can be changed independently.

You can use quick links and dark mode without saving credentials. Auto-login and keep-alive need both a username and a password.

## Development

```sh
npm install
npm run dev
```

Useful commands:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the WXT dev server for Chromium browsers |
| `npm run dev:firefox` | Start the WXT dev server for Firefox |
| `npm run compile` | Type-check the project without emitting files |
| `npm run build` | Build the Chrome MV3 extension |
| `npm run build:firefox` | Build the Firefox extension |
| `npm run zip` | Package the Chrome build |
| `npm run zip:firefox` | Package the Firefox build |

## Project layout

- `entrypoints/background.ts` handles silent login, the keep-alive alarm, and viewer tabs.
- `entrypoints/content.ts` runs on eClass pages, applies the theme, and adds course shortcuts.
- `utils/notesModal.ts` parses eClass document pages and renders the Notes browser.
- `entrypoints/viewer/` contains the read-only Office document viewer.
- `entrypoints/popup/` contains the settings popup.
- `utils/storage.ts` owns the extension settings stored in `browser.storage.local`.

## Privacy and security

The extension requests access to `https://eclass.uniwa.gr/*`, plus the `storage` and `alarms` permissions. It does not use analytics or send your data to another service.

Credentials are stored in `browser.storage.local` on your machine and posted only to the eClass login endpoint. Browser storage is not the same thing as a password manager. If someone can read your browser profile, they may be able to recover the saved password. If that risk does not fit how you use this computer, leave the credential fields empty and use the rest of the extension without auto-login.

## License

MIT. See [LICENSE](LICENSE).
