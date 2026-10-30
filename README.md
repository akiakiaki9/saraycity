# Saray City

Next.js restaurant website with Uzbek, Russian, and English routes:

- `/uz`, `/ru`, `/en` — localized homepages
- `/{locale}/menu` — full Mison menu with category filters
- `/{locale}/contacts` — restaurant contacts and table reservation form

The menu is stored in `src/data.js`. Product IDs are local sequential IDs; downloaded product images are served from `/images/menu/{id}.png`. Menu names and prices are imported from the public Mison menu API. Names remain in the Russian language supplied by that source; category labels and page content are localized.

## Run locally

```bash
npm install
npm run dev
```

Telegram reservation settings belong in `.env.local`:

- `TELEGRAM_BOT_TOKEN` — the restaurant bot token.
- `TELEGRAM_ADMIN_CHAT_ID` — the admin or group chat ID.

`.env.example` contains blank placeholders only. Never commit Telegram credentials or expose them through `NEXT_PUBLIC_*` variables. The form submits to `POST /api/reservations`; the endpoint validates the form and sends the reservation to Telegram.

## Checks

```bash
npm run lint
npm run build
```
