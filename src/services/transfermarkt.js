// src/services/transfermarkt.js
// Source : https://api.sportdb.dev (SportDB.dev)

const BASE_URL = "https://api.sportdb.dev";

const HEADERS = {
  "X-API-Key": "UW6zuevJXJuaTi10qmrHKphOFEAXmYUWu82OsBh4...",
  "Content-Type": "application/json",
};

// ─── Helper fetch ─────────────────────────────────────────────────────────────
const tmFetch = async (endpoint) => {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: HEADERS,
  });

  if (!response.ok) {
    throw new Error(
      `SportDB error ${response.status}: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
};

// ─── Search Player ────────────────────────────────────────────────────────────
/**
 * Recherche un joueur par nom.
 * @param {string} name - Nom du joueur (ex: "Mbappe")
 * @returns {Promise<Array>} - Liste de joueurs
 * Chaque résultat : { id, name, club, position, nationality, image, marketValue }
 */
export const searchPlayer = async (name) => {
  try {
    const encoded = encodeURIComponent(name.trim());
    const data = await tmFetch(`/api/players/search/${encoded}`);
    return data ?? [];
  } catch (error) {
    console.error("[searchPlayer]", error.message);
    throw error;
  }
};

// ─── Player Profile ───────────────────────────────────────────────────────────
/**
 * Récupère le profil complet d'un joueur.
 * @param {string|number} playerId - ID du joueur SportDB
 * @returns {Promise<Object>} - Profil joueur complet
 */
export const getPlayerProfile = async (playerId) => {
  try {
    const data = await tmFetch(`/api/players/${playerId}/profile`);
    return data ?? null;
  } catch (error) {
    console.error("[getPlayerProfile]", error.message);
    throw error;
  }
};

// ─── Player Stats ─────────────────────────────────────────────────────────────
/**
 * Récupère les statistiques d'un joueur sur toutes les saisons.
 * @param {string|number} playerId - ID du joueur SportDB
 * @returns {Promise<Array>}
 */
export const getPlayerStats = async (playerId) => {
  try {
    const data = await tmFetch(`/api/players/${playerId}/stats`);
    return data ?? [];
  } catch (error) {
    console.error("[getPlayerStats]", error.message);
    throw error;
  }
};

// ─── Player Transfers ─────────────────────────────────────────────────────────
/**
 * Récupère l'historique des transferts d'un joueur.
 * @param {string|number} playerId - ID du joueur SportDB
 * @returns {Promise<Array>}
 */
export const getPlayerTransfers = async (playerId) => {
  try {
    const data = await tmFetch(`/api/players/${playerId}/transfers`);
    return data ?? [];
  } catch (error) {
    console.error("[getPlayerTransfers]", error.message);
    throw error;
  }
};

// ─── Club Search ──────────────────────────────────────────────────────────────
/**
 * Recherche un club par nom.
 * @param {string} name - Nom du club (ex: "Arsenal")
 * @returns {Promise<Array>}
 */
export const searchClub = async (name) => {
  try {
    const encoded = encodeURIComponent(name.trim());
    const data = await tmFetch(`/api/clubs/search/${encoded}`);
    return data ?? [];
  } catch (error) {
    console.error("[searchClub]", error.message);
    throw error;
  }
};

// ─── Club Players ─────────────────────────────────────────────────────────────
/**
 * Récupère la liste des joueurs d'un club.
 * @param {string|number} clubId - ID du club SportDB
 * @returns {Promise<Array>}
 */
export const getClubPlayers = async (clubId) => {
  try {
    const data = await tmFetch(`/api/clubs/${clubId}/players`);
    return data ?? [];
  } catch (error) {
    console.error("[getClubPlayers]", error.message);
    throw error;
  }
};