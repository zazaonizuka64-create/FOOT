// src/screens/StandingsScreen.js
import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { colors, typography, spacing, radius } from "../theme/colors";
import { getStandings } from "../services/apiFootball";
import StandingsRow from "../components/StandingsRow";
import { useLeagueStore } from "../store/leagueStore";

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <View style={styles.skeletonRow}>
    <View style={[styles.skeletonBox, { width: 20 }]} />
    <View style={[styles.skeletonBox, { width: 28, height: 28, borderRadius: 14, marginHorizontal: spacing.sm }]} />
    <View style={[styles.skeletonBox, { flex: 1 }]} />
    <View style={[styles.skeletonBox, { width: 100 }]} />
  </View>
);

// ─── Header Stats ─────────────────────────────────────────────────────────────
const TableHeader = () => (
  <View style={styles.tableHeader}>
    <Text style={styles.headerPos}>#</Text>
    <Text style={styles.headerTeam}>ÉQUIPE</Text>
    <View style={styles.headerStats}>
      <Text style={styles.headerStat}>J</Text>
      <Text style={styles.headerStat}>G</Text>
      <Text style={styles.headerStat}>N</Text>
      <Text style={styles.headerStat}>P</Text>
      <Text style={[styles.headerStat, styles.headerPts]}>PTS</Text>
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const StandingsScreen = ({ route, navigation }) => {
  const { league } = route.params ?? {};
  const season = new Date().getFullYear();

  const { standings, setStandings, loadingStandings, setLoadingStandings } =
    useLeagueStore();

  const leagueStandings = standings[league?.id] ?? [];
  const isLoading = loadingStandings[league?.id] ?? false;
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchData = useCallback(
    async (silent = false) => {
      if (!league?.id) return;
      if (!silent) setLoadingStandings(league.id, true);
      try {
        const data = await getStandings(league.id, season);
        setStandings(league.id, data);
      } catch (err) {
        console.error("[StandingsScreen]", err.message);
      } finally {
        setLoadingStandings(league.id, false);
        setRefreshing(false);
      }
    },
    [league?.id, season]
  );

  useEffect(() => {
    if (leagueStandings.length === 0) fetchData();
  }, [league?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  // ─── Legend ───────────────────────────────────────────────────────────────
  const Legend = () => (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
        <Text style={styles.legendText}>Qualif. Ligue des Champions</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: colors.textMuted }]} />
        <Text style={styles.legendText}>Zone relégation</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.flagText}>{league?.flag}</Text>
          <Text style={styles.leagueName}>{league?.name ?? "Classement"}</Text>
        </View>
        <Text style={styles.seasonLabel}>{season}</Text>
      </View>

      {/* Table */}
      {isLoading && leagueStandings.length === 0 ? (
        <View style={styles.skeletonContainer}>
          <TableHeader />
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={leagueStandings}
          keyExtractor={(item) => String(item.team?.id ?? item.rank)}
          ListHeaderComponent={
            <>
              <TableHeader />
              <View style={styles.divider} />
            </>
          }
          ListFooterComponent={<Legend />}
          renderItem={({ item, index }) => (
            <StandingsRow
              item={item}
              index={index}
              totalTeams={leagueStandings.length}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 22,
    color: colors.white,
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  flagText: {
    fontSize: 20,
  },
  leagueName: {
    fontFamily: typography.fontBold,
    fontSize: typography.h3,
    color: colors.white,
  },
  seasonLabel: {
    fontFamily: typography.fontRegular,
    fontSize: typography.small,
    color: colors.textMuted,
    width: 36,
    textAlign: "right",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  headerPos: {
    fontFamily: typography.fontBold,
    fontSize: 10,
    color: colors.textMuted,
    width: 28,
    textAlign: "center",
  },
  headerTeam: {
    flex: 1,
    fontFamily: typography.fontBold,
    fontSize: 10,
    color: colors.textMuted,
    marginLeft: spacing.xs + 28,
  },
  headerStats: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  headerStat: {
    fontFamily: typography.fontBold,
    fontSize: 10,
    color: colors.textMuted,
    width: 22,
    textAlign: "center",
  },
  headerPts: {
    color: colors.textSecondary,
    width: 28,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  legend: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: typography.fontRegular,
    fontSize: typography.small,
    color: colors.textMuted,
  },
  // Skeleton
  skeletonContainer: {
    paddingHorizontal: spacing.sm,
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  skeletonBox: {
    height: 14,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceLight,
    opacity: 0.6,
  },
});

export default StandingsScreen;