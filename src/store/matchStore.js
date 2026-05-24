// src/store/matchStore.js
import { create } from "zustand";

const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

const isFresh = (timestamp) => {
  if (!timestamp) return false;
  return Date.now() - timestamp < CACHE_TTL_MS;
};

export const useMatchStore = create((set, get) => ({
  // ─── State ────────────────────────────────────────────────────────────────

  // liveMatches : { [leagueId]: { data: [], lastUpdated: timestamp } }
  liveMatches: {},

  // fixtures : { [`${leagueId}_${date}`]: { data: [], lastUpdated: timestamp } }
  fixtures: {},

  // ─── Live Matches ─────────────────────────────────────────────────────────

  setLiveMatches: (leagueId, data) =>
    set((state) => ({
      liveMatches: {
        ...state.liveMatches,
        [leagueId]: {
          data,
          lastUpdated: Date.now(),
        },
      },
    })),

  getLiveMatchesCached: (leagueId) => {
    const entry = get().liveMatches[leagueId];
    if (!entry) return null;
    if (!isFresh(entry.lastUpdated)) return null;
    return entry.data;
  },

  // ─── Fixtures ─────────────────────────────────────────────────────────────

  setFixtures: (leagueId, date, data) => {
    const key = `${leagueId}_${date}`;
    set((state) => ({
      fixtures: {
        ...state.fixtures,
        [key]: {
          data,
          lastUpdated: Date.now(),
        },
      },
    }));
  },

  getFixturesCached: (leagueId, date) => {
    const key = `${leagueId}_${date}`;
    const entry = get().fixtures[key];
    if (!entry) return null;
    if (!isFresh(entry.lastUpdated)) return null;
    return entry.data;
  },

  // ─── Utilitaires ──────────────────────────────────────────────────────────

  /** Retourne le timestamp du dernier refresh live pour une ligue */
  getLastUpdated: (leagueId) => {
    return get().liveMatches[leagueId]?.lastUpdated ?? null;
  },

  /** Invalide le cache live d'une ligue (forcer le re-fetch) */
  invalidateLive: (leagueId) =>
    set((state) => {
      const updated = { ...state.liveMatches };
      if (updated[leagueId]) {
        updated[leagueId] = { ...updated[leagueId], lastUpdated: 0 };
      }
      return { liveMatches: updated };
    }),

  clearAll: () => set({ liveMatches: {}, fixtures: {} }),
}));