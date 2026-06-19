# RentBamboo Chrome Extension

The official [RentBamboo](https://rentbamboo.com) Chrome Extension. Brings RentBamboo tools directly into your browser while you browse rental listing sites.

## Tech Stack

- **Framework:** [Plasmo](https://docs.plasmo.com/) (Chrome Extension framework)
- **Auth:** [Clerk](https://clerk.com) via `@clerk/chrome-extension`
- **UI:** React 19, Tailwind CSS, Radix UI primitives
- **Language:** TypeScript
- **Package Manager:** pnpm 10

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 18 |
| pnpm | >= 10 |
| Chromium-based browser | Chrome, Edge, Brave, etc. |

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/rentbamboo/rentbamboo-ce.git
cd rentbamboo-ce
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the example files and fill in your values:

```bash
cp .env.development.example .env.development
cp .env.chrome.example .env.chrome
```

#### `.env.development`

| Variable | Description |
|----------|-------------|
| `PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (from [Clerk Dashboard → API Keys](https://dashboard.clerk.com)) |
| `CLERK_FRONTEND_API` | Clerk Frontend API URL (e.g. `https://clerk.rentbamboo.com`) |
| `PLASMO_PUBLIC_CLERK_SYNC_HOST` | The RentBamboo web app URL the extension syncs auth sessions with (e.g. `https://rentbamboo.com`) |

#### `.env.chrome`

| Variable | Description |
|----------|-------------|
| `CRX_PUBLIC_KEY` | Consistent CRX public key for a stable extension ID. See [Clerk docs](https://clerk.com/docs/references/chrome-extension/configure-consistent-crx-id). |

> **⚠️ Never commit real `.env.development` or `.env.chrome` files.** Only the `.example` files should be checked in.

### 4. Run in development

```bash
pnpm dev
```

This starts the Plasmo dev server with hot-reload.

### 5. Load the extension in Chrome

1. Open `chrome://extensions` in your browser.
2. Enable **Developer mode** (toggle in top-right).
3. Click **Load unpacked**.
4. Select the `build/chrome-mv3-dev` directory from this project.

The extension will reload automatically as you make changes.

### 6. Build for production

```bash
pnpm build
```

The production build outputs to `build/chrome-mv3-prod`.

To create a distributable `.zip`:

```bash
pnpm package
```

## Project Structure

```
├── src/
│   ├── background.ts        # Service worker / background script
│   ├── content.tsx           # Content script injected into pages
│   ├── style.css             # Global styles (Tailwind)
│   ├── components/           # Shared UI components
│   ├── contents/             # Additional content scripts
│   ├── features/             # Feature-specific modules
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   └── popup/                # Extension popup UI
├── assets/                   # Static assets (logos, images)
├── .env.development.example  # Template for development env vars
├── .env.chrome.example       # Template for Chrome CRX key
├── package.json              # Dependencies & Plasmo manifest config
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── postcss.config.js         # PostCSS configuration
```

## CI/CD

The `.github/workflows/submit.yml` workflow handles publishing to the Chrome Web Store. It is triggered manually via `workflow_dispatch` and requires the `SUBMIT_KEYS` secret to be configured in your repository settings.

### Environment Variables for CI

Add these as **repository secrets** in GitHub:

| Secret | Purpose |
|--------|---------|
| `SUBMIT_KEYS` | Browser Platform Publisher keys for Chrome Web Store submission |
| `PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for production build |
| `CLERK_FRONTEND_API` | Clerk Frontend API URL |
| `PLASMO_PUBLIC_CLERK_SYNC_HOST` | RentBamboo web app URL |
| `CRX_PUBLIC_KEY` | Stable extension CRX public key |

## Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with HMR |
| `pnpm build` | Create production build |
| `pnpm package` | Package build into `.zip` for distribution |

## Learn More

- [RentBamboo](https://rentbamboo.com)
- [Plasmo Documentation](https://docs.plasmo.com/)
- [Clerk Chrome Extension SDK](https://clerk.com/docs/references/chrome-extension/overview)
- [Chrome Extension Developer Docs](https://developer.chrome.com/docs/extensions)

## Contributing

1. Create a feature branch from `main`.
2. Make your changes and test locally by loading the unpacked extension.
3. Open a pull request with a clear description of the change.

## License

Proprietary – © RentBamboo. All rights reserved.
