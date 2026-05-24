// src/components/MatchCard.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { colors, typography, spacing, radius } from "../theme/colors";

const MatchCard = ({ match, onPress }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const home = match.teams?.home;
  const away = match.teams?.away;
  const goals = match.goals;
  const fixture = match.fixture;
  const isLive =
    fixture?.status?.short === "1H" ||
    fixture?.status?.short === "2H" ||
    fixture?.status?.short === "HT" ||
    fixture?.status?.short === "ET" ||
    fixture?.status?.short === "P";
  const isFinished =
    fixture?.status?.short === "FT" ||
    fixture?.status?.short === "AET" ||
    fixture?.status?.short === "PEN";

  const minute = fixture?.status?.elapsed;

  // Pulse animation for live dot
  useEffect(() => {
    if (!isLive) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [isLive]);

  const getTime = () => {
    if (isLive && minute) return `${minute}'`;
    if (isFinished) return "FT";
    if (fixture?.date) {
      const d = new Date(fixture.date);
      return d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "--:--";
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Live badge */}
      {isLive && (
        <View style={styles.liveBadge}>
          <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      )}

      <View style={styles.content}>
        {/* Home team */}
        <View style={styles.team}>
          {home?.logo ? (
            <Image
              source={{ uri: home.logo }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.logoPlaceholder} />
          )}
          <Text style={styles.teamName} numberOfLines={1}>
            {home?.name ?? "—"}
          </Text>
        </View>

        {/* Score / Time */}
        <View style={styles.scoreBox}>
          {isLive || isFinished ? (
            <Text style={styles.score}>
              {goals?.home ?? 0} — {goals?.away ?? 0}
            </Text>
          ) : (
            <Text style={styles.time}>{getTime()}</Text>
          )}
          {isLive && (
            <Text style={styles.minute}>{getTime()}</Text>
          )}
        </View>

        {/* Away team */}
        <View style={[styles.team, styles.teamRight]}>
          {away?.logo ? (
            <Image
              source={{ uri: away.logo }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.logoPlaceholder} />
          )}
          <Text style={[styles.teamName, styles.teamNameRight]} numberOfLines={1}>
            {away?.name ?? "—"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: spacing.sm,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.live,
  },
  liveText: {
    fontFamily: typography.fontBold,
    fontSize: 10,
    color: colors.live,
    letterSpacing: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  team: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
  },
  teamRight: {
    alignItems: "center",
  },
  logo: {
    width: 36,
    height: 36,
  },
  logoPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border,
  },
  teamName: {
    fontFamily: typography.fontRegular,
    fontSize: typography.small,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: 90,
  },
  teamNameRight: {
    textAlign: "center",
  },
  scoreBox: {
    alignItems: "center",
    minWidth: 80,
    gap: 2,
  },
  score: {
    fontFamily: typography.fontBold,
    fontSize: typography.h3,
    color: colors.white,
    letterSpacing: 2,
  },
  time: {
    fontFamily: typography.fontSemiBold,
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  minute: {
    fontFamily: typography.fontRegular,
    fontSize: 11,
    color: colors.live,
  },
});

export default MatchCard;