import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { colors, typography, spacing, radius } from '../theme/colors';

// ─── Données des ligues ───────────────────────────────────────────────────────

const PREMIERE_DIVISION = [
  { id: 61,  name: 'Ligue 1',         country: 'France',      flag: '🇫🇷' },
  { id: 39,  name: 'Premier League',  country: 'Angleterre',  flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 140, name: 'La Liga',         country: 'Espagne',     flag: '🇪🇸' },
  { id: 78,  name: 'Bundesliga',      country: 'Allemagne',   flag: '🇩🇪' },
  { id: 135, name: 'Serie A',         country: 'Italie',      flag: '🇮🇹' },
  { id: 94,  name: 'Primeira Liga',   country: 'Portugal',    flag: '🇵🇹' },
  { id: 207, name: 'Super Lig',       country: 'Algérie',     flag: '🇩🇿' },
];

const DEUXIEME_DIVISION = [
  { id: 62,  name: 'Ligue 2',         country: 'France',      flag: '🇫🇷' },
  { id: 40,  name: 'Championship',    country: 'Angleterre',  flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 141, name: 'Segunda División',country: 'Espagne',     flag: '🇪🇸' },
  { id: 79,  name: '2. Bundesliga',   country: 'Allemagne',   flag: '🇩🇪' },
  { id: 136, name: 'Serie B',         country: 'Italie',      flag: '🇮🇹' },
];

// ─── Composant LeagueCard inline ─────────────────────────────────────────────

const LeagueCard = ({ league, onPress }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={onPress}
    activeOpacity={0.75}
  >
    {/* Accent rouge à gauche */}
    <View style={styles.cardAccent} />

    {/* Flag + infos */}
    <Text style={styles.cardFlag}>{league.flag}</Text>
    <View style={styles.cardInfo}>
      <Text style={styles.cardName}>{league.name}</Text>
      <Text style={styles.cardCountry}>{league.country}</Text>
    </View>

    {/* Flèche */}
    <Text style={styles.cardArrow}>›</Text>
  </TouchableOpacity>
);

// ─── Section titre ────────────────────────────────────────────────────────────

const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionLine} />
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionLine} />
  </View>
);

// ─── HomeScreen ───────────────────────────────────────────────────────────────

const HomeScreen = ({ navigation }) => {
  const handleLeaguePress = (league) => {
    navigation.navigate('Standings', { leagueId: league.id, leagueName: league.name });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* ── Header dégradé rouge → noir ── */}
      <View style={styles.header}>
        {/* Pseudo-gradient via couches superposées */}
        <View style={styles.headerGradientRed} />
        <View style={styles.headerGradientFade} />

        <SafeAreaView>
          <View style={styles.headerContent}>
            <Text style={styles.headerBadge}>⚽</Text>
            <View>
              <Text style={styles.headerTitle}>FOOTBALL</Text>
              <Text style={styles.headerSubtitle}>Ligues & Classements</Text>
            </View>
            <View style={styles.headerLive}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* ── Contenu scrollable ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Première division */}
        <SectionHeader title="PREMIÈRE DIVISION" />
        {PREMIERE_DIVISION.map((league) => (
          <LeagueCard
            key={league.id}
            league={league}
            onPress={() => handleLeaguePress(league)}
          />
        ))}

        {/* Deuxième division */}
        <SectionHeader title="DEUXIÈME DIVISION" />
        {DEUXIEME_DIVISION.map((league) => (
          <LeagueCard
            key={league.id}
            league={league}
            onPress={() => handleLeaguePress(league)}
          />
        ))}

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    position: 'relative',
    paddingBottom: spacing.lg,
    overflow: 'hidden',
  },
  headerGradientRed: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
  },
  headerGradientFade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    opacity: 0.45,
    top: '40%',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  headerBadge: {
    fontSize: 32,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: typography.small,
    letterSpacing: 1,
    marginTop: 2,
  },
  headerLive: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    backgroundColor: 'rgba(255,23,68,0.2)',
    borderWidth: 1,
    borderColor: colors.live,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.live,
  },
  liveText: {
    color: colors.live,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },

  // League Card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    gap: spacing.sm,
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.primary,
    borderTopLeftRadius: radius.md,
    borderBottomLeftRadius: radius.md,
  },
  cardFlag: {
    fontSize: 28,
    marginLeft: 6,
  },
  cardInfo: {
    flex: 1,
    marginLeft: spacing.xs,
  },
  cardName: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cardCountry: {
    color: colors.textSecondary,
    fontSize: typography.small,
    marginTop: 2,
  },
  cardArrow: {
    color: colors.textMuted,
    fontSize: 22,
    fontWeight: '300',
    marginRight: spacing.xs,
  },

  // Bottom padding
  bottomPad: {
    height: spacing.xl,
  },
});

export default HomeScreen;