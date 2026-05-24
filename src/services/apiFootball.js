// src/services/apiFootball.js

const BASE_URL = "https://v3.football.api-sports.io";

const HEADERS = {
  "x-apisports-key": "b8d9dfd33e57c09dba0cf0aced73dae5XXXXXXXXXX",
};

// ─── Helper fetch ─────────────────────────────────────────────────────────────
const apiFetch = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: HEADERS,
  });

  if (!response.ok) {
    throw new Error(
      `API-Football error ${response.status}: ${response.statusText}`
    );
  }

  const data = await response.json();

  if (data.errors && Object.keys(data.errors).length > 0) {
    const errorMsg = Object.values(data.errors).join(", ");
    throw new Error(`API-Football error: ${errorMsg}`);
  }

  return data.response;
};

// ─── Status (ne consomme pas de quota) ───────────────────────────────────────
/**
 * Vérifie le statut du compte et le quota restant.
 * @returns {Promise<Object>} - { account, subscription, requests }
 */
export const getApiStatus = async () => {
  try {
    const url = `${BASE_URL}/status`;
    const response = await fetch(url, { method: "GET", headers: HEADERS });
    const data = await response.json();
    return data.response ?? null;
  } catch (error) {
    console.error("[getApiStatus]", error.message);
    throw error;
  }
};

// ─── Standings ────────────────────────────────────────────────────────────────
/**
 * Récupère le classement d'une ligue pour une saison donnée.
 * @param {number} leagueId  - ID de la ligue (ex: 39 pour Premier League)
 * @param {number} season    - Année de la saison (ex: 2024)
 * @returns {Promise<Array>} - Tableau des standings
 */
export const getStandings = async (leagueId, season) => {
  try {
    const response = await apiFetch("/standings", {
      league: leagueId,
      season,
    });
    return response?.[0]?.league?.standings?.[0] ?? [];
  } catch (error) {
    console.error("[getStandings]", error.message);
    throw error;
  }
};

// ─── Live Matches ─────────────────────────────────────────────────────────────
/**
 * Récupère les matchs en direct pour une ligue.
 * @param {number} leagueId - ID de la ligue
 * @returns {Promise<Array>}
 */
export const getLiveMatches = async (leagueId) => {
  try {
    const response = await apiFetch("/fixtures", {
      league: leagueId,
      live: "all",
    });
    return response ?? [];
  } catch (error) {
    console.error("[getLiveMatches]", error.message);
    throw error;
  }
};

// ─── Fixtures by date ─────────────────────────────────────────────────────────
/**
 * Récupère les matchs d'une ligue pour une date donnée.
 * @param {number} leagueId  - ID de la ligue
 * @param {string} date      - Format "YYYY-MM-DD"
 * @param {number} season    - Année de la saison (ex: 2024)
 * @returns {Promise<Array>}
 */
export const getFixtures = async (leagueId, date, season) => {
  try {
    const response = await apiFetch("/fixtures", {
      league: leagueId,
      date,
      season,
    });
    return response ?? [];
  } catch (error) {
    console.error("[getFixtures]", error.message);
    throw error;
  }
};

// ─── Lineup ───────────────────────────────────────────────────────────────────
/**
 * Récupère la composition d'un match.
 * @param {number} fixtureId - ID du match
 * @returns {Promise<Array>} - [teamHome, teamAway]
 */
export const getLineup = async (fixtureId) => {
  try {
    const response = await apiFetch("/fixtures/lineups", {
      fixture: fixtureId,
    });
    return response ?? [];
  } catch (error) {
    console.error("[getLineup]", error.message);
    throw error;
  }
};

// ─── Match Statistics ─────────────────────────────────────────────────────────
/**
 * Récupère les statistiques d'un match.
 * @param {number} fixtureId - ID du match
 * @returns {Promise<Array>}
 */
export const getMatchStatistics = async (fixtureId) => {
  try {
    const response = await apiFetch("/fixtures/statistics", {
      fixture: fixtureId,
    });
    return response ?? [];
  } catch (error) {
    console.error("[getMatchStatistics]", error.message);
    throw error;
  }
};

// ─── Match Events ─────────────────────────────────────────────────────────────
/**
 * Récupère les événements d'un match (buts, cartons…).
 * @param {number} fixtureId - ID du match
 * @returns {Promise<Array>}
 */
export const getMatchEvents = async (fixtureId) => {
  try {
    const response = await apiFetch("/fixtures/events", {
      fixture: fixtureId,
    });
    return response ?? [];
  } catch (error) {
    console.error("[getMatchEvents]", error.message);
    throw error;
  }
};