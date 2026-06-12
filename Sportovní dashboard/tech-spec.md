# SportPulse - Technická specifikace

## Technologie

| Technologie | Použití |
|---|---|
| HTML5 | Struktura stránek |
| CSS3 | Styling, layout, responzivní design |
| JavaScript (ES6+) | Interaktivita, API volání, autentikace |
| FontAwesome 6.5.1 | Ikony |
| Geist Font | Typography |
| TheSportsDB API | Sportovní data |

---

## Struktura projektu

```
/
├── index.html          # Landing / Login stránka
├── register.html       # Registrace
├── dashboard.html      # Hlavní dashboard
├── search.html         # Výsledky vyhledávání
├── match.html          # Detail zápasu
├── league.html         # Stránka ligy
├── team.html           # Stránka týmu
├── css/
│   └── style.css       # Hlavní stylesheet
├── js/
│   ├── auth.js         # Autentikační logika
│   ├── api.js          # API komunikace
│   ├── dashboard.js    # Dashboard logika
│   ├── search.js       # Vyhledávání
│   ├── match.js        # Detail zápasu
│   ├── league.js       # Stránka ligy
│   ├── team.js         # Stránka týmu
│   └── utils.js        # Pomocné funkce
```

---

## API Endpointy (TheSportsDB)

| Endpoint | Popis |
|---|---|
| `eventsday.php?d=YYYY-MM-DD` | Události pro konkrétní den |
| `eventspastleague.php?id={id}` | Minulé události ligy |
| `eventsseason.php?id={id}&s={season}` | Události sezóny |
| `all_leagues.php` | Seznam všech lig |
| `all_sports.php` | Seznam všech sportů |
| `searchteams.php?t={name}` | Vyhledávání týmů |
| `searchevents.php?e={name}` | Vyhledávání událostí |
| `lookupteam.php?id={id}` | Detail týmu |
| `lookupleague.php?id={id}` | Detail ligy |
| `lookupevent.php?id={id}` | Detail události |
| `lookup_all_players.php?id={id}` | Hráči týmu |
| `lookuptable.php?l={id}&s={season}` | Tabulka ligy |
| `eventslast.php?id={id}` | Poslední zápasy týmu |
| `eventsnext.php?id={id}` | Nadcházející zápasy týmu |

---

## Autentikace (localStorage)

```javascript
// Struktura users v localStorage
users = [
  { id, username, email, password, createdAt }
]

// currentUser v sessionStorage
currentUser = { id, username, email }
```

---

## JavaScript Moduly

### auth.js
- `register(username, email, password)` - registrace uživatele
- `login(email, password)` - přihlášení
- `logout()` - odhlášení
- `checkAuth()` - kontrola přihlášení
- `getCurrentUser()` - získání aktuálního uživatele

### api.js
- `fetchAPI(endpoint)` - základní fetch s error handling
- `getEventsByDay(date, sport?, league?)` - události dne
- `getPastEventsByLeague(leagueId)` - minulé události ligy
- `getAllLeagues()` - všechny ligy
- `getAllSports()` - všechny sporty
- `searchEvents(query)` - vyhledávání událostí
- `searchTeams(query)` - vyhledávání týmů
- `getTeamDetails(teamId)` - detail týmu
- `getLeagueDetails(leagueId)` - detail ligy
- `getEventDetails(eventId)` - detail události
- `getLeagueTable(leagueId, season)` - tabulka ligy
- `getTeamPlayers(teamId)` - hráči týmu
- `getTeamLastEvents(teamId)` - poslední zápasy týmu
- `getTeamNextEvents(teamId)` - nadcházející zápasy týmu

### utils.js
- `formatDate(dateString)` - formátování data
- `formatTime(dateString)` - formátování času
- `debounce(func, delay)` - debounce funkce
- `getUrlParam(param)` - získání query parametru
- `showError(element, message)` - zobrazení chyby
- `hideError(element)` - skrytí chyby

---

## Routing

Všechny stránky jsou samostatné HTML soubory. Předávání dat přes URL query parametry:
- `match.html?id=441613`
- `league.html?id=4328`
- `team.html?id=133602`
- `search.html?q=arsenal`

---

## Responzivní breakpointy

| Breakpoint | Šířka | Změny |
|---|---|---|
| Desktop | >= 1024px | 3 sloupce zápasů, 6 karet lig |
| Tablet | 768-1023px | 2 sloupce zápasů, 3 karty lig |
| Mobil | < 768px | 1 sloupec, hamburger menu |

---

## Performance optimalizace

- Cachování API odpovědí v localStorage (5 minut expiry)
- Lazy loading obrázků (loading="lazy")
- Debounce na vyhledávání (300ms)
- Minimální počet API volání

---

## Závislosti (CDN)

```html
<!-- FontAwesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

<!-- Geist Font -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.2.0/dist/fonts/geist-sans.css">
```
