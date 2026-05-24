// src/store/leagueStore.js
import { create } from "zustand";
import { D1_LEAGUES } from "../constants/leagues";

export const useLeagueStore = create((set, get) => ({
  // ─── State ────────────────────────────────────────────────────────────────
  selectedLeague: D1_LEAGUES[0], // Premier League par défaut
  selectedDivision: "D1",        // "D1" | "D2"
  season: new Date().getFullYear(),

  // Classements par leagueId : { [leagueId]: Array }
  standings: {},
  loadingStandings: {},

  // ─── Actions ──────────────────────────────────────────────────────────────
  setLeague: (league) => set({ selectedLeague: league }),

  setDivision: (division) => set({ selectedDivision: division }),

  setSeason: (season) => set({ season }),

  setStandings: (leagueId, data) =>
    set((state) => ({
      standings: {
        ...state.standings,
        [leagueId]: data,
      },
    })),

  setLoadingStandings: (leagueId, bool) =>
    set((state) => ({
      loadingStandings: {
        ...state.loadingStandings,
        [leagueId]: bool,
      },
    })),

  clearStandings: () => set({ standings: {}, loadingStandings: {} }),
}));