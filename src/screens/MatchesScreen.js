// src/screens/MatchesScreen.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Animated,
} from "react-native";
import { colors, typography, spacing, radius } from "../theme/colors";
import { getLiveMatches, getFixtures } from "../services/apiFootball";
import MatchCard from "../components/MatchCard";
import { D1_LEAGUES, SEASON } from "../constants/leagues";

const TABS = [
  { key: "LIVE", label: "LIVE" },
  { key: "TODAY", label: "AUJOURD'HUI" },
  { key: "RESULTS", label: "RÉSULTATS" },
];

const today = () => new Date().toISOString().split("T")[0];
const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

// ─── Live Badge ───────────────────────────────────────────────────────────────
const LiveBadge = ({ count }) => {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.2, duration: 700, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  if (!count) return null;
  return (
    <View style={styles.liveBadgeWrap}>
      <Animated.View style={[styles.liveDot, { opacity: anim }]} />
      <Text style={styles.liveBadgeCount}>{count}</Text>
    </View>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ tab }) => (
  <View style={styles.empty}>
    <Text style={styles.emptyIcon}>
      {tab === "LIVE" ? "📡" : tab === "TODAY" ? "📅" : "📋"}
    </Text>
    <Text style={styles.emptyText}>
      {tab === "LIVE"
        ? "Aucun match en direct"
        : tab === "TODAY"
        ? "Aucun match aujourd'hui"
        : "Aucun résultat disponible"}
    </Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const MatchesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("LIVE");
  const [selectedLeague, setSelectedLeague] = useState(null); // null = toutes
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const refreshTimer = useRef(null);

  // ─── Fetch ──────────────────────────────────────────────────────────────────
  const fetchMatches = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        let results = [];
        const leagueIds = selectedLeague
          ? [selectedLeague]
          : D1_LEAGUES.map((l) => l.id);

        if (activeTab === "LIVE") {
          const promises = leagueIds.map((id) => getLiveMatches(id));
          const all = await Promise.allSettled(promises);
          results = all
            .filter((r) => r.status === "fulfilled")
            .flatMap((r) => r.value);
        } else if (activeTab === "TODAY") {
          const promises = leagueIds.map((id) =>
            getFixtures(id, today(), SEASON)
          );
          const all = await Promise.allSettled(promises);
          results = all
            .filter((r) => r.status === "fulfilled")
            .flatMap((r) => r.value);
        } else {
          // RESULTS → hier
          const promises = leagueIds.map((id) =>
            getFixtures(id, yesterday(), SEASON)
          );
          const all = await Promise.allSettled(promises);
          results = all
            .filter((r) => r.status === "fulfilled")
            .flatMap((r) => r.value);
        }

        // Tri par heure
        results.sort(
          (a, b) =>
            new Date(a.fixture?.date) - new Date(b.fixture?.date)
        );
        setMatches(results);
      } catch (err) {
        console.error("[MatchesScreen]", err.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [activeTab, selectedLeague]
  );

  // ─── Auto refresh toutes les 2 min si LIVE ───────────────────────────────
  useEffect(() => {
    fetchMatches();

    if (activeTab === "LIVE") {
      refreshTimer.current = setInterval(() => {
        fetchMatches(true);
      }, 120_000);
    }

    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
    };
  }, [activeTab, selectedLeague]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMatches(true);
  };

  const liveCount = matches.filter((m) => {
    const s = m.fixture?.status?.short;
    return ["1H", "2H", "HT", "ET", "P"].includes(s);
  }).length;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {tab.key === "LIVE" && activeTab !== "LIVE" && (
                <LiveBadge count={null} />
              )}
              {tab.key === "LIVE" && activeTab === "LIVE" && liveCount > 0 && (
                <LiveBadge count={liveCount} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* League Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.leagueFilter}
      >
        <TouchableOpacity
          style={[
            styles.leagueChip,
            !selectedLeague && styles.leagueChipActive,
          ]}
          onPress={() => setSelectedLeague(null)}
        >
          <Text
            style={[
              styles.leagueChipText,
              !selectedLeague && styles.leagueChipTextActive,
            ]}
          >
            Toutes
          </Text>
        </TouchableOpacity>
        {D1_LEAGUES.map((league) => (
          <TouchableOpacity
            key={league.id}
            style={[
              styles.leagueChip,
              selectedLeague === league.id && styles.leagueChipActive,
            ]}
            onPress={() =>
              setSelectedLeague(
                selectedLeague === league.id ? null : league.id
              )
            }
          >
            <Text style={styles.leagueFlag}>{league.flag}</Text>
            <Text
              style={[
                styles.leagueChipText,
                selectedLeague === league.id && styles.leagueChipTextActive,
              ]}
            >
              {league.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.divider} />

      {/* Match List */}
      {loading && matches.length === 0 ? (
        <View style={styles.loadingContainer}>
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={i} style={styles.skeletonCard} />
          ))}
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => String(item.fixture?.id ?? Math.random())}
          renderItem={({ item }) => (
            <MatchCard
              match={item}
              onPress={() =>
                navigation.navigate("Lineup", { fixtureId: item.fixture?.id, match: item })
              }
            />
          )}
          ListEmptyComponent={<EmptyState tab={activeTab} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          contentContainerStyle={
            matches.length === 0
              ? styles.emptyContainer
              : styles.listContent
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Auto-refresh indicator */}
      {activeTab === "LIVE" && (
        <View style={styles.autoRefreshBar}>
          <Text style={styles.autoRefreshText}>⟳ Actualisation auto · 2 min</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ─── Tabs
  tabsRow: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontFamily: typography.fontSemiBold,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: colors.white,
  },

  // ─── Live badge
  liveBadgeWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary + "22",
    borderRadius: radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.live,
  },
  liveBadgeCount: {
    fontFamily: typography.fontBold,
    fontSize: 10,
    color: colors.live,
  },

  // ─── League filter
  leagueFilter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  leagueChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  leagueChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  leagueFlag: {
    fontSize: 13,
  },
  leagueChipText: {
    fontFamily: typography.fontSemiBold,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
  leagueChipTextActive: {
    color: colors.white,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  // ─── List
  listContent: {
    paddingVertical: spacing.sm,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  empty: {
    alignItems: "center",
    gap: spacing.md,
    paddingTop: spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontFamily: typography.fontRegular,
    fontSize: typography.body,
    color: colors.textMuted,
  },

  // ─── Skeleton
  loadingContainer: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  skeletonCard: {
    height: 90,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceLight,
    opacity: 0.5,
  },

  // ─── Auto refresh bar
  autoRefreshBar: {
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  autoRefreshText: {
    fontFamily: typography.fontRegular,
    fontSize: 11,
    color: colors.textMuted,
  },
});

export default MatchesScreen;