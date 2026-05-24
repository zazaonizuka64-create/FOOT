import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { colors, typography, spacing, radius } from '../theme/colors';

// ─── Données mock (à remplacer par appel Transfermarkt réel) ──────────────────
const getMockPlayer = (playerId) => ({
  id: playerId,
  name: 'Kylian Mbappé',
  fullName: 'Kylian Mbappé Lottin',
  photo: null,
  nationality: '🇫🇷 Française',
  club: 'Real Madrid',
  clubFlag: '🇪🇸',
  position: 'Attaquant',
  age: 25,
  number: 9,
  marketValue: '180M €',
  height: '1m78',
  foot: 'Droit',
  stats: {
    matches: 28,
    goals: 24,
    assists: 8,
    yellowCards: 3,
    redCards: 0,
    minutesPlayed: 2340,
    rating: 8.4,
  },
  trophies: ['Ligue 1 x7', 'Coupe du Monde 2018', 'Ligue des Champions'],
});

// ─── Composant StatBox ────────────────────────────────────────────────────────
const StatBox = ({ value, label, accent }) => (
  <View style={[styles.statBox, accent && styles.statBoxAccent]}>
    <Text style={[styles.statValue, accent && styles.statValueAccent]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ─── Composant InfoRow ────────────────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

// ─── PlayerScreen ─────────────────────────────────────────────────────────────
const PlayerScreen = ({ route, navigation }) => {
  const playerId = route?.params?.playerId ?? 1;
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: remplacer par vrai appel transfermarkt.getPlayer(playerId)
    setTimeout(() => {
      setPlayer(getMockPlayer(playerId));
      setLoading(false);
    }, 600);
  }, [playerId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Chargement joueur...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerBg} />
        <SafeAreaView>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>FICHE JOUEUR</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>👤</Text>
              </View>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{player.number}</Text>
              </View>
            </View>

            <Text style={styles.playerName}>{player.name}</Text>
            <View style={styles.positionBadge}>
              <Text style={styles.positionText}>{player.position}</Text>
            </View>

            {/* Valeur marchande */}
            <View style={styles.marketValueContainer}>
              <Text style={styles.marketValueLabel}>VALEUR MARCHANDE</Text>
              <Text style={styles.marketValue}>{player.marketValue}</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* ── Contenu ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats saison */}
        <Text style={styles.sectionTitle}>STATS SAISON</Text>
        <View style={styles.statsGrid}>
          <StatBox value={player.stats.goals} label="Buts" accent />
          <StatBox value={player.stats.assists} label="Passes D." />
          <StatBox value={player.stats.matches} label="Matchs" />
          <StatBox value={player.stats.rating} label="Note moy." accent />
          <StatBox value={player.stats.minutesPlayed} label="Minutes" />
          <StatBox value={`${player.stats.yellowCards}🟨`} label="Cartons" />
        </View>

        {/* Infos personnelles */}
        <Text style={styles.sectionTitle}>INFORMATIONS</Text>
        <View style={styles.infoCard}>
          <InfoRow label="Nationalité" value={player.nationality} />
          <View style={styles.divider} />
          <InfoRow label="Club" value={`${player.clubFlag} ${player.club}`} />
          <View style={styles.divider} />
          <InfoRow label="Poste" value={player.position} />
          <View style={styles.divider} />
          <InfoRow label="Âge" value={`${player.age} ans`} />
          <View style={styles.divider} />
          <InfoRow label="Taille" value={player.height} />
          <View style={styles.divider} />
          <InfoRow label="Pied fort" value={player.foot} />
        </View>

        {/* Palmarès */}
        <Text style={styles.sectionTitle}>PALMARÈS</Text>
        <View style={styles.trophyCard}>
          {player.trophies.map((t, i) => (
            <View key={i} style={styles.trophyRow}>
              <Text style={styles.trophyIcon}>🏆</Text>
              <Text style={styles.trophyText}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: { color: colors.textSecondary, fontSize: typography.body },

  // Header
  header: { position: 'relative', paddingBottom: spacing.xl, overflow: 'hidden' },
  headerBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
    opacity: 0.9,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  backBtn: {
    width: 40, height: 40,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: radius.full,
  },
  backArrow: { color: colors.white, fontSize: 28, lineHeight: 32 },
  headerTitle: {
    color: colors.white, fontSize: 12,
    fontWeight: '800', letterSpacing: 2,
  },

  // Avatar
  avatarSection: { alignItems: 'center', paddingTop: spacing.md, gap: spacing.sm },
  avatarContainer: { position: 'relative' },
  avatarCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 3, borderColor: colors.white,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarEmoji: { fontSize: 52 },
  numberBadge: {
    position: 'absolute', bottom: 0, right: -4,
    backgroundColor: colors.background,
    borderRadius: radius.full,
    width: 28, height: 28,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.primary,
  },
  numberText: { color: colors.primary, fontSize: 11, fontWeight: '900' },

  playerName: {
    color: colors.white, fontSize: typography.h1,
    fontWeight: '900', letterSpacing: 0.5,
  },
  positionBadge: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: spacing.md, paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  positionText: { color: colors.white, fontSize: typography.small, fontWeight: '600' },

  marketValueContainer: { alignItems: 'center', marginTop: spacing.xs },
  marketValueLabel: {
    color: 'rgba(255,255,255,0.6)', fontSize: 10,
    letterSpacing: 1.5, fontWeight: '600',
  },
  marketValue: {
    color: colors.white, fontSize: 26,
    fontWeight: '900', letterSpacing: 1,
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.md, paddingTop: spacing.lg },

  // Section
  sectionTitle: {
    color: colors.primary, fontSize: 11,
    fontWeight: '800', letterSpacing: 2,
    marginBottom: spacing.sm, marginTop: spacing.sm,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: spacing.sm, marginBottom: spacing.lg,
  },
  statBox: {
    flex: 1, minWidth: '28%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  statBoxAccent: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  statValue: {
    color: colors.textPrimary, fontSize: typography.h2,
    fontWeight: '900',
  },
  statValueAccent: { color: colors.white },
  statLabel: {
    color: colors.textSecondary, fontSize: 10,
    fontWeight: '600', marginTop: 2, letterSpacing: 0.5,
  },

  // Info card
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  infoLabel: { color: colors.textSecondary, fontSize: typography.small },
  infoValue: { color: colors.textPrimary, fontSize: typography.body, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.md },

  // Trophies
  trophyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  trophyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  trophyIcon: { fontSize: 18 },
  trophyText: { color: colors.textPrimary, fontSize: typography.body, fontWeight: '500' },
});

export default PlayerScreen;