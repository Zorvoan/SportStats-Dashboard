/**
 * SportPulse - API komunikace s TheSportsDB
 */

/**
 * Získání všech sportů
 */
async function getAllSports() {
    return fetchAPI('all_sports.php');
}

/**
 * Získání všech lig
 */
async function getAllLeagues() {
    return fetchAPI('all_leagues.php');
}

/**
 * Získání lig podle země a sportu
 */
async function getLeaguesByCountry(country, sport) {
    return fetchAPI(`search_all_leagues.php?c=${encodeURIComponent(country)}&s=${encodeURIComponent(sport)}`);
}

/**
 * Získání sezón pro ligu
 */
async function getSeasons(leagueId) {
    return fetchAPI(`search_all_seasons.php?id=${leagueId}`);
}

/**
 * Získání týmů v lize
 */
async function getTeamsByLeague(leagueName) {
    return fetchAPI(`search_all_teams.php?l=${encodeURIComponent(leagueName)}`);
}

/**
 * Získání týmů podle sportu a země
 */
async function getTeamsBySportAndCountry(sport, country) {
    return fetchAPI(`search_all_teams.php?s=${encodeURIComponent(sport)}&c=${encodeURIComponent(country)}`);
}

/**
 * Získání detailu týmu
 */
async function getTeamDetails(teamId) {
    return fetchAPI(`lookupteam.php?id=${teamId}`);
}

/**
 * Získání hráčů týmu
 */
async function getTeamPlayers(teamId) {
    return fetchAPI(`lookup_all_players.php?id=${teamId}`);
}

/**
 * Získání detailu ligy
 */
async function getLeagueDetails(leagueId) {
    return fetchAPI(`lookupleague.php?id=${leagueId}`);
}

/**
 * Získání tabulky ligy
 */
async function getLeagueTable(leagueId, season) {
    return fetchAPI(`lookuptable.php?l=${leagueId}&s=${encodeURIComponent(season)}`);
}

/**
 * Získání událostí pro konkrétní den
 */
async function getEventsByDay(date, sport, league) {
    let endpoint = `eventsday.php?d=${date}`;
    if (sport) endpoint += `&s=${encodeURIComponent(sport)}`;
    if (league) endpoint += `&l=${encodeURIComponent(league)}`;
    return fetchAPI(endpoint);
}

/**
 * Získání minulých událostí ligy
 */
async function getPastEventsByLeague(leagueId) {
    return fetchAPI(`eventspastleague.php?id=${leagueId}`);
}

/**
 * Získání nadcházejících událostí ligy
 */
async function getNextEventsByLeague(leagueId) {
    return fetchAPI(`eventsnextleague.php?id=${leagueId}`);
}

/**
 * Získání událostí sezóny
 */
async function getEventsBySeason(leagueId, season) {
    return fetchAPI(`eventsseason.php?id=${leagueId}&s=${encodeURIComponent(season)}`);
}

/**
 * Získání detailu události
 */
async function getEventDetails(eventId) {
    return fetchAPI(`lookupevent.php?id=${eventId}`);
}

/**
 * Získání výsledků události
 */
async function getEventResults(eventId) {
    return fetchAPI(`eventresults.php?id=${eventId}`);
}

/**
 * Získání posledních zápasů týmu
 */
async function getTeamLastEvents(teamId) {
    return fetchAPI(`eventslast.php?id=${teamId}`);
}

/**
 * Získání nadcházejících zápasů týmu
 */
async function getTeamNextEvents(teamId) {
    return fetchAPI(`eventsnext.php?id=${teamId}`);
}

/**
 * Vyhledávání týmů
 */
async function searchTeams(query) {
    return fetchAPI(`searchteams.php?t=${encodeURIComponent(query)}`);
}

/**
 * Vyhledávání událostí
 */
async function searchEvents(query) {
    return fetchAPI(`searchevents.php?e=${encodeURIComponent(query)}`);
}

/**
 * Vyhledávání hráčů
 */
async function searchPlayers(query) {
    return fetchAPI(`searchplayers.php?p=${encodeURIComponent(query)}`);
}

/**
 * Získání detailu hráče
 */
async function getPlayerDetails(playerId) {
    return fetchAPI(`lookupplayer.php?id=${playerId}`);
}

/**
 * Získání populárních lig (předdefinovaný seznam)
 */
function getPopularLeagues() {
    return [
        { id: 4328, name: 'English Premier League', sport: 'Soccer', country: 'England' },
        { id: 4335, name: 'Spanish La Liga', sport: 'Soccer', country: 'Spain' },
        { id: 4332, name: 'Italian Serie A', sport: 'Soccer', country: 'Italy' },
        { id: 4331, name: 'German Bundesliga', sport: 'Soccer', country: 'Germany' },
        { id: 4387, name: 'NBA', sport: 'Basketball', country: 'USA' },
        { id: 4380, name: 'NHL', sport: 'Ice Hockey', country: 'USA' }
    ];
}

/**
 * Získání seznamu sportů pro filtry
 */
function getSportsFilters() {
    return [
        { id: 'all', name: 'Vše', icon: 'fa-globe' },
        { id: 'Soccer', name: 'Fotbal', icon: 'fa-futbol' },
        { id: 'Basketball', name: 'Basketbal', icon: 'fa-basketball' },
        { id: 'Tennis', name: 'Tenis', icon: 'fa-table-tennis' },
        { id: 'Ice Hockey', name: 'Hokej', icon: 'fa-hockey-puck' },
        { id: 'Baseball', name: 'Baseball', icon: 'fa-baseball' },
        { id: 'American Football', name: 'Americký fotbal', icon: 'fa-football' },
        { id: 'Rugby', name: 'Rugby', icon: 'fa-football-ball' },
        { id: 'Cricket', name: 'Kriket', icon: 'fa-circle-notch' },
        { id: 'Motorsport', name: 'Motorsport', icon: 'fa-flag-checkered' }
    ];
}

/**
 * Render match card HTML
 */
function renderMatchCard(event) {
    const homeScore = event.intHomeScore !== null ? event.intHomeScore : '-';
    const awayScore = event.intAwayScore !== null ? event.intAwayScore : '-';
    const status = event.strStatus || 'Scheduled';

    let statusClass = 'status-upcoming';
    let statusText = 'Nadcházející';
    let statusBadgeClass = 'status-badge-upcoming';

    if (status === 'Match Finished') {
        statusClass = 'status-finished';
        statusText = 'Ukončeno';
        statusBadgeClass = 'status-badge-finished';
    } else if (status === 'Live' || status === 'In Progress') {
        statusClass = 'status-live';
        statusText = 'Živě';
        statusBadgeClass = 'status-badge-live';
    }

    const eventDate = event.dateEvent || '-';
    const eventTime = event.strTime ? event.strTime.substring(0, 5) : '';

    return `
        <div class="match-card" onclick="window.location.href='match.html?id=${event.idEvent}'">
            <div class="match-card-header">
                <span class="match-card-date">${escapeHtml(eventDate)} ${escapeHtml(eventTime)}</span>
                <span class="match-card-league">${escapeHtml(event.strLeague || '')}</span>
            </div>
            <div class="match-card-teams">
                <div class="match-team">
                    <img src="${event.strHomeTeamBadge || 'https://via.placeholder.com/40'}" alt="" class="match-team-logo" loading="lazy">
                    <span class="match-team-name">${escapeHtml(event.strHomeTeam || 'Domácí')}</span>
                </div>
                <div class="match-score">
                    <span>${homeScore}</span>
                    <span class="match-score-divider">:</span>
                    <span>${awayScore}</span>
                </div>
                <div class="match-team away">
                    <img src="${event.strAwayTeamBadge || 'https://via.placeholder.com/40'}" alt="" class="match-team-logo" loading="lazy">
                    <span class="match-team-name">${escapeHtml(event.strAwayTeam || 'Hosté')}</span>
                </div>
            </div>
            <div class="match-card-status ${statusClass}">${statusText}</div>
        </div>
    `;
}

/**
 * Render league card HTML
 */
function renderLeagueCard(league) {
    return `
        <div class="league-card" onclick="window.location.href='league.html?id=${league.idLeague}'">
            <img src="${league.strBadge || 'https://via.placeholder.com/60'}" alt="" class="league-card-logo" loading="lazy">
            <div class="league-card-name">${escapeHtml(league.strLeague)}</div>
            <div class="league-card-country">${escapeHtml(league.strCountry || '')}</div>
        </div>
    `;
}

/**
 * Render team card HTML
 */
function renderTeamCard(team) {
    return `
        <div class="team-card" onclick="window.location.href='team.html?id=${team.idTeam}'">
            <img src="${team.strTeamBadge || 'https://via.placeholder.com/48'}" alt="" class="team-card-logo" loading="lazy">
            <div class="team-card-info">
                <h4>${escapeHtml(team.strTeam)}</h4>
                <p>${escapeHtml(team.strLeague || '')}</p>
            </div>
        </div>
    `;
}
