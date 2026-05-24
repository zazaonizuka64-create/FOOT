// src/constants/leagues.js

export const SEASON = new Date().getFullYear();

export const D1_LEAGUES = [
  {
    id: 39,
    name: "Premier League",
    country: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  },
  {
    id: 140,
    name: "La Liga",
    country: "Spain",
    flag: "🇪🇸",
  },
  {
    id: 135,
    name: "Serie A",
    country: "Italy",
    flag: "🇮🇹",
  },
  {
    id: 78,
    name: "Bundesliga",
    country: "Germany",
    flag: "🇩🇪",
  },
  {
    id: 61,
    name: "Ligue 1",
    country: "France",
    flag: "🇫🇷",
  },
];

export const D2_LEAGUES = [
  {
    id: 40,
    name: "Championship",
    country: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  },
  {
    id: 141,
    name: "La Liga 2",
    country: "Spain",
    flag: "🇪🇸",
  },
  {
    id: 136,
    name: "Serie B",
    country: "Italy",
    flag: "🇮🇹",
  },
  {
    id: 79,
    name: "2. Bundesliga",
    country: "Germany",
    flag: "🇩🇪",
  },
  {
    id: 62,
    name: "Ligue 2",
    country: "France",
    flag: "🇫🇷",
  },
];

export const ALL_LEAGUES = [...D1_LEAGUES, ...D2_LEAGUES];

export const getLeagueById = (id) =>
  ALL_LEAGUES.find((league) => league.id === id) || null;