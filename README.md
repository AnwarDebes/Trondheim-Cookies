# Trondheim Cookies 🍪

A warm, simple cookie-ordering website. Made in Norway, delivered in Trondheim.
**20% of every cookie goes to children in Syria.** Buy with meaning.

No payment online - customers choose cookies (or build their own), enter their
Trondheim delivery details, and the order is emailed to the bakery. We deliver
and collect payment (Vipps or cash) on handover.

---

## What's in here

```
site/
├── index.html     ← the whole website (markup + styling)
├── app.js         ← cookies, build-your-own, basket, order-by-email logic
├── styles.css     ← fonts + design tokens
├── img/           ← the 10 cookie photos (see img/README.txt)
├── vercel.json    ← Vercel config
└── package.json   ← optional, for `npx serve` local preview
```

Icons load from a CDN (Lucide). No build step, no backend, no `npm install`.

---

## ✅ Two things to set before launch

1. **Bakery email** - open `app.js`, line ~9, and set:
   ```js
   const ORDER_EMAIL = "orders@trondheimcookies.no";   // ← the real email
   ```
   Every order opens in the customer's email app, pre-addressed to this address.

2. **Cookie photos & names** -
   - Add 10 square photos to `site/img/` named `cookie-vm.jpg` and `cookie-1.jpg` … `cookie-9.jpg`
     (see `img/README.txt`). Until then, a friendly "Photo coming soon" shows.
   - Cookie names are placeholders (`Cookie No. 1` …). Edit the `COOKIES` list
     near the top of `app.js` to set the real names and details.

   **Price** is set once in `app.js`: `const PRICE = 39;` (Norwegian kroner). Change as needed.

---

## Deploy to Vercel

### Drag & drop (fastest)
1. Go to **[vercel.com/new](https://vercel.com/new)**.
2. Drag this `site/` folder onto the page (or zip and upload).
3. Framework preset: **Other**. No build command. Click **Deploy**.

### Vercel CLI
```bash
npm i -g vercel
cd site
vercel --prod
```

### Git
Push this folder to GitHub and import at vercel.com/new (preset **Other**, no build).

---

## Run locally
```bash
cd site
npx serve .        # → http://localhost:3000
# or: python3 -m http.server 8000
```

---

## How the order flow works
- Customer adds cookies (quantity steppers) and/or builds a custom cookie.
- Basket shows the count, the subtotal, and the 20% going to Syria.
- They fill in name, phone, Trondheim address, and optional day/time + notes.
- **Send my order** opens their email app with the full order pre-written to the
  bakery email. They press send; we bake and deliver.
