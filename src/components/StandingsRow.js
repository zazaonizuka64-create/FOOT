// src/components/StandingsRow.js
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { colors, typography, spacing } from "../theme/colors";

const StandingsRow = ({ item, index, totalTeams }) => {
  const pos = item.rank;
  const isTop4 = pos <= 4;
  const isRelegation = pos >= totalTeams - 2;

  const posColor = isTop4
    ? colors.primary
    : isRelegation
    ? colors.textMuted
    : colors.textSecondary;

  const rowBg =
    index % 2 === 0 ? colors.surface : colors.background;

  return (
    <View style={[styles.row, { backgroundColor: rowBg }]}>
      {/* Position */}
      <View style={styles.posContainer}>
        {isTop4 && <View style={styles.indicator} />}
        {isRelegation && <View style={[styles.indicator, styles.indicatorRel]} />}
        <Text style={[styles.pos, { color: posColor }]}>{pos}</Text>
      </View>

      {/* Logo + Nom */}
      <View style={styles.teamContainer}>
        {item.team?.logo ? (
          <Image
            source={{ uri: item.team.logo }}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.logoPlaceholder} />
        )}
        <Text style={styles.teamName} numberOfLines={1}>
          {item.team?.name ?? "—"}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.stat}>{item.all?.played ?? 0}</Text>
        <Text style={styles.stat}>{item.all?.win ?? 0}</Text>
        <Text style={styles.stat}>{item.all?.draw ?? 0}</Text>
        <Text style={styles.stat}>{item.all?.lose ?? 0}</Text>
        <Text style={[styles.stat, styles.pts]}>{item.points ?? 0}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  posContainer: {
    width: 28,
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  indicator: {
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginRight: 2,
  },
  indicatorRel: {
    backgroundColor: colors.textMuted,
  },
  pos: {
    fontFamily: typography.fontBold,
    fontSize: typography.small,
    minWidth: 16,
    textAlign: "center",
  },
  teamContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginLeft: spacing.xs,
  },
  logo: {
    width: 20,
    height: 20,
  },
  logoPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.border,
  },
  teamName: {
    flex: 1,
    fontFamily: typography.fontRegular,
    fontSize: typography.small,
    color: colors.textPrimary,
  },
  statsContainer: {
    flexDirection: "row",
    gap: spacing.xs,
    alignItems: "center",
  },
  stat: {
    fontFamily: typography.fontRegular,
    fontSize: typography.small,
    color: colors.textSecondary,
    width: 22,
    textAlign: "center",
  },
  pts: {
    fontFamily: typography.fontBold,
    color: colors.white,
    width: 28,
  },
});

export default StandingsRow;