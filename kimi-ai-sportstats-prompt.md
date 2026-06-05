# Prompt pro Kimi AI – SportStats Dashboard

Create a complete full-stack web application called **SportStats Dashboard**.

## Project Overview

SportStats Dashboard is a modern sports statistics platform that aggregates data from multiple public APIs and displays live information about sports events, teams, players, and Formula 1 races.

The application must look professional and production-ready.

---

## Tech Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript ES6+
- Responsive design
- Dark theme

### Backend

- Node.js
- Express.js

### Database

- MySQL

### APIs

#### Formula 1

Use one of these APIs:

- OpenF1 API
- Jolpica / Ergast compatible API

Features:

- Current season standings
- Drivers
- Constructors
- Race results
- Qualifying results
- Race calendar

#### Football

Use:

- OpenLigaDB API

Features:

- Live matches
- Match results
- League tables
- Team information

---

## Authentication System

### Login Page

Fields:

- Email
- Password

Buttons:

- Login

Links:

- Forgot Password?

Requirements:

- Email validation
- Password validation
- Modern design
- Small forgot password button/link under login form

---

## Register Page

Fields:

- Username
- Email
- Password
- Confirm Password

Requirements:

- Passwords must match
- Minimum password length: 8 characters
- Email validation
- Show clear validation errors

---

## Dashboard

After login, redirect user to the dashboard.

Dashboard should contain a modern navigation sidebar.

Sidebar items:

- Dashboard
- Football
- Formula 1
- Favorites
- Search History
- Profile
- Settings
- Logout

---

## Dashboard Home

Create cards showing:

- Total football matches
- Formula 1 races
- Favorite teams
- Favorite drivers
- Recent searches

---

## Football Section

Display football data from API.

### Live Matches

Show:

- Home team
- Away team
- Current score
- Match status
- Match date
- League

### Match Results

Show:

- Home team
- Away team
- Final score
- Match date

### League Table

Show:

- Position
- Team
- Matches
- Wins
- Draws
- Losses
- Points

### Team Details

Show:

- Team logo
- Team name
- Statistics

---

## Formula 1 Section

Display Formula 1 data from API.

### Driver Standings

Table columns:

- Position
- Driver
- Team
- Nationality
- Points

### Constructor Standings

Table columns:

- Position
- Team
- Points

### Race Calendar

Display:

- Race name
- Country
- Circuit
- Date

### Race Results

Display:

- Position
- Driver
- Team
- Time
- Points

---

## Favorites System

Users can:

- Add favorite teams
- Remove favorite teams
- Add favorite drivers
- Remove favorite drivers

Store data in MySQL.

---

## Search System

Create a global search bar.

Users can search:

- Teams
- Drivers
- Races
- Matches

Store search history in MySQL.

---

## User Profile

Display:

- Username
- Email
- Registration date

Allow:

- Change password
- Change email

---

## Settings

Allow:

- Dark mode
- Light mode
- Notifications on/off

Save settings in MySQL.

---

## Database Structure

Create SQL schema with these tables:

- users
- favorites
- search_history
- settings

Include:

- Primary keys
- Foreign keys
- Constraints
- Created/updated timestamps

---

## Backend Requirements

Create REST API routes.

### Authentication

```http
POST /api/register
POST /api/login
POST /api/forgot-password
```

### Favorites

```http
GET /api/favorites
POST /api/favorites
DELETE /api/favorites/:id
```

### History

```http
GET /api/history
POST /api/history
DELETE /api/history/:id
```

### Football

```http
GET /api/football/matches
GET /api/football/results
GET /api/football/table
GET /api/football/teams
```

### Formula 1

```http
GET /api/f1/drivers
GET /api/f1/constructors
GET /api/f1/races
GET /api/f1/results
```

---

## Frontend Requirements

Use:

- Modern glassmorphism design
- Smooth animations
- Responsive layout
- Mobile support
- Loading indicators
- Error handling
- Fetch API
- Clean reusable JavaScript functions

The frontend must call the backend API routes, not hardcoded data.

If an external sports API fails, display a clean error message and fallback demo data.

---

## UI Design Requirements

Design style:

- Dark modern sports dashboard
- Cards with shadows and rounded corners
- Clean typography
- Responsive sidebar
- Mobile-friendly layout
- Professional color palette

Pages:

- Login page
- Register page
- Dashboard page
- Football page
- Formula 1 page
- Favorites page
- Search history page
- Profile page
- Settings page

---

## Deliverables

Generate complete source code for these files:

1. `index.html`
2. `login.html`
3. `register.html`
4. `style.css`
5. `script.js`
6. `server.js`
7. `database.sql`
8. `package.json`
9. `README.md`

Do not use placeholders.

The application must be fully functional and ready to run locally with:

```bash
npm install
npm start
```

Include comments explaining important sections of the code.

---

## Extra Requirements

- Use secure password hashing with bcrypt.
- Use sessions or JWT authentication.
- Validate all user inputs.
- Prevent duplicate user registration.
- Do not expose API keys in frontend code.
- Keep code clean and organized.
- Include installation instructions in README.
- Include database import instructions.
- Include demo user credentials.
