/* ============================================================
   TRONDHEIM COOKIES, storefront logic
   10 signature cookies · 3D build-your-own · basket · order-by-email.
   No payment: orders are emailed to the bakery, paid on delivery.
   Bilingual: English (default) and Norwegian.
   ============================================================ */

/* TODO: replace with your real bakery order email when you have it */
const ORDER_EMAIL = "trondheimcookie@gmail.com";

/* Price per cookie, in Norwegian kroner */
const PRICE = 59;
const GIVE_PCT = 0.10; // 10% to children in need in Syria

/* ---- Delivery ----
   Free inside the central zone (Midtbyen, Solsiden, Møllenberg, Bakklandet) or
   within 2 km of our base, and free on orders over 9 cookies. Otherwise 39 kr.
   Base: Computas Trondheim, Nordre Berggate 2, 7014 Trondheim. */
const DELIVERY_FEE = 39;          // kr, for addresses outside the free zone
const FREE_OVER_QTY = 9;          // orders over 9 cookies ship free
const FREE_RADIUS_KM = 2;         // free within 2 km of the base
const ORIGIN = { lat: 63.4304894, lng: 10.4074083 };
const FREE_AREAS = ["midtbyen", "solsiden", "møllenberg", "mollenberg", "bakklandet"];

/* ---- Language ---- */
let LANG = localStorage.getItem("tc_lang") || "en";
if (LANG !== "en" && LANG !== "no" && LANG !== "ar") LANG = "en";

/* ---- The 10 signature cookies ----
   Each has a cool name + a short description in both languages, based on
   the real photos in img/cookie-vm.jpg and img/cookie-1.jpg … cookie-9.jpg */
const COOKIES = [
  { id: "vm", img: "img/cookie-vm.jpg", stuffed: true,
    name: { en: "VM-Cookie", no: "VM-Cookie", ar: "في إم كوكي" },
    desc: { en: "Our flag-flying favourite: soft browned-butter dough generously filled with rich, gooey Nutella inside and crowned with a hand made Norwegian flag on top. Pure Nutella all the way through.",
            no: "Vår flaggbærende favoritt: myk deig med brunet smør, sjenerøst fylt med deilig, seig Nutella inni og kronet med et håndlaget norsk flagg på toppen. Ren Nutella hele veien.",
            ar: "المفضّلة الحاملة للعلم لدينا: عجينة طرية بزبدة بنية محشوة بسخاء بالنوتيلا الغنية واللزجة من الداخل، ومتوّجة بعلم نرويجي مصنوع يدويًا في الأعلى. نوتيلا خالصة من الداخل إلى الخارج." } },
  { id: "c1", img: "img/cookie-1.jpg", stuffed: false,
    name: { en: "Molten Truffle Bomb", no: "Smeltende Trøffelbombe", ar: "كوكي الترافل" },
    desc: { en: "Our one plain cookie, kept simple on purpose: soft browned-butter dough crowned with milk-chocolate ganache and a cocoa-dusted truffle on top.",
            no: "Vår eneste enkle cookie, bevisst holdt ren: myk deig med brunet smør, toppet med melkesjokoladeganache og en kakaodekket trøffel.",
            ar: "كوكيتنا البسيطة الوحيدة، بسيطة عن قصد: عجينة طرية بزبدة بنية متوّجة بغاناش الشوكولاتة بالحليب وكرة ترافل مغطاة بالكاكاو فوقها." } },
  { id: "c2", img: "img/cookie-2.jpg", stuffed: true,
    name: { en: "The Bueno Bandit", no: "Bueno-banditten", ar: "كوكي كيندر بوينو" },
    desc: { en: "Stuffed with Kinder and hazelnut praline inside, then drizzled with more praline and a whole Kinder Bueno on top. The inside matches the top.",
            no: "Proppfull av Kinder og hasselnøttkrem inni, dryppet med mer krem og toppet med en hel Kinder Bueno. Det samme inni som på toppen.",
            ar: "محشوة بالكيندر وبرالين البندق من الداخل، ثم مزيّنة بمزيد من البرالين وقطعة كيندر بوينو كاملة فوقها. الداخل يطابق الأعلى." } },
  { id: "c3", img: "img/cookie-3.jpg", stuffed: true,
    name: { en: "Salted Caramel Riot", no: "Saltkaramell-opprøret", ar: "ثورة الحلو والمالح" },
    desc: { en: "Salted caramel stuffed through the middle and poured over the top, finished with crunchy salted crisps. What's on top is inside too.",
            no: "Salt karamell fylt i midten og helt over toppen, avsluttet med sprø saltchips. Det som er på toppen er også inni.",
            ar: "كراميل مملّح محشو في المنتصف ومسكوب فوقها، مع رقائق بطاطس مملّحة مقرمشة. ما في الأعلى موجود في الداخل أيضًا." } },
  { id: "c4", img: "img/cookie-4.jpg", stuffed: true,
    name: { en: "Dubai Pistachio Drip", no: "Dubai-pistasjdrypp", ar: "كوكي شوكولاتة دبي" },
    desc: { en: "Pistachio cream and crunchy kataifi packed inside and drizzled on top, finished with a slab of Dubai chocolate. Stuffed and topped to match.",
            no: "Pistasjkrem og sprø kataifi både inni og på toppen, kronet med en bit Dubai-sjokolade.",
            ar: "كريمة الفستق والكتايف المقرمشة محشوة في الداخل ومزينة من الأعلى، مع قطعة شوكولاتة دبي. محشوة ومغطاة بنفس الشيء." } },
  { id: "c5", img: "img/cookie-5.jpg", stuffed: true,
    name: { en: "Funfetti Pop", no: "Funfetti-cookie", ar: "كوكي الحلوى الملوّنة" },
    desc: { en: "Candy-shell chocolate buttons baked through the middle and pressed on top. The same crunch inside and out.",
            no: "Sjokoladelinser bakt gjennom midten og trykket på toppen. Samme knas inni og utenpå.",
            ar: "حبوب شوكولاتة بقشرة مقرمشة مخبوزة في المنتصف ومضغوطة فوقها. نفس القرمشة في الداخل والخارج." } },
  { id: "c6", img: "img/cookie-6.jpg", stuffed: true,
    name: { en: "The Molten Crookie", no: "Smeltende Crookie", ar: "كوكي الكرواسون" },
    desc: { en: "A buttery croissant and chocolate chunks folded inside the dough and baked on top too, until everything goes molten.",
            no: "En smørrik croissant og sjokoladebiter foldet inni deigen og bakt på toppen også, til alt smelter.",
            ar: "كرواسون بالزبدة وقطع شوكولاتة مطوية داخل العجينة ومخبوزة فوقها أيضًا، حتى يذوب كل شيء." } },
  { id: "c7", img: "img/cookie-7.jpg", stuffed: true,
    name: { en: "Death by Browns", no: "Død av Brownies", ar: "الموت بالبراوني" },
    desc: { en: "A fudgy brownie folded right inside the dough with a brownie slab on top and flaky sea salt. Brownie inside, brownie on top.",
            no: "En saftig brownie foldet rett inn i deigen med en brownieskive på toppen og flaksalt. Brownie inni, brownie på toppen.",
            ar: "براوني طري مطوي داخل العجينة مع شريحة براوني فوقها ورشة ملح. براوني في الداخل وبراوني في الأعلى." } },
  { id: "c8", img: "img/cookie-8.jpg", stuffed: true,
    name: { en: "Pistachio Green Goddess", no: "Pistasjgudinnen", ar: "كوكي الفستق" },
    desc: { en: "Pistachio cream stuffed inside and blanketed on top, scattered with whole roasted pistachios. The inside is just as green.",
            no: "Pistasjkrem fylt inni og lagt over toppen, strødd med hele ristede pistasjnøtter. Innsiden er like grønn.",
            ar: "كريمة فستق محشوة في الداخل ومغطّاة من الأعلى، مع فستق محمّص كامل. الداخل أخضر تمامًا." } },
  { id: "c9", img: "img/cookie-9.jpg", stuffed: true,
    name: { en: "The S'more Campfire", no: "S'more-bålcookie", ar: "كوكي السمور" },
    desc: { en: "Toasted marshmallow and milk chocolate stuffed inside and torched on top. A true s'more, all the way through.",
            no: "Ristet marshmallow og melkesjokolade fylt inni og brent på toppen. En ekte s'more, hele veien.",
            ar: "مارشميلو محمّص وشوكولاتة بالحليب محشوة في الداخل ومحروقة فوقها. سمور حقيقي من الداخل إلى الخارج." } },
];
const cookieName = (c) => (c.name[LANG] || c.name.en);
const cookieDesc = (c) => (c.desc[LANG] || c.desc.en);

/* ---- Build-your-own options ----
   hex = solid base colour used by the 3D cookie; color = 2D gradient fallback */
const DOUGHS = [
  { id: "classic",   en: "Classic vanilla",   no: "Klassisk vanilje",  hex: "#C6863F", color: "radial-gradient(circle at 38% 34%, #E7B871, #C5854A 55%, #8A5A30 92%)" },
  { id: "choc",      en: "Double chocolate",  no: "Dobbel sjokolade",  hex: "#5A3621", color: "radial-gradient(circle at 38% 34%, #7A4A2E, #4A2C18 55%, #2A160C 92%)" },
  { id: "oat",       en: "Oatmeal",           no: "Havre",             hex: "#C7A968", color: "radial-gradient(circle at 38% 34%, #E9D2A0, #C7A968 55%, #98794A 92%)" },
  { id: "redvelvet", en: "Red velvet",        no: "Red velvet",        hex: "#A53B33", color: "radial-gradient(circle at 38% 34%, #C75B53, #9A352F 55%, #6A201C 92%)" },
];
const MIXINS = [
  { id: "choc-chips", en: "Chocolate chips", no: "Sjokoladebiter", dot: "#3a2012" },
  { id: "white-choc", en: "White chocolate", no: "Hvit sjokolade", dot: "#F3E6CC" },
  { id: "caramel",    en: "Caramel",         no: "Karamell",       dot: "#C57F2E" },
  { id: "sea-salt",   en: "Sea salt",        no: "Havsalt",        dot: "#EFEFE6" },
  { id: "nuts",       en: "Hazelnuts",       no: "Hasselnøtter",   dot: "#8A5A34" },
  { id: "oats",       en: "Oats",            no: "Havregryn",      dot: "#D8BE86" },
  { id: "berries",    en: "Berries",         no: "Bær",            dot: "#9C3358" },
  { id: "sprinkles",  en: "Sprinkles",       no: "Strøssel",       dot: "#E0892F" },
];
const doughLabel = (d) => d[LANG];
const mixLabel = (m) => m[LANG];

/* ============================================================
   TRANSLATIONS
   ============================================================ */
const I18N = {
  en: {
    ribbon: "<b>10%</b> of every cookie goes to children in need in Syria. Buy with meaning.",
    farewellFirst: "Thank you, Trondheim. This is not goodbye.",
    farewellTitle: "From the 4th of July, the oven is resting for a while. ♥",
    farewellBody: "<p>From the 4th of July we are taking a break. The oven will be resting for a while, but we truly hope to fire it up again and bake for you in the future.</p><p>This started as something small. We just wanted to make a little difference for children in need in Syria, and to put a warm, handmade cookie in your hands, simply because we love spreading a bit of kindness.</p><p>With every cookie you ordered, you helped us do exactly that. And that was always the whole point.</p><p>Thank you for tasting what we made, for sharing it with the people you love, and for helping children in Syria along the way. You made it real. If you have ordered from us before, we will be in touch when we are back.</p>",
    farewellSign: "With love, Trondheim Cookies ♥",
    brandSub: "Made in Norway",
    navCookies: "Our cookies", navBuild: "Build your own", navOrder: "Order", navPromise: "Our promise",
    basket: "Basket",
    heroEyebrow: "Handmade in Norway · Delivered in Trondheim",
    heroTitle: 'Trendy stuffed cookies<br>baked with <span class="amber">meaning.</span>',
    heroLead: "Fresh, handmade cookies delivered to your door across Trondheim. And with every single cookie, <b>10% goes to children in need in Syria</b>. Sweet that does good.",
    heroCta1: "Order cookies", heroCta2: "Build your own",
    trust1: "Free delivery in Trondheim", trust2: "10% to Syria", trust3: "Baked fresh to order",
    impactEyebrow: "Buy with meaning",
    impactTitle: "of every cookie feeds children in need in Syria",
    impactBody: "You order cookies you love. A tenth of what you pay goes straight to helping kids in need in Syria. No catch, just kindness baked in.",
    impactPill: "Every order makes a difference",
    cookiesEyebrow: "Our cookies",
    cookiesTitle: "Ten to choose from",
    cookiesBody: "Big, stuffed, over-the-top cookies. Pick your favourites, choose how many, and we'll bake and deliver them fresh across Trondheim.",
    photoSoon: "Photo coming soon",
    giveTag: "10% gives", addBtn: "Add",
    buildEyebrow: "Make it yours",
    buildTitle: "Build your own cookie",
    buildBody: "A make-your-own cookie studio is on its way. Here's a sneak peek of what's coming.",
    yourCookie: "Your cookie",
    pickPrompt: "Pick a dough and some mix-ins…",
    spinHint: "Drag to spin · pinch or scroll won't bite",
    buildStep1: "1 · Choose your dough",
    buildStep2: "2 · Add mix-ins (as many as you like)",
    buildStepUpload: "3 · Saw one you love? Show us",
    uploadCta: "Upload a photo or video",
    uploadHint: "Drop a picture or clip of a cookie you want and we'll recreate it as close as we can.",
    refRemove: "Remove",
    buildStep3: "4 · Name your creation",
    buildNamePh: "e.g. The Trondheim Storm",
    buildAdd: "Add my cookie to basket",
    defaultCustom: "My custom cookie",
    orderEyebrow: "Almost there",
    orderTitle: "Place your order",
    orderBody: "No payment online. You pay on delivery. Tell us where you are in Trondheim and we'll bring them to you.",
    basketTitle: "Your basket", basketHint: "Cookies are 59 kr each · 150–200 g.",
    basketEmpty: "Your basket is empty.<br>Add some cookies above.",
    refChip: "Reference attached",
    eachLabel: "each", cookieSing: "cookie", cookiePlur: "cookies",
    giveLine: "Goes to children in need in Syria", totalLine: "Total",
    deliveryTitle: "Delivery details", deliveryHint: "We deliver across the Trondheim area.",
    deliveryNote: "We currently deliver only within <b>Trondheim, Norway</b>. Pay with Vipps or cash when we hand over your cookies.",
    fldName: "Your name", phName: "Full name", fldEmail: "Your email", phEmail: "you@email.com",
    fldPhone: "Phone",
    fldAddress: "Delivery address (Trondheim)", phAddress: "Street, number, postcode",
    fldArea: "Area / neighbourhood", phArea: "e.g. Midtbyen, Lade…",
    fldWhen: "Preferred day/time", phWhen: "e.g. Sat afternoon",
    fldNotes: "Notes (optional)", phNotes: "Allergies, doorbell, gift message…",
    submitBtn: "Send my order",
    formFoot: "Your order is sent straight to our bakery.",
    storyEyebrow: "Our promise",
    storyTitle: "Every cookie helps a child in Syria.",
    storyBody: "We started Trondheim Cookies with one simple idea: something as small as a cookie can do something big. That's why <b>10% of the price of every cookie</b> goes directly to helping children in need in Syria. You enjoy the cookie. A child gets help. That's the whole deal.",
    stat1: "Of every cookie, donated", stat2: "Handmade in Norway", stat3: "Delivered with love",
    storyQuote: '"Order a cookie, feed a child. Kindness has never tasted this good."',
    storyBy: "The Trondheim Cookies promise",
    footOrder: "Order", footPlace: "Place an order",
    footDelivery: "Delivery", footDel1: "Trondheim area only", footDel2: "Pay on delivery", footDel3: "Vipps or cash",
    footProm1: "10% to children in need in Syria", footProm2: "Handmade, baked to order",
    footCopy: "© 2026 TRONDHEIM COOKIES · MADE IN NORWAY", footTag: "BUY WITH MEANING ♥",
    successTitle: "Order sent!",
    successBody: "Your order is on its way to our bakery. We'll get baking and be in touch to confirm delivery.",
    successThanks: "Thank you for helping children in need in Syria. ♥",
    successBack: "Back to cookies",
    toastDefault: "Added to basket",
    toastAdded: (n, name) => `Added ${n} × ${name}`,
    toastCustom: (nm) => `Added "${nm}" to basket`,
    toastFirst: "Add some cookies first 🙂",
    toastUploaded: "Reference added",
    navEvents: "Events", navReviews: "Reviews",
    weightTag: "150–200 g",
    eventsEyebrow: "Bigger happenings",
    eventsTitle: "Birthdays, parties, big days, sorted.",
    eventsBody: "From birthday boxes to full party platters, we bake show-stopping cookie spreads for any celebration. Tell us the vibe and we'll make it unforgettable.",
    ev1Title: "Birthday boxes", ev1Body: "A gift-ready box of stuffed cookies, customised with names, candles and your colours.", ev1Price: "From 349 kr",
    ev2Title: "Party platters", ev2Body: "Big sharing platters and cookie towers that turn heads at any party or gathering.", ev2Price: "From 690 kr",
    ev3Title: "Custom & catering", ev3Body: "Weddings, corporate gifts, brand launches, themed bakes. If you can dream it, we can bake it.", ev3Price: "Let's talk",
    eventsCtaText: "The most important thing for us is your satisfaction.",
    eventsCtaBtn: "Plan my event",
    reviewsEyebrow: "Loved in Trondheim",
    reviewsTitle: "What people are saying",
    reviewsBody: "Real words from real cookie lovers. Tried one? Leave yours below.",
    reviewFormTitle: "Share your review",
    revName: "Your name", revNamePh: "Your name",
    revRating: "Your rating",
    revText: "Your review", revTextPh: "How was your cookie?",
    revSubmit: "Post review",
    revThanks: "Thanks for sharing! \uD83C\uDF6A",
    revNeedRating: "Pick a star rating first \uD83D\uDE42",
    stuffedTag: "Stuffed inside",
    plainTag: "Plain dough · loaded on top",
    dealBanner: "Buy 5, get 1 free · Buy 9, get 2 free",
    freeLine: "Free cookies",
    dealTo1: (n) => `Add ${n} more and 1 cookie is free \uD83C\uDF89`,
    dealTo2: (n) => `Add ${n} more for 2 free cookies \uD83C\uDF89`,
    dealGot1: "Nice! 1 cookie is on us. Add 4 more for 2 free \uD83C\uDF89",
    dealGot2: "Amazing! You've unlocked 2 free cookies \uD83C\uDF89",
    mailFreeLine: (free, amt) => `Free cookies (${free}): -${amt}`,
    filmEyebrow: "Straight from the oven",
    filmTitle: "See them in action",
    filmBody: "Gooey, stuffed and pulled apart on camera. This is exactly what lands at your door.",
    soonBadge: "Coming soon",
    soonTag: "In the oven",
    soonTitle: "Build-your-own is coming soon",
    soonBody: "Soon you'll design your very own cookie: choose the dough, pile on the mix-ins, and name it. We're putting the finishing touches on it. Give our 3D cookie a spin and check back soon, it's nearly out of the oven.",
    soonCta: "Shop our cookies meanwhile",
    reviewsTitle: "Leave us a review",
    reviewsBody: "Tried one of our cookies? We'd love to hear what you thought.",
    revMailSubject: "New review · Trondheim Cookies",
    deliveryHint: "Free delivery in Midtbyen, Solsiden, Møllenberg and Bakklandet.",
    deliveryNote: "Delivery within <b>Midtbyen (Trondheim city center), Solsiden, Møllenberg and Bakklandet</b> is free. Outside these areas, delivery is <b>39 kr</b>. Orders over <b>9 cookies</b> ship free. Pay with Vipps or cash on handover.",
    orderBody: "No payment online, you pay on delivery. Delivery is free within Midtbyen, Solsiden, Møllenberg and Bakklandet, 39 kr outside these areas, and free on orders over 9 cookies.",
    footDel1: "Free in Midtbyen, Solsiden, Møllenberg & Bakklandet",
    footDel2: "39 kr outside · free over 9 cookies",
    footDel3: "Pay on delivery (Vipps or cash)",
    trust1: "Free delivery in central Trondheim",
    trust4: "100% satisfaction guarantee",
    footProm3: "Satisfaction guaranteed",
    guaranteeNote: "Not happy with your cookies? Tell us and we'll make it right. Your satisfaction always comes first.",
    delivFree: "\u2713 Free delivery in Midtbyen, Solsiden, M\u00f8llenberg & Bakklandet",
    delivNudge: (n) => `Add ${n} more cookie${n > 1 ? "s" : ""} for free delivery`,
    delivLabel: "Delivery",
    delivFreeWord: "Free",
    delivPending: "From your address",
    submitSending: "Sending…",
    mailDeliveryLine: (fee) => `Delivery: ${fee > 0 ? kr(fee) : "Free"}`,
    mailDistanceLine: (km) => `Distance from base: ${km.toFixed(1)} km`,
    evFormTitle: "Let's plan it together",
    evFormHint: "Tell us a little about your event and we'll come back with ideas and a quote. No commitment, just a chat.",
    evOccasion: "Occasion",
    evOpt1: "Birthday", evOpt2: "Party / gathering", evOpt3: "Wedding", evOpt4: "Corporate / brand", evOpt5: "Something else",
    evDate: "Date",
    evGuests: "Roughly how many guests?", evGuestsPh: "e.g. 20",
    evName: "Your name", evPhone: "Phone",
    evIdeas: "Your ideas & the vibe", evIdeasPh: "Theme, flavours, colours, anything you're dreaming of…",
    evFormSubmit: "Send my enquiry",
    evFormFoot: "This sends your enquiry straight to us.",
    evThanks: "Enquiry ready to send \uD83C\uDF89",
    evMailSubject: "Event enquiry · Trondheim Cookies",
    evMailBody: (d) => `Hi Trondheim Cookies,\n\nI'd love to plan an event with you.\n\nOccasion: ${d.occ}\nDate: ${d.date}\nGuests: ${d.guests}\n\nMy ideas:\n${d.ideas}\n\nName: ${d.name}\nPhone: ${d.phone}\n\nLooking forward to planning together!`,
    mailEventSubject: "Event enquiry · Trondheim Cookies",
    mailEventBody: "Hi Trondheim Cookies,\n\nI'd love to plan a bigger order for an event.\n\nType of event: \nDate: \nNumber of guests: \nWhat I have in mind: \n\nName: \nPhone: \n\nThank you!",
    /* email */
    mailHeader: "New cookie order from the Trondheim Cookies website",
    mailOrder: "ORDER",
    mailSubtotalLine: (count, sub) => `${count} cookies × ${PRICE} kr = ${sub}`,
    mailGiveLine: (give) => `10% to children in need in Syria = ${give}`,
    mailTotalLine: (sub) => `TOTAL (pay on delivery): ${sub}`,
    mailDelivery: "DELIVERY",
    mailName: "Name", mailPhone: "Phone", mailAddr: "Address", mailArea: "Area", mailWhen: "When", mailNotes: "Notes",
    mailRefHead: "REFERENCE PHOTOS/VIDEOS",
    mailRefNote: "The customer attached reference media for a custom cookie. Please ask them to reply to this email with the photo/video so we can recreate it:",
    mailThanks: "Thank you, buy with meaning ♥",
    mailSubject: (name, count) => `New cookie order: ${name} (${count} cookies)`,
    mailBuild: "build-your-own",
  },
  no: {
    ribbon: "<b>10%</b> av hver cookie går til barn i nød i Syria. Kjøp med mening.",
    farewellFirst: "Tusen takk, Trondheim. Dette er ikke et farvel.",
    farewellTitle: "Fra 4. juli hviler ovnen en liten stund. ♥",
    farewellBody: "<p>Fra 4. juli tar vi en pause. Ovnen får hvile en stund, men vi håper virkelig å fyre den opp igjen og bake for deg en gang til.</p><p>Det hele startet som noe lite. Vi ville bare utgjøre en liten forskjell for barn i nød i Syria, og legge en varm, håndlaget cookie i hendene dine, rett og slett fordi vi elsker å spre litt godhet.</p><p>Med hver cookie du bestilte, hjalp du oss å gjøre nettopp det. Og det var hele poenget.</p><p>Takk for at du smakte på det vi laget, for at du delte det med dem du er glad i, og for at du hjalp barn i Syria på veien. Du gjorde det ekte. Har du bestilt fra oss før, tar vi kontakt når vi er tilbake.</p>",
    farewellSign: "Med kjærlighet, Trondheim Cookies ♥",
    brandSub: "Laget i Norge",
    navCookies: "Våre cookies", navBuild: "Lag din egen", navOrder: "Bestill", navPromise: "Vårt løfte",
    basket: "Handlekurv",
    heroEyebrow: "Håndlaget i Norge · Levert i Trondheim",
    heroTitle: 'Trendy fylte cookies<br>bakt med <span class="amber">mening.</span>',
    heroLead: "Ferske, håndlagde cookies levert til døren din i hele Trondheim. Og med hver eneste cookie går <b>10% til barn i nød i Syria</b>. Søtt som gjør godt.",
    heroCta1: "Bestill cookies", heroCta2: "Lag din egen",
    trust1: "Gratis levering i Trondheim", trust2: "10% til Syria", trust3: "Bakt ferskt på bestilling",
    impactEyebrow: "Kjøp med mening",
    impactTitle: "av hver cookie hjelper barn i nød i Syria",
    impactBody: "Du bestiller cookies du elsker. En tidel av det du betaler går rett til å hjelpe barn i nød i Syria. Ingen hake, bare godhet bakt inn.",
    impactPill: "Hver bestilling utgjør en forskjell",
    cookiesEyebrow: "Våre cookies",
    cookiesTitle: "Ti å velge mellom",
    cookiesBody: "Store, fylte, over-the-top cookies. Velg favorittene dine, bestem antall, så baker og leverer vi dem ferske i hele Trondheim.",
    photoSoon: "Bilde kommer snart",
    giveTag: "10% gir", addBtn: "Legg til",
    buildEyebrow: "Gjør den til din",
    buildTitle: "Lag din egen cookie",
    buildBody: "Et lag-din-egen cookie-studio er på vei. Her er en forsmak på det som kommer.",
    yourCookie: "Din cookie",
    pickPrompt: "Velg en deig og noen fyll…",
    spinHint: "Dra for å snurre · den biter ikke",
    buildStep1: "1 · Velg deigen din",
    buildStep2: "2 · Legg til fyll (så mange du vil)",
    buildStepUpload: "3 · Sett du en du elsket? Vis oss",
    uploadCta: "Last opp et bilde eller en video",
    uploadHint: "Slipp inn et bilde eller en klipp av en cookie du vil ha, så gjenskaper vi den så likt vi kan.",
    refRemove: "Fjern",
    buildStep3: "4 · Gi kreasjonen et navn",
    buildNamePh: "f.eks. Trondheimsstormen",
    buildAdd: "Legg cookien min i kurven",
    defaultCustom: "Min egen cookie",
    orderEyebrow: "Nesten i mål",
    orderTitle: "Legg inn bestillingen din",
    orderBody: "Ingen betaling på nett. Du betaler ved levering. Fortell oss hvor du er i Trondheim, så bringer vi dem til deg.",
    basketTitle: "Handlekurven din", basketHint: "Cookies koster 59 kr stykket · 150–200 g.",
    basketEmpty: "Handlekurven din er tom.<br>Legg til noen cookies ovenfor.",
    refChip: "Referanse lagt ved",
    eachLabel: "stykket", cookieSing: "cookie", cookiePlur: "cookies",
    giveLine: "Går til barn i nød i Syria", totalLine: "Totalt",
    deliveryTitle: "Leveringsdetaljer", deliveryHint: "Vi leverer i hele Trondheimsområdet.",
    deliveryNote: "Vi leverer foreløpig kun innenfor <b>Trondheim, Norge</b>. Betal med Vipps eller kontant når vi overleverer cookiesene dine.",
    fldName: "Navnet ditt", phName: "Fullt navn", fldEmail: "E-posten din", phEmail: "deg@epost.no",
    fldPhone: "Telefon",
    fldAddress: "Leveringsadresse (Trondheim)", phAddress: "Gate, nummer, postnummer",
    fldArea: "Område / bydel", phArea: "f.eks. Midtbyen, Lade…",
    fldWhen: "Ønsket dag/tid", phWhen: "f.eks. lørdag ettermiddag",
    fldNotes: "Notater (valgfritt)", phNotes: "Allergier, ringeklokke, gavemelding…",
    submitBtn: "Send bestillingen min",
    formFoot: "Bestillingen din sendes rett til bakeriet vårt.",
    storyEyebrow: "Vårt løfte",
    storyTitle: "Hver cookie hjelper et barn i nød i Syria.",
    storyBody: "Vi startet Trondheim Cookies med én enkel idé: noe så lite som en cookie kan utrette noe stort. Derfor går <b>10% av prisen på hver cookie</b> direkte til å hjelpe barn i nød i Syria. Du nyter cookien. Et barn får hjelp. Så enkelt er det.",
    stat1: "Av hver cookie, donert", stat2: "Håndlaget i Norge", stat3: "Levert med kjærlighet",
    storyQuote: '"Bestill en cookie, gi et barn mat. Godhet har aldri smakt så godt."',
    storyBy: "Trondheim Cookies-løftet",
    footOrder: "Bestill", footPlace: "Legg inn bestilling",
    footDelivery: "Levering", footDel1: "Kun Trondheimsområdet", footDel2: "Betal ved levering", footDel3: "Vipps eller kontant",
    footProm1: "10% til barn i nød i Syria", footProm2: "Håndlaget, bakt på bestilling",
    footCopy: "© 2026 TRONDHEIM COOKIES · LAGET I NORGE", footTag: "KJØP MED MENING ♥",
    successTitle: "Bestillingen er sendt!",
    successBody: "Bestillingen din er på vei til bakeriet vårt. Vi setter i gang å bake og tar kontakt for å bekrefte levering.",
    successThanks: "Takk for at du hjelper barn i nød i Syria. ♥",
    successBack: "Tilbake til cookies",
    toastDefault: "Lagt i kurven",
    toastAdded: (n, name) => `La til ${n} × ${name}`,
    toastCustom: (nm) => `La "${nm}" i kurven`,
    toastFirst: "Legg til noen cookies først 🙂",
    toastUploaded: "Referanse lagt til",
    navEvents: "Arrangementer", navReviews: "Anmeldelser",
    weightTag: "150–200 g",
    eventsEyebrow: "Større anledninger",
    eventsTitle: "Bursdager, fester, store dager, ordnet.",
    eventsBody: "Fra bursdagsbokser til fulle festfat baker vi imponerende cookie-utvalg til enhver feiring. Fortell oss stemningen, så gjør vi det uforglemmelig.",
    ev1Title: "Bursdagsbokser", ev1Body: "En gaveklar boks med fylte cookies, tilpasset med navn, lys og fargene dine.", ev1Price: "Fra 349 kr",
    ev2Title: "Festfat", ev2Body: "Store delefat og cookie-tårn som stjeler oppmerksomheten i enhver fest.", ev2Price: "Fra 690 kr",
    ev3Title: "Skreddersøm & catering", ev3Body: "Bryllup, firmagaver, lanseringer, tematiske bakverk. Kan du drømme det, baker vi det.", ev3Price: "Ta kontakt",
    eventsCtaText: "Det viktigste for oss er at du er fornøyd.",
    eventsCtaBtn: "Planlegg arrangementet mitt",
    reviewsEyebrow: "Elsket i Trondheim",
    reviewsTitle: "Hva folk sier",
    reviewsBody: "Ekte ord fra ekte cookie-elskere. Prøvd en? Legg igjen din under.",
    reviewFormTitle: "Del din anmeldelse",
    revName: "Navnet ditt", revNamePh: "Navnet ditt",
    revRating: "Din vurdering",
    revText: "Din anmeldelse", revTextPh: "Hvordan var cookien?",
    revSubmit: "Publiser anmeldelse",
    revThanks: "Takk for at du delte! \uD83C\uDF6A",
    revNeedRating: "Velg en stjernevurdering først \uD83D\uDE42",
    stuffedTag: "Fylt inni",
    plainTag: "Enkel deig · toppet",
    dealBanner: "Kjøp 5, få 1 gratis · Kjøp 9, få 2 gratis",
    freeLine: "Gratis cookies",
    dealTo1: (n) => `Legg til ${n} til og 1 cookie er gratis \uD83C\uDF89`,
    dealTo2: (n) => `Legg til ${n} til for 2 gratis cookies \uD83C\uDF89`,
    dealGot1: "Digg! 1 cookie er gratis. Legg til 4 til for 2 gratis \uD83C\uDF89",
    dealGot2: "Fantastisk! Du har låst opp 2 gratis cookies \uD83C\uDF89",
    mailFreeLine: (free, amt) => `Gratis cookies (${free}): -${amt}`,
    filmEyebrow: "Rett fra ovnen",
    filmTitle: "Se dem i aksjon",
    filmBody: "Seige, fylte og delt opp på kamera. Dette er nøyaktig det som havner på døren din.",
    soonBadge: "Kommer snart",
    soonTag: "I ovnen",
    soonTitle: "Lag din egen kommer snart",
    soonBody: "Snart kan du designe din helt egen cookie: velg deigen, fyll på godterier og gi den et navn. Vi legger siste hånd på verket. Gi 3D-cookien en snurr og stikk innom snart, den er nesten ute av ovnen.",
    soonCta: "Handle cookiene våre i mellomtiden",
    reviewsTitle: "Legg igjen en anmeldelse",
    reviewsBody: "Prøvd en av cookiene våre? Vi vil veldig gjerne høre hva du synes.",
    revMailSubject: "Ny anmeldelse · Trondheim Cookies",
    deliveryHint: "Gratis levering i Midtbyen, Solsiden, Møllenberg og Bakklandet.",
    deliveryNote: "Levering innenfor <b>Midtbyen (Trondheim sentrum), Solsiden, Møllenberg og Bakklandet</b> er gratis. Utenfor disse områdene koster levering <b>39 kr</b>. Bestillinger på over <b>9 cookies</b> leveres gratis. Betal med Vipps eller kontant ved levering.",
    orderBody: "Ingen betaling på nett, du betaler ved levering. Levering er gratis i Midtbyen, Solsiden, Møllenberg og Bakklandet, 39 kr utenfor disse områdene, og gratis ved bestillinger på over 9 cookies.",
    footDel1: "Gratis i Midtbyen, Solsiden, Møllenberg & Bakklandet",
    footDel2: "39 kr utenfor · gratis over 9 cookies",
    footDel3: "Betal ved levering (Vipps eller kontant)",
    trust1: "Gratis levering i Trondheim sentrum",
    trust4: "100 % fornøydgaranti",
    footProm3: "Fornøydgaranti",
    guaranteeNote: "Ikke fornøyd med cookiene? Si ifra, så ordner vi opp. Din tilfredshet kommer alltid først.",
    delivFree: "\u2713 Gratis levering i Midtbyen, Solsiden, Møllenberg & Bakklandet",
    delivNudge: (n) => `Legg til ${n} cookie${n > 1 ? "s" : ""} til for gratis levering`,
    delivLabel: "Levering",
    delivFreeWord: "Gratis",
    delivPending: "Fra adressen din",
    submitSending: "Sender…",
    mailDeliveryLine: (fee) => `Levering: ${fee > 0 ? kr(fee) : "Gratis"}`,
    mailDistanceLine: (km) => `Avstand fra basen: ${km.toFixed(1)} km`,
    evFormTitle: "La oss planlegge sammen",
    evFormHint: "Fortell oss litt om arrangementet, så kommer vi tilbake med idéer og et pristilbud. Ingen forpliktelser, bare en prat.",
    evOccasion: "Anledning",
    evOpt1: "Bursdag", evOpt2: "Fest / sammenkomst", evOpt3: "Bryllup", evOpt4: "Bedrift / merkevare", evOpt5: "Noe annet",
    evDate: "Dato",
    evGuests: "Omtrent hvor mange gjester?", evGuestsPh: "f.eks. 20",
    evName: "Navnet ditt", evPhone: "Telefon",
    evIdeas: "Idéene dine & stemningen", evIdeasPh: "Tema, smaker, farger, alt du drømmer om…",
    evFormSubmit: "Send forespørselen min",
    evFormFoot: "Dette sender forespørselen din rett til oss.",
    evThanks: "Forespørselen er klar til å sendes \uD83C\uDF89",
    evMailSubject: "Arrangementsforespørsel · Trondheim Cookies",
    evMailBody: (d) => `Hei Trondheim Cookies,\n\nJeg vil gjerne planlegge et arrangement med dere.\n\nAnledning: ${d.occ}\nDato: ${d.date}\nGjester: ${d.guests}\n\nIdéene mine:\n${d.ideas}\n\nNavn: ${d.name}\nTelefon: ${d.phone}\n\nGleder meg til å planlegge sammen!`,
    mailEventSubject: "Arrangementsforespørsel · Trondheim Cookies",
    mailEventBody: "Hei Trondheim Cookies,\n\nJeg vil gjerne planlegge en større bestilling til et arrangement.\n\nType arrangement: \nDato: \nAntall gjester: \nHva jeg ser for meg: \n\nNavn: \nTelefon: \n\nTakk!",
    /* email */
    mailHeader: "Ny cookie-bestilling fra Trondheim Cookies-nettsiden",
    mailOrder: "BESTILLING",
    mailSubtotalLine: (count, sub) => `${count} cookies × ${PRICE} kr = ${sub}`,
    mailGiveLine: (give) => `10% til barn i nød i Syria = ${give}`,
    mailTotalLine: (sub) => `TOTALT (betal ved levering): ${sub}`,
    mailDelivery: "LEVERING",
    mailName: "Navn", mailPhone: "Telefon", mailAddr: "Adresse", mailArea: "Område", mailWhen: "Når", mailNotes: "Notater",
    mailRefHead: "REFERANSEBILDER/-VIDEOER",
    mailRefNote: "Kunden la ved referansemedier for en egendefinert cookie. Be dem svare på denne e-posten med bildet/videoen, så gjenskaper vi den:",
    mailThanks: "Takk, kjøp med mening ♥",
    mailSubject: (name, count) => `Ny cookie-bestilling: ${name} (${count} cookies)`,
    mailBuild: "lag din egen",
  },
  ar: {
    ribbon: "<b>10%</b> من كل كوكي يذهب لأطفال سوريا المحتاجين. اشترِ بمعنى.",
    farewellFirst: "شكراً لكم يا تروندهايم. هذا ليس وداعاً.",
    farewellTitle: "من الرابع من يوليو، يرتاح الفرن لبعض الوقت. ♥",
    farewellBody: "<p>من الرابع من يوليو سنأخذ استراحة. سيرتاح الفرن لبعض الوقت، لكننا نأمل حقاً أن نشعله من جديد ونخبز لكم مرة أخرى.</p><p>بدأ كل شيء كفكرة صغيرة. أردنا فقط أن نصنع فرقاً بسيطاً لأطفال سوريا المحتاجين، وأن نضع كوكي دافئة مصنوعة يدوياً بين يديك، ببساطة لأننا نحب نشر القليل من المحبة.</p><p>مع كل كوكي طلبتها، ساعدتنا على فعل ذلك تماماً. وكان هذا هو الهدف كله.</p><p>شكراً لأنكم تذوقتم ما صنعناه، ولمشاركته مع من تحبون، ولمساعدتكم أطفال سوريا في الطريق. أنتم جعلتم الأمر حقيقياً. وإن كنت قد طلبت منا من قبل، فسنتواصل معك عندما نعود.</p>",
    farewellSign: "مع المحبة، تروندهايم كوكيز ♥",
    brandSub: "صُنع في النرويج",
    navCookies: "الكوكيز", navBuild: "اصنع كوكيتك", navOrder: "اطلب", navPromise: "وعدنا",
    navEvents: "المناسبات", navReviews: "التقييمات",
    basket: "السلة",
    heroEyebrow: "مصنوع يدويًا في النرويج · يُوصّل في تروندهايم",
    heroTitle: 'كوكيز محشوة وعصرية<br>مخبوزة <span class="amber">بمعنى.</span>',
    heroLead: "كوكيز طازجة ومصنوعة يدويًا تُوصّل إلى بابك في كل تروندهايم. ومع كل كوكي، <b>10% يذهب لأطفال سوريا المحتاجين</b>. حلوى تصنع الخير.",
    heroCta1: "اطلب الكوكيز", heroCta2: "اصنع كوكيتك",
    trust1: "توصيل مجاني في تروندهايم", trust2: "10% لسوريا", trust3: "تُخبز طازجة عند الطلب",
    impactEyebrow: "اشترِ بمعنى",
    impactTitle: "من كل كوكي يطعم أطفال سوريا المحتاجين",
    impactBody: "تطلب كوكيز تحبها. عُشر ما تدفعه يذهب مباشرة لمساعدة أطفال سوريا المحتاجين. بلا شروط، فقط لطف مخبوز بالداخل.",
    impactPill: "كل طلب يصنع فرقًا",
    cookiesEyebrow: "الكوكيز",
    cookiesTitle: "عشرة للاختيار منها",
    cookiesBody: "كوكيز كبيرة ومحشوة وفخمة. اختر مفضّلاتك، حدّد العدد، ونخبزها ونوصّلها طازجة في كل تروندهايم.",
    photoSoon: "الصورة قريبًا",
    giveTag: "10% تعطي", addBtn: "أضف",
    buildEyebrow: "اجعلها لك",
    buildTitle: "اصنع كوكيتك الخاصة",
    buildBody: "استوديو اصنع كوكيتك في الطريق. إليك لمحة عمّا هو قادم.",
    yourCookie: "كوكيتك",
    pickPrompt: "اختر عجينة وبعض الإضافات…",
    spinHint: "اسحب لتدوير الكوكي",
    buildStep1: "1 · اختر العجينة",
    buildStep2: "2 · أضف الإضافات (بقدر ما تحب)",
    buildStepUpload: "3 · رأيت واحدة أعجبتك؟ أرِنا",
    uploadCta: "ارفع صورة أو فيديو",
    uploadHint: "أرسل صورة أو مقطعًا لكوكي تريده وسنعيد صنعه بأقرب شكل ممكن.",
    refRemove: "إزالة",
    buildStep3: "4 · سمّ إبداعك",
    buildNamePh: "مثال: عاصفة تروندهايم",
    buildAdd: "أضف كوكيتي إلى السلة",
    defaultCustom: "كوكيتي الخاصة",
    orderEyebrow: "اقتربنا",
    orderTitle: "أكمل طلبك",
    orderBody: "لا دفع عبر الإنترنت. تدفع عند الاستلام. أخبرنا أين أنت في تروندهايم وسنوصّلها إليك.",
    basketTitle: "سلتك", basketHint: "الكوكي بـ 59 kr للقطعة · 150–200 جم.",
    basketEmpty: "سلتك فارغة.<br>أضف بعض الكوكيز بالأعلى.",
    refChip: "مرفق مرجعي",
    eachLabel: "للقطعة", cookieSing: "كوكي", cookiePlur: "كوكيز",
    giveLine: "يذهب لأطفال سوريا المحتاجين", totalLine: "الإجمالي",
    deliveryTitle: "تفاصيل التوصيل", deliveryHint: "نوصّل في كل منطقة تروندهايم.",
    deliveryNote: "نوصّل حاليًا فقط داخل <b>تروندهايم، النرويج</b>. ادفع بـ Vipps أو نقدًا عند تسليم الكوكيز.",
    fldName: "اسمك", phName: "الاسم الكامل", fldEmail: "بريدك الإلكتروني", phEmail: "you@email.com",
    fldPhone: "الهاتف",
    fldAddress: "عنوان التوصيل (تروندهايم)", phAddress: "الشارع، الرقم، الرمز البريدي",
    fldArea: "المنطقة / الحي", phArea: "مثال: ميدتبيين، لاده…",
    fldWhen: "اليوم/الوقت المفضل", phWhen: "مثال: السبت بعد الظهر",
    fldNotes: "ملاحظات (اختياري)", phNotes: "حساسية، جرس الباب، رسالة هدية…",
    submitBtn: "أرسل طلبي",
    formFoot: "يُرسَل طلبك مباشرة إلى مخبزنا.",
    storyEyebrow: "وعدنا",
    storyTitle: "كل كوكي يساعد طفلاً في سوريا.",
    storyBody: "بدأنا تروندهايم كوكيز بفكرة بسيطة: شيء صغير ككوكي يمكن أن يصنع شيئًا كبيرًا. لذلك <b>10% من سعر كل كوكي</b> يذهب مباشرة لمساعدة أطفال سوريا المحتاجين. أنت تستمتع بالكوكي. وطفل يحصل على المساعدة. هذا كل شيء.",
    stat1: "من كل كوكي، يُتبرّع به", stat2: "مصنوع يدويًا في النرويج", stat3: "يُوصّل بحب",
    storyQuote: '"اطلب كوكي، أطعم طفلاً. لم يكن اللطف بهذه اللذة من قبل."',
    storyBy: "وعد تروندهايم كوكيز",
    footOrder: "اطلب", footPlace: "أكمل الطلب",
    footDelivery: "التوصيل", footDel1: "منطقة تروندهايم فقط", footDel2: "الدفع عند الاستلام", footDel3: "Vipps أو نقدًا",
    footProm1: "10% لأطفال سوريا المحتاجين", footProm2: "مصنوع يدويًا، يُخبز عند الطلب",
    footCopy: "© 2026 تروندهايم كوكيز · صُنع في النرويج", footTag: "اشترِ بمعنى ♥",
    successTitle: "تم إرسال الطلب!",
    successBody: "طلبك في طريقه إلى مخبزنا. سنبدأ الخبز ونتواصل معك لتأكيد التوصيل.",
    successThanks: "شكرًا لمساعدتك أطفال سوريا المحتاجين. ♥",
    successBack: "العودة إلى الكوكيز",
    toastDefault: "أُضيفت إلى السلة",
    toastAdded: (n, name) => `أُضيف ${n} × ${name}`,
    toastCustom: (nm) => `أُضيفت "${nm}" إلى السلة`,
    toastFirst: "أضف بعض الكوكيز أولاً \uD83D\uDE42",
    toastUploaded: "أُضيف المرجع",
    navEvents: "المناسبات", navReviews: "التقييمات",
    weightTag: "150–200 جم",
    eventsEyebrow: "مناسبات أكبر",
    eventsTitle: "أعياد ميلاد، حفلات، أيام كبيرة، جاهزة.",
    eventsBody: "من علب أعياد الميلاد إلى صواني الحفلات الكاملة، نخبز تشكيلات كوكيز مبهرة لأي احتفال. أخبرنا بالأجواء وسنجعلها لا تُنسى.",
    ev1Title: "علب أعياد الميلاد", ev1Body: "علبة جاهزة كهدية من الكوكيز المحشوة، مخصصة بالأسماء والشموع وألوانك.", ev1Price: "من 349 kr",
    ev2Title: "صواني الحفلات", ev2Body: "صواني مشاركة كبيرة وأبراج كوكيز تخطف الأنظار في أي حفلة.", ev2Price: "من 690 kr",
    ev3Title: "تخصيص وتموين", ev3Body: "أعراس، هدايا شركات، إطلاق علامات، خبز بثيمات. إن حلمت به، نخبزه.", ev3Price: "لنتحدث",
    eventsCtaText: "الأهم بالنسبة لنا هو رضاك.",
    eventsCtaBtn: "خطّط لمناسبتي",
    reviewsEyebrow: "محبوبة في تروندهايم",
    reviewsTitle: "ماذا يقول الناس",
    reviewsBody: "كلمات حقيقية من محبي كوكيز حقيقيين. جرّبت واحدة؟ اترك رأيك بالأسفل.",
    reviewFormTitle: "شارك تقييمك",
    revName: "اسمك", revNamePh: "اسمك",
    revRating: "تقييمك",
    revText: "تقييمك", revTextPh: "كيف كانت كوكيتك؟",
    revSubmit: "انشر التقييم",
    revThanks: "شكرًا لمشاركتك! \uD83C\uDF6A",
    revNeedRating: "اختر تقييمًا بالنجوم أولاً \uD83D\uDE42",
    stuffedTag: "محشوة من الداخل",
    plainTag: "عجينة بسيطة · توبينغ فوقها",
    dealBanner: "اشترِ 5 واحصل على 1 مجانًا · اشترِ 9 واحصل على 2 مجانًا",
    freeLine: "كوكيز مجانية",
    dealTo1: (n) => `أضف ${n} أخرى واحصل على 1 مجانًا \uD83C\uDF89`,
    dealTo2: (n) => `أضف ${n} أخرى للحصول على 2 مجانًا \uD83C\uDF89`,
    dealGot1: "رائع! 1 كوكي مجانًا. أضف 4 أخرى لـ 2 مجانًا \uD83C\uDF89",
    dealGot2: "مذهل! حصلت على 2 كوكي مجانًا \uD83C\uDF89",
    mailFreeLine: (free, amt) => `كوكيز مجانية (${free}): -${amt}`,
    filmEyebrow: "مباشرة من الفرن",
    filmTitle: "شاهدها وهي تُصنع",
    filmBody: "طرية، محشوة، ومقسومة أمام الكاميرا. هذا بالضبط ما يصل إلى بابك.",
    soonBadge: "قريبًا",
    soonTag: "في الفرن",
    soonTitle: "اصنع كوكيتك قريبًا",
    soonBody: "قريبًا ستصمّم كوكيتك الخاصة: اختر العجينة، أضف الإضافات، وسمّها. نحن نضع اللمسات الأخيرة. أدِر الكوكي ثلاثي الأبعاد وعُد قريبًا، فهي على وشك الخروج من الفرن.",
    soonCta: "تسوّق كوكيزنا في هذه الأثناء",
    reviewsTitle: "اترك لنا تقييمًا",
    reviewsBody: "جرّبت إحدى كوكيزنا؟ يسعدنا سماع رأيك.",
    revMailSubject: "تقييم جديد · تروندهايم كوكيز",
    deliveryHint: "توصيل مجاني في ميدتبيين وسولسيدن وموللنبرغ وباكلاندت.",
    deliveryNote: "التوصيل داخل <b>ميدتبيين (وسط مدينة تروندهايم) وسولسيدن وموللنبرغ وباكلاندت</b> مجاني. خارج هذه المناطق يكون التوصيل بـ <b>39 kr</b>. الطلبات التي تزيد عن <b>9 كوكيز</b> توصيلها مجاني. ادفع بـ Vipps أو نقدًا عند الاستلام.",
    orderBody: "لا دفع عبر الإنترنت، تدفع عند الاستلام. التوصيل مجاني في ميدتبيين وسولسيدن وموللنبرغ وباكلاندت، و39 kr خارج هذه المناطق، ومجاني للطلبات التي تزيد عن 9 كوكيز.",
    footDel1: "مجاني في ميدتبيين وسولسيدن وموللنبرغ وباكلاندت",
    footDel2: "39 kr خارج المناطق · مجاني فوق 9 كوكيز",
    footDel3: "الدفع عند الاستلام (Vipps أو نقدًا)",
    trust1: "توصيل مجاني في وسط تروندهايم",
    trust4: "ضمان رضا 100%",
    footProm3: "ضمان الرضا",
    guaranteeNote: "لست راضيًا عن كوكيزك؟ أخبرنا وسنصلح الأمر. رضاك دائمًا في المقام الأول.",
    delivFree: "\u2713 توصيل مجاني في ميدتبيين وسولسيدن وموللنبرغ وباكلاندت",
    delivNudge: (n) => `أضف ${n} كوكي للحصول على توصيل مجاني`,
    delivLabel: "التوصيل",
    delivFreeWord: "مجاني",
    delivPending: "حسب عنوانك",
    submitSending: "جارٍ الإرسال…",
    mailDeliveryLine: (fee) => `التوصيل: ${fee > 0 ? kr(fee) : "مجاني"}`,
    mailDistanceLine: (km) => `المسافة من المقر: ${km.toFixed(1)} كم`,
    evFormTitle: "لنخطّط معًا",
    evFormHint: "أخبرنا قليلاً عن مناسبتك وسنعود إليك بالأفكار والسعر. بلا التزام، مجرّد دردشة.",
    evOccasion: "المناسبة",
    evOpt1: "عيد ميلاد", evOpt2: "حفلة / تجمّع", evOpt3: "زفاف", evOpt4: "شركة / علامة تجارية", evOpt5: "شيء آخر",
    evDate: "التاريخ",
    evGuests: "كم عدد الضيوف تقريبًا؟", evGuestsPh: "مثال: 20",
    evName: "اسمك", evPhone: "الهاتف",
    evIdeas: "أفكارك والأجواء", evIdeasPh: "الثيم، النكهات، الألوان، أي شيء تحلم به…",
    evFormSubmit: "أرسل استفساري",
    evFormFoot: "يُرسِل هذا استفسارك مباشرة إلينا.",
    evThanks: "الاستفسار جاهز للإرسال \uD83C\uDF89",
    evMailSubject: "استفسار مناسبة · تروندهايم كوكيز",
    evMailBody: (d) => `مرحبًا تروندهايم كوكيز،\n\nأودّ التخطيط لمناسبة معكم.\n\nالمناسبة: ${d.occ}\nالتاريخ: ${d.date}\nالضيوف: ${d.guests}\n\nأفكاري:\n${d.ideas}\n\nالاسم: ${d.name}\nالهاتف: ${d.phone}\n\nأتطلّع للتخطيط معًا!`,
    mailHeader: "طلب كوكيز جديد من موقع تروندهايم كوكيز",
    mailOrder: "الطلب",
    mailSubtotalLine: (count, sub) => `${count} كوكيز × ${PRICE} kr = ${sub}`,
    mailGiveLine: (give) => `10% لأطفال سوريا المحتاجين = ${give}`,
    mailTotalLine: (sub) => `الإجمالي (الدفع عند الاستلام): ${sub}`,
    mailDelivery: "التوصيل",
    mailName: "الاسم", mailPhone: "الهاتف", mailAddr: "العنوان", mailArea: "المنطقة", mailWhen: "الوقت", mailNotes: "ملاحظات",
    mailRefHead: "صور/فيديوهات مرجعية",
    mailRefNote: "أرفق العميل وسائط مرجعية لكوكي مخصص. يرجى الطلب منه الرد على هذا البريد بالصورة/الفيديو لنعيد صنعه:",
    mailThanks: "شكرًا، اشترِ بمعنى ♥",
    mailSubject: (name, count) => `طلب كوكيز جديد: ${name} (${count} كوكيز)`,
    mailBuild: "اصنع كوكيتك",
    mailEventSubject: "استفسار مناسبة · تروندهايم كوكيز",
    mailEventBody: "مرحبًا تروندهايم كوكيز،\n\nأود تخطيط طلب أكبر لمناسبة.\n\nنوع المناسبة: \nالتاريخ: \nعدد الضيوف: \nما أتخيله: \n\nالاسم: \nالهاتف: \n\nشكرًا!",
  },
};
const t = (key) => (I18N[LANG] && I18N[LANG][key] != null ? I18N[LANG][key] : key);

/* ---- State ---- */
let basket = [];          // { id, qty, custom, name?, dough?, mixins?, ref? }
let qtySel = {};          // per-cookie stepper selection on the grid
const build = { dough: "classic", mixins: ["choc-chips", "caramel", "sea-salt"], name: "", ref: null };

/* delivery zone resolved from the address the customer types */
let locZone = null;       // null = unknown, "free", or "fee"
let geoKm = null;         // last computed distance from base, in km
let geoSeq = 0;           // guards against out-of-order geocode results
let geoInFlight = null;   // the geocode lookup currently running
const geoCache = {};      // query -> { zone, km }, confirmed results only
let submitting = false;   // guards against double order submits

/* ---- Helpers ---- */
const $ = (id) => document.getElementById(id);
const kr = (n) => `${n} kr`;
function icons() { if (window.lucide) lucide.createIcons(); }
function scrollToId(id) { const el = $(id); if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" }); }

function recipeText(dough, mixins) {
  const d = DOUGHS.find((x) => x.id === dough);
  return [doughLabel(d), ...mixins.map((id) => mixLabel(MIXINS.find((m) => m.id === id)))].join(" · ");
}
function freeCookies(count) { return count >= 9 ? 2 : count >= 5 ? 1 : 0; }

/* ---- Delivery fee ---- */
function basketCount() { return basket.reduce((s, b) => s + b.qty, 0); }
function haversineKm(a, b) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
async function fetchJson(url, ms) {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), ms || 4000);
  try {
    const r = await fetch(url, { headers: { Accept: "application/json" }, signal: ctrl.signal });
    return r.ok ? await r.json() : null;
  } catch (e) { return null; } finally { clearTimeout(tid); }
}
/* Geocode a Norwegian address: Kartverket first (official, no key), Nominatim as fallback. */
async function geocodeNO(query) {
  const geo = await fetchJson("https://ws.geonorge.no/adresser/v1/sok?treffPerSide=1&side=0&sok=" + encodeURIComponent(query));
  const a = geo && geo.adresser && geo.adresser[0];
  if (a && a.representasjonspunkt) return { lat: a.representasjonspunkt.lat, lng: a.representasjonspunkt.lon };
  const osm = await fetchJson("https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=no&q=" + encodeURIComponent(query));
  if (Array.isArray(osm) && osm[0]) return { lat: parseFloat(osm[0].lat), lng: parseFloat(osm[0].lon) };
  return null;
}
/* The delivery fee that applies right now, from cookie count and the resolved zone. */
function effectiveDelivery(count) {
  if (count > FREE_OVER_QTY) return { fee: 0, state: "qtyfree" };
  if (locZone === "free") return { fee: 0, state: "free" };
  if (locZone === "fee") return { fee: DELIVERY_FEE, state: "fee" };
  return { fee: 0, state: "pending" };
}
/* Whole-word match so "Møllenberg" counts but "Sentrumsvegen" or "Tiller" do not. */
function isFreeArea(hay) {
  const tokens = hay.split(/[^\p{L}]+/u).filter(Boolean);
  return tokens.some((tok) => FREE_AREAS.includes(tok));
}
/* Work out whether the typed address is inside the free zone or the 2 km radius. */
async function resolveLocZone() {
  const count = basketCount();
  if (count > FREE_OVER_QTY) { renderBasket(); return; }   // free wherever it goes
  const address = ($("fAddress") ? $("fAddress").value : "").trim();
  const area = ($("fArea") ? $("fArea").value : "").trim();
  if (!address && !area) { locZone = null; geoKm = null; renderBasket(); return; }
  if (isFreeArea((address + " " + area).toLowerCase())) { locZone = "free"; geoKm = null; renderBasket(); return; }
  const query = [address, area, "Trondheim"].filter(Boolean).join(", ");
  const cached = geoCache[query];
  if (cached) { locZone = cached.zone; geoKm = cached.km; renderBasket(); return; }
  if (geoInFlight && geoInFlight.query === query) { await geoInFlight.promise; renderBasket(); return; }
  const myReq = ++geoSeq;
  const promise = geocodeNO(query);
  geoInFlight = { query, promise };
  const loc = await promise;
  if (geoInFlight && geoInFlight.query === query) geoInFlight = null;
  if (myReq !== geoSeq) { renderBasket(); return; }   // superseded by a newer address
  if (loc) {
    const km = haversineKm(ORIGIN, loc);
    geoKm = km;
    locZone = km <= FREE_RADIUS_KM ? "free" : "fee";
    geoCache[query] = { zone: locZone, km };           // cache confirmed results only
  } else {
    geoKm = null;
    locZone = "fee";   // could not place the address: treat as outside, retried next time
  }
  renderBasket();
}
/* Auto-resolve the zone once an address is present (e.g. after the basket changes). */
function maybeResolveZone() {
  if (geoInFlight || locZone !== null || basketCount() > FREE_OVER_QTY) return;
  const hasAddr = (($("fAddress") && $("fAddress").value.trim()) || ($("fArea") && $("fArea").value.trim()));
  if (hasAddr) resolveLocZone();
}

let toastTimer;
function toast(msg) {
  $("toastMsg").textContent = msg;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("show"), 1900);
}

/* ============================================================
   3D COOKIE (Three.js) — the heart of build-your-own
   ============================================================ */
let C3D = null;
function initCookie3D() {
  const host = $("cookie3d");
  if (!host || !window.THREE) return;
  const w = host.clientWidth || 320, h = host.clientHeight || 300;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
  camera.position.set(0, 5.4, 4.0);
  camera.lookAt(0, -0.2, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  host.appendChild(renderer.domElement);

  // warm cinematic lighting (filmic tone-mapped)
  scene.add(new THREE.HemisphereLight(0xfff3e2, 0x2a1810, 0.4));
  const key = new THREE.DirectionalLight(0xffffff, 1.05); key.position.set(5, 9, 6); scene.add(key);
  const warm = new THREE.PointLight(0xffb463, 0.5, 45); warm.position.set(-5, 4, 5); scene.add(warm);
  const rim = new THREE.DirectionalLight(0xffd9a8, 0.32); rim.position.set(-4, 3, -6); scene.add(rim);

  const group = new THREE.Group();
  scene.add(group);

  // cookie body: a flattened, organically-bumpy, crackled sphere
  const geo = new THREE.SphereGeometry(2, 128, 96);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    v.y *= 0.55; // flatten into a thick, stuffed cookie
    const n = Math.sin(v.x * 3.1 + v.z * 2.2) * 0.05 + Math.cos(v.z * 3.4 - v.x * 1.7) * 0.05;
    const lift = Math.sin(v.x * 6.0) * Math.cos(v.z * 5.0) * 0.04;
    const crack = Math.sin(v.x * 11 + v.z * 9) * Math.sin(v.z * 12 - v.x * 8) * 0.028;
    v.x *= 1 + n * 0.16; v.z *= 1 + n * 0.16;
    if (v.y > -0.1) v.y += (n + lift + crack) * 0.95; // crackly top
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();

  // bake a warm shade map into vertex colours: darker baked base/rim,
  // lighter golden crown, plus random toasted speckle. Multiplies the dough colour.
  const colors = [];
  for (let i = 0; i < pos.count; i++) {
    let shade = 0.6 + 0.28 * Math.min(1, Math.max(0, (pos.getY(i) + 1.0) / 1.9));
    shade += (Math.random() - 0.5) * 0.09;
    shade = Math.min(1.0, Math.max(0.42, shade));
    colors.push(shade, shade * 0.93, shade * 0.82);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color("#BE7838"), roughness: 0.9, metalness: 0.0, vertexColors: true });
  const cookie = new THREE.Mesh(geo, mat);
  group.add(cookie);

  // a soft warm shadow disc under the cookie
  const discMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.16 });
  const disc = new THREE.Mesh(new THREE.CircleGeometry(2.2, 48), discMat);
  disc.rotation.x = -Math.PI / 2; disc.position.y = -1.05; group.add(disc);

  const mixGroup = new THREE.Group();
  group.add(mixGroup);

  C3D = { scene, camera, renderer, group, cookie, mat, mixGroup, host, dragging: false };

  // pointer drag to spin
  let lastX = 0, lastY = 0;
  const el = renderer.domElement;
  el.style.touchAction = "none";
  el.addEventListener("pointerdown", (e) => { C3D.dragging = true; lastX = e.clientX; lastY = e.clientY; el.setPointerCapture(e.pointerId); });
  el.addEventListener("pointermove", (e) => {
    if (!C3D.dragging) return;
    group.rotation.y += (e.clientX - lastX) * 0.01;
    group.rotation.x = Math.max(-0.7, Math.min(0.7, group.rotation.x + (e.clientY - lastY) * 0.008));
    lastX = e.clientX; lastY = e.clientY;
  });
  const stop = () => { C3D.dragging = false; };
  el.addEventListener("pointerup", stop);
  el.addEventListener("pointerleave", stop);
  el.addEventListener("pointercancel", stop);

  window.addEventListener("resize", () => {
    const nw = host.clientWidth, nh = host.clientHeight;
    if (!nw || !nh) return;
    camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh);
  });

  (function frame() {
    requestAnimationFrame(frame);
    if (!C3D.dragging) group.rotation.y += 0.004;
    renderer.render(scene, camera);
  })();
}

function topY(r) { // approx y of the bumpy top surface at radius r
  const rr = Math.max(0, 4 - r * r);
  return 0.55 * Math.sqrt(rr) + 0.06;
}
function updateCookie3DDough() {
  if (!C3D) return;
  const d = DOUGHS.find((x) => x.id === build.dough);
  C3D.mat.color.set(d.hex);
}
function updateCookie3DMixins() {
  if (!C3D) return;
  const g = C3D.mixGroup;
  while (g.children.length) { const c = g.children[0]; g.remove(c); c.geometry.dispose(); c.material.dispose(); }

  // Freeze rotation so we can raycast in the cookie's local frame, then restore.
  const savedX = C3D.group.rotation.x, savedY = C3D.group.rotation.y;
  C3D.group.rotation.set(0, 0, 0);
  C3D.group.updateWorldMatrix(true, true);
  const ray = new THREE.Raycaster();
  const down = new THREE.Vector3(0, -1, 0);

  build.mixins.forEach((id, mi) => {
    const m = MIXINS.find((x) => x.id === id); if (!m) return;
    const col = new THREE.Color(m.dot);
    const GLOSS = { "choc-chips": 0.34, "white-choc": 0.4, caramel: 0.22, "sea-salt": 0.85, nuts: 0.6, oats: 0.85, berries: 0.3, sprinkles: 0.3 };
    const CLEAR = { "choc-chips": 0.6, "white-choc": 0.45, caramel: 0.9, "sea-salt": 0.1, nuts: 0.2, oats: 0.15, berries: 0.55, sprinkles: 0.6 };
    const per = 6;
    for (let k = 0; k < per; k++) {
      const ang = (mi * 1.7 + k * 2.399) % (Math.PI * 2);
      const rad = 0.25 + Math.sqrt(Math.random()) * 1.25;
      const x = Math.cos(ang) * rad, z = Math.sin(ang) * rad;
      ray.set(new THREE.Vector3(x, 6, z), down);
      const hit = ray.intersectObject(C3D.cookie, false)[0];
      if (!hit) continue; // outside the cookie
      const s = 0.13 + Math.random() * 0.1;
      let geom;
      if (id === "choc-chips" || id === "white-choc") geom = new THREE.IcosahedronGeometry(s, 0); // faceted chunk
      else if (id === "oats") geom = new THREE.BoxGeometry(s * 1.8, s * 0.45, s * 1.1); // flake
      else geom = new THREE.SphereGeometry(s, 16, 12);
      const chip = new THREE.Mesh(
        geom,
        new THREE.MeshPhysicalMaterial({ color: col, roughness: GLOSS[id] ?? 0.5, metalness: 0, clearcoat: CLEAR[id] ?? 0.3, clearcoatRoughness: 0.35 })
      );
      chip.position.copy(hit.point);
      chip.position.y += s * 0.4; // half-embedded, top pokes out of the dough
      if (id === "nuts") chip.scale.set(1.3, 0.7, 0.85); // almond/hazelnut shape
      else if (id === "sprinkles") chip.scale.set(0.7, 0.7, 1.8); // little baton
      else chip.scale.y = 0.7;
      chip.rotation.set(Math.random() * 0.6, Math.random() * Math.PI, Math.random() * 0.6);
      g.add(chip);
    }
  });

  C3D.group.rotation.set(savedX, savedY, 0);
}

/* ============================================================
   COOKIE GRID
   ============================================================ */
function renderGrid() {
  const grid = $("cookieGrid");
  grid.innerHTML = COOKIES.map((c, idx) => {
    qtySel[c.id] = qtySel[c.id] || 1;
    return `
    <article class="ccard">
      <div class="photo">
        <span class="no">NO.${String(idx + 1).padStart(2, "0")}</span>
        <span class="give-tag">${t("giveTag")}</span>
        <img src="${c.img}" alt="${cookieName(c)}" loading="lazy" onerror="this.style.display='none'">
        <span class="ph"><i data-lucide="cookie"></i><span>${t("photoSoon")}</span></span>
      </div>
      <div class="cbody">
        <div class="ctop">
          <span class="cname">${cookieName(c)}</span>
          <span class="cprice">${kr(PRICE)}</span>
        </div>
        <p class="cdesc">${cookieDesc(c)}</p>
        <div class="cmeta">
          <span class="cspec"><i data-lucide="scale"></i> ${t("weightTag")}</span>
          <span class="cstuffed ${c.stuffed ? "is-stuffed" : "is-plain"}"><i data-lucide="${c.stuffed ? "layers" : "circle"}"></i> ${c.stuffed ? t("stuffedTag") : t("plainTag")}</span>
        </div>
        <div class="add-row">
          <div class="stepper">
            <button onclick="stepQty('${c.id}',-1)" aria-label="less">–</button>
            <span class="q" id="q-${c.id}">${qtySel[c.id]}</span>
            <button onclick="stepQty('${c.id}',1)" aria-label="more">+</button>
          </div>
          <button class="add-btn" onclick="addCookie('${c.id}')"><i data-lucide="plus"></i> ${t("addBtn")}</button>
        </div>
      </div>
    </article>`;
  }).join("");
  icons();
}
function stepQty(id, d) {
  qtySel[id] = Math.max(1, (qtySel[id] || 1) + d);
  $("q-" + id).textContent = qtySel[id];
}
function addCookie(id) {
  const c = COOKIES.find((x) => x.id === id);
  const n = qtySel[id] || 1;
  const found = basket.find((b) => b.id === id && !b.custom);
  if (found) found.qty += n; else basket.push({ id, qty: n, custom: false });
  qtySel[id] = 1; $("q-" + id).textContent = 1;
  renderBasket();
  toast(t("toastAdded")(n, cookieName(c)));
}

/* ============================================================
   BUILD YOUR OWN
   ============================================================ */
function renderBuilder() {
  const dc = $("doughChips");
  if (dc) {
    dc.innerHTML = DOUGHS.map((d) =>
      `<button class="chip ${build.dough === d.id ? "on" : ""}" onclick="pickDough('${d.id}')"><span class="dot" style="background:${d.hex}"></span>${doughLabel(d)}</button>`).join("");
    $("mixChips").innerHTML = MIXINS.map((m) =>
      `<button class="chip ${build.mixins.includes(m.id) ? "on" : ""}" onclick="toggleMix('${m.id}')"><span class="dot" style="background:${m.dot}"></span>${mixLabel(m)}</button>`).join("");
  }
  updatePreview();
}
function pickDough(id) { build.dough = id; renderBuilder(); }
function toggleMix(id) {
  const i = build.mixins.indexOf(id);
  if (i >= 0) build.mixins.splice(i, 1); else build.mixins.push(id);
  renderBuilder();
}
function updatePreview() {
  updateCookie3DDough();
  updateCookie3DMixins();
  const mr = $("myRecipe");
  if (mr) mr.textContent = (build.mixins.length || build.dough) ? recipeText(build.dough, build.mixins) : t("pickPrompt");
  const mn = $("myName");
  if (mn) { const bn = $("buildName"); mn.textContent = (bn && bn.value.trim()) || t("yourCookie"); }
}

/* ---- reference photo / video upload ---- */
function handleRefUpload(input) {
  const f = input.files && input.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    build.ref = { name: f.name, type: f.type || "", url: e.target.result };
    renderRefPreview();
    toast(t("toastUploaded"));
  };
  reader.readAsDataURL(f);
}
function renderRefPreview() {
  const box = $("refPreview");
  if (!box) return;
  if (!build.ref) { box.innerHTML = ""; box.classList.remove("on"); return; }
  box.classList.add("on");
  const isVid = build.ref.type.startsWith("video");
  box.innerHTML = `
    ${isVid
      ? `<video src="${build.ref.url}" muted autoplay loop playsinline></video>`
      : `<img src="${build.ref.url}" alt="reference">`}
    <span class="ref-name">${build.ref.name}</span>
    <button class="ref-remove" type="button" onclick="clearRef()" aria-label="${t("refRemove")}"><i data-lucide="x"></i></button>`;
  icons();
}
function clearRef() {
  build.ref = null;
  const inp = $("refInput"); if (inp) inp.value = "";
  renderRefPreview();
}
function addCustomToBasket() {
  const nm = $("buildName").value.trim() || t("defaultCustom");
  basket.push({ id: "custom-" + Date.now(), qty: 1, custom: true, name: nm, dough: build.dough, mixins: [...build.mixins], ref: build.ref });
  renderBasket();
  toast(t("toastCustom")(nm));
  // reset name + reference for the next creation
  $("buildName").value = "";
  clearRef();
  updatePreview();
}

/* ============================================================
   BASKET + TOTALS
   ============================================================ */
function itemName(b) { return b.custom ? b.name : cookieName(COOKIES.find((c) => c.id === b.id)); }
function itemImg(b) { return b.custom ? null : (COOKIES.find((c) => c.id === b.id) || {}).img; }

function renderBasket() {
  const list = $("basketList");
  const count = basket.reduce((s, b) => s + b.qty, 0);
  $("navCount").textContent = count;

  if (basket.length === 0) {
    list.innerHTML = `<div class="empty"><i data-lucide="shopping-bag"></i><p style="margin-top:10px">${t("basketEmpty")}</p></div>`;
    $("totals").style.display = "none";
    icons();
    return;
  }

  list.innerHTML = basket.map((b, i) => {
    const isVid = b.ref && b.ref.type.startsWith("video");
    const thumb = b.custom
      ? (b.ref
          ? (isVid ? `<video src="${b.ref.url}" muted></video>` : `<img src="${b.ref.url}" alt="">`)
          : `<i data-lucide="sparkles"></i>`)
      : `<img src="${itemImg(b)}" alt="" onerror="this.style.display='none'"><i data-lucide="cookie"></i>`;
    return `
    <div class="bitem">
      <div class="bthumb">${thumb}</div>
      <div class="binfo">
        <div class="bn">${itemName(b)}</div>
        ${b.custom ? `<div class="br">${recipeText(b.dough, b.mixins)}</div>` : ``}
        ${b.custom && b.ref ? `<div class="ref-tag"><i data-lucide="paperclip"></i> ${t("refChip")}</div>` : ``}
        <div class="bp">${kr(PRICE)} ${t("eachLabel")}</div>
      </div>
      <div class="stepper">
        <button onclick="basketQty(${i},-1)">–</button>
        <span class="q">${b.qty}</span>
        <button onclick="basketQty(${i},1)">+</button>
      </div>
    </div>`;
  }).join("");

  const subtotal = count * PRICE;
  const free = freeCookies(count);
  const discount = free * PRICE;
  const cookiesTotal = subtotal - discount;
  const give = Math.round(cookiesTotal * GIVE_PCT);
  const dlv = effectiveDelivery(count);
  const total = cookiesTotal + dlv.fee;
  $("countLine").textContent = `${count} ${count === 1 ? t("cookieSing") : t("cookiePlur")}`;
  $("subtotal").textContent = kr(subtotal);
  const freeRow = $("freeRow");
  if (freeRow) {
    if (free > 0) { freeRow.style.display = "flex"; $("freeLabel").textContent = `${t("freeLine")} (${free})`; $("freeAmt").textContent = "-" + kr(discount); }
    else freeRow.style.display = "none";
  }
  const delivRow = $("delivRow");
  if (delivRow) {
    $("delivLabel").textContent = t("delivLabel");
    if (dlv.state === "fee") { delivRow.classList.remove("free-row"); $("delivAmt").textContent = kr(dlv.fee); }
    else if (dlv.state === "pending") { delivRow.classList.remove("free-row"); $("delivAmt").textContent = t("delivPending"); }
    else { delivRow.classList.add("free-row"); $("delivAmt").textContent = t("delivFreeWord"); }
  }
  $("giveAmt").textContent = kr(give);
  $("grandTotal").textContent = kr(total);
  const nudge = $("dealNudge");
  if (nudge) {
    let msg;
    if (count < 5) msg = t("dealTo1")(5 - count);
    else if (count === 5) msg = t("dealGot1");
    else if (count < 9) msg = t("dealTo2")(9 - count);
    else msg = t("dealGot2");
    nudge.textContent = msg;
    nudge.style.display = "flex";
  }
  $("totals").style.display = "block";
  maybeResolveZone();
  icons();
}
function basketQty(i, d) {
  basket[i].qty += d;
  if (basket[i].qty <= 0) basket.splice(i, 1);
  renderBasket();
}

/* ============================================================
   ORDER -> EMAIL  (no payment; bakery delivers & collects)
   ============================================================ */
async function submitOrder(e) {
  e.preventDefault();
  if (submitting) return false;
  if (basket.length === 0) { toast(t("toastFirst")); scrollToId("cookies"); return false; }

  submitting = true;
  const btn = $("submitBtn");
  const lbl = btn ? btn.querySelector("span") : null;
  const prevLbl = lbl ? lbl.textContent : "";
  if (btn) btn.disabled = true;
  if (lbl) lbl.textContent = t("submitSending");
  try {
  // lock in the delivery fee for the address that was just entered
  await resolveLocZone();

  const name = $("fName").value.trim();
  const email = $("fEmail").value.trim();
  const address = $("fAddress").value.trim();
  const area = $("fArea").value.trim();
  const when = $("fWhen").value.trim();
  const notes = $("fNotes").value.trim();

  const count = basket.reduce((s, b) => s + b.qty, 0);
  const subtotal = count * PRICE;
  const free = freeCookies(count);
  const discount = free * PRICE;
  const cookiesTotal = subtotal - discount;
  const give = Math.round(cookiesTotal * GIVE_PCT);
  const dlv = effectiveDelivery(count);
  const total = cookiesTotal + dlv.fee;

  const lines = basket.map((b) =>
    `• ${b.qty} × ${itemName(b)}${b.custom ? ` (${t("mailBuild")}: ${recipeText(b.dough, b.mixins)})` : ""}${b.custom && b.ref ? ` [+ reference: ${b.ref.name}]` : ""} · ${kr(b.qty * PRICE)}`
  ).join("\n");

  const refs = basket.filter((b) => b.custom && b.ref);
  const refBlock = refs.length
    ? `\n${t("mailRefHead")}\n${t("mailRefNote")}\n${refs.map((b) => `• ${b.name}: ${b.ref.name}`).join("\n")}\n`
    : "";

  const body =
`${t("mailHeader")}
------------------------------------------------

${t("mailOrder")}
${lines}

${t("mailSubtotalLine")(count, kr(subtotal))}
${free ? t("mailFreeLine")(free, kr(discount)) + "\n" : ""}${t("mailDeliveryLine")(dlv.fee)}
${t("mailGiveLine")(kr(give))}
${t("mailTotalLine")(kr(total))}
${refBlock}
${t("mailDelivery")}
${t("mailName")}:    ${name}
Email: ${email}
${t("mailAddr")}: ${address}
${t("mailArea")}:    ${area || "-"}
${dlv.state !== "qtyfree" && geoKm != null ? t("mailDistanceLine")(geoKm) + "\n" : ""}${t("mailWhen")}:    ${when || "-"}
${t("mailNotes")}:   ${notes || "-"}

${t("mailThanks")}`;

  const subject = t("mailSubject")(name, count);
  // Send straight to the bakery inbox via our SendGrid endpoint (no email app needed).
  sendToBakery({ subject, text: body, replyTo: email });

  $("success").classList.add("show");
  } finally {
    submitting = false;
    if (btn) btn.disabled = false;
    if (lbl) lbl.textContent = prevLbl;
  }
  return false;
}

/* Deliver a message to the bakery inbox through /api/order (SendGrid).
   Falls back to opening the visitor's email app if the request fails. */
function sendToBakery({ subject, text, replyTo }) {
  return fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject, text, replyTo: replyTo || "" }),
  })
    .then((r) => { if (!r.ok) throw new Error("send failed"); return r; })
    .catch(() => {
      window.location.href =
        `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    });
}
function closeSuccess() {
  $("success").classList.remove("show");
  scrollToId("cookies");
}

/* ============================================================
   LANGUAGE
   ============================================================ */
/* ============================================================
   REVIEWS
   ============================================================ */
const SEED_REVIEWS = [
  { name: "Ingrid", rating: 5, text: { en: "The Dubai Drip is unreal. Gooey, crunchy, gone in two minutes.", no: "Dubai-dryppet er helt sykt godt. Seig, spr\u00f8, borte p\u00e5 to minutter.", ar: "\u062f\u0648\u0628\u0627\u064a \u062f\u0631\u064a\u0628 \u0644\u0627 \u064a\u064f\u0635\u062f\u0651\u0642. \u0637\u0631\u064a\u060c \u0645\u0642\u0631\u0645\u0634\u060c \u0627\u062e\u062a\u0641\u0649 \u0641\u064a \u062f\u0642\u064a\u0642\u062a\u064a\u0646." } },
  { name: "Mathias", rating: 5, text: { en: "Ordered a birthday box and everyone lost it. And it helps kids in need in Syria, win-win.", no: "Bestilte en bursdagsboks og alle ble helt ville. Og det hjelper barn i nød i Syria, win-win.", ar: "\u0637\u0644\u0628\u062a \u0639\u0644\u0628\u0629 \u0639\u064a\u062f \u0645\u064a\u0644\u0627\u062f \u0648\u0627\u0644\u062c\u0645\u064a\u0639 \u0623\u062d\u0628\u0651\u0647\u0627. \u0648\u062a\u0633\u0627\u0639\u062f \u0623\u0637\u0641\u0627\u0644 \u0633\u0648\u0631\u064a\u0627\u060c \u0645\u0643\u0633\u0628 \u0644\u0644\u062c\u0645\u064a\u0639." } },
  { name: "Sara", rating: 4, text: { en: "Warm, fresh, massive. The Campfire tastes exactly like a s'more.", no: "Varm, fersk, enorm. B\u00e5lcookien smaker akkurat som en s'more.", ar: "\u062f\u0627\u0641\u0626\u0629\u060c \u0637\u0627\u0632\u062c\u0629\u060c \u0636\u062e\u0645\u0629. \u0628\u0627\u0644 \u0643\u0648\u0643\u064a \u0637\u0639\u0645\u0647\u0627 \u062a\u0645\u0627\u0645\u064b\u0627 \u0645\u062b\u0644 \u0627\u0644\u0633\u0645\u0648\u0631." } },
];
function getReviews() { try { return JSON.parse(localStorage.getItem("tc_reviews") || "[]"); } catch (e) { return []; } }
function saveReviews(list) { localStorage.setItem("tc_reviews", JSON.stringify(list)); }
let starSel = 0;
function escapeHtml(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function starsHtml(n) { let s = ""; for (let i = 1; i <= 5; i++) s += `<i data-lucide="star"${i <= n ? ' style="fill:currentColor"' : ' style="opacity:.3"'}></i>`; return s; }
function renderReviews() {
  const list = $("reviewList"); if (!list) return;
  const user = getReviews();
  const seeds = SEED_REVIEWS.map((r) => ({ name: r.name, rating: r.rating, text: r.text[LANG] || r.text.en }));
  const all = [...user, ...seeds];
  list.innerHTML = all.map((r) => `
    <div class="review-card">
      <div class="stars">${starsHtml(r.rating)}</div>
      <div class="rtext">${escapeHtml(r.text)}</div>
      <div class="rby">${escapeHtml(r.name)}</div>
    </div>`).join("");
  icons();
}
function renderStarInput() {
  const box = $("starInput"); if (!box) return;
  box.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = i <= starSel ? "on" : "";
    b.innerHTML = `<i data-lucide="star"></i>`;
    b.addEventListener("click", () => { starSel = i; renderStarInput(); });
    box.appendChild(b);
  }
  icons();
}
function submitReview(e) {
  e.preventDefault();
  if (!starSel) { toast(t("revNeedRating")); return false; }
  const name = $("rvName").value.trim();
  const text = $("rvText").value.trim();
  if (!name || !text) return false;
  const stars = "\u2605".repeat(starSel) + "\u2606".repeat(5 - starSel);
  const body = `${stars} (${starSel}/5)\n\n${text}\n\n${name}`;
  sendToBakery({ subject: t("revMailSubject"), text: body });
  $("rvName").value = ""; $("rvText").value = ""; starSel = 0;
  renderStarInput();
  toast(t("revThanks"));
  return false;
}

/* ============================================================
   EVENT ENQUIRY (bigger happenings)
   ============================================================ */
function eventEnquiry() {
  sendToBakery({ subject: t("mailEventSubject"), text: t("mailEventBody") });
}
function eventSubmit(e) {
  e.preventDefault();
  const typeEl = $("evType");
  const occ = typeEl ? typeEl.options[typeEl.selectedIndex].text : "";
  const d = {
    occ,
    date: $("evDate").value || "-",
    guests: $("evGuests").value || "-",
    name: $("evName").value.trim(),
    phone: $("evPhone").value.trim(),
    ideas: $("evIdeas").value.trim() || "-",
  };
  sendToBakery({ subject: t("evMailSubject"), text: t("evMailBody")(d), replyTo: "" });
  toast(t("evThanks"));
  return false;
}

function applyLang() {
  document.documentElement.lang = LANG;
  document.documentElement.dir = (LANG === "ar") ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.getAttribute("data-i18n")); });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });
  document.querySelectorAll("#langSwitch button").forEach((b) => b.classList.toggle("on", b.dataset.lang === LANG));
  renderGrid();
  renderBuilder();
  renderRefPreview();
  renderBasket();
  renderReviews();
  renderStarInput();
  icons();
}
function setLang(lang) {
  if (lang !== "en" && lang !== "no" && lang !== "ar") return;
  LANG = lang;
  localStorage.setItem("tc_lang", lang);
  applyLang();
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  document.querySelectorAll("#langSwitch button").forEach((b) => {
    b.addEventListener("click", () => setLang(b.dataset.lang));
  });
  initCookie3D();
  applyLang();
  const bn = $("buildName"); if (bn) bn.addEventListener("input", updatePreview);
  const inp = $("refInput");
  if (inp) inp.addEventListener("change", () => handleRefUpload(inp));
  const addrEl = $("fAddress"); if (addrEl) addrEl.addEventListener("blur", resolveLocZone);
  const areaEl = $("fArea"); if (areaEl) areaEl.addEventListener("blur", resolveLocZone);
  const filmVid = document.querySelector("#film video");
  if (filmVid) { filmVid.play().catch(() => {}); }
  icons();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
