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
import LineupView from '../components/LineupView';

// ─── Mock data (à remplacer par apiFootball.getLineup(fixtureId)) ─────────────
const getMockLineup = (fixtureId) => ({
  home: {
    team: { name: 'Paris Saint-Germain', flag: '🔵' },
    formation: '4-3-3',
    startXI: [
      { id: 1,  name: 'Gianluigi Donnarumma', number: 99, position: 'G',  captain: false },
      { id: 2,  name: 'Achraf Hakimi',         number: 2,  position: 'D',  captain: false },
      { id: 3,  name: 'Marquinhos',            number: 5,  position: 'D',  captain: true  },
      { id: 4,  name: 'Lucas Beraldo',         number: 35, position: 'D',  captain: false },
      { id: 5,  name: 'Nuno Mendes',           number: 25, position: 'D',  captain: false },
      { id: 6,  name: 'Vitinha',               number: 17, position: 'M',  captain: false },
      { id: 7,  name: 'João Neves',            number: 87, position: 'M',  captain: false },
      { id: 8,  name: 'Fabian Ruiz',           number: 8,  position: 'M',  captain: false },
      { id: 9,  name: 'Ousmane Dembélé',       number: 10, position: 'A',  captain: false },
      { id: 10, name: 'Gonçalo Ramos',         number: 9,  position: 'A',  captain: false },
      { id: 11, name: 'Bradley Barcola',       number: 29, position: 'A',  captain: false },
    ],
    substitutes: [
      { id: 12, name: 'Matvey Safonov',  number: 23, position: 'G'  },
      { id: 13, name: 'Milan Skriniar',  number: 37, position: 'D'  },
      { id: 14, name: 'Warren Zaïre-Emery', number: 33, position: 'M' },
      { id: 15, name: 'Lee Kang-in',     number: 19, position: 'A'  },
      { id: 16, name: 'Randal Kolo Muani', number: 23, position: 'A' },
    ],
  },
  away: {
    team: { name: 'Olympique de Marseille', flag: '🩵' },
    formation: '4-2-3-1',
    startXI: [
      { id: 21, name: 'Pau López',        number: 16, position: 'G',  captain: false },
      { id: 22, name: 'Jonathan Clauss',  number: 11, position: 'D',  captain: false },
      { id: 23, name: 'Samuel Gigot',     number: 5,  position: 'D',  captain: false },
      { id: 24, name: 'Chancel Mbemba',   number: 99, position: 'D',  captain: false },
      { id: 25, name: 'Renan Lodi',       number: 15, position: 'D',  captain: false },
      { id: 26, name: 'Valentin Rongier', number: 21, position: 'M',  captain: true  },
      { id: 27, name: 'Geoffroy Kondogbia', number: 29, position: 'M', captain: false },
      { id: 28, name: 'Amine Harit',      number: 25, position: 'M',  captain: false },
      { id: 29, name: 'Azzedine Ounahi',  number: 8,  position: 'M',  captain: false },
      { id: 30, name: 'Luis Henrique',    number: 7,  position: 'M',  captain: false },
      { id: 31, name: 'Pierre-Emerick Aubameyang', number: 10, position: 'A', captain: false },
    ],
    substitutes: [
      { id: 32, name: 'Ruben Blanco',     number: 1,  position: 'G' },
      { id: 33, name: 'Balerdi',          number: 3,  position: 'D' },
      { id: 34, name: 'Guendouzi',        number: 6,  position: 'M' },
      { id: 35, name: 'Gerson',           number: 27, position: 'M' },
    ],
  },
});

// ─── SubstituteRow ────────────────────────────────────────────────────────────
const SubstituteRow = ({ player, onPress }) => (
  <TouchableOpacity style={styles.subRow} onPress={() => onPress?.(player)} activeOpacity={0.75}>
    <View style={styles.subNumber}>
      <Text style={styles.subNumberText}>{player.number}</Text>
    </View>
    <Text style={styles.subName}>{player.name}</Text>
    <Text style={styles.subPosition}>{player.position}</Text>
  </TouchableOpacity>
);

// ─── LineupScreen ─────────────────────────────────────────────────────────────
const LineupScreen = ({ route, navigation }) => {
  const fixtureId = route?.params?.fixtureId ?? 1;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTeam, setActiveTeam] = useState('home');

  useEffect(() => {
    // TODO: remplacer par apiFootball.getLineup(fixtureId)
    setTimeout(() => {
      setData(getMockLineup(fixtureId));
      setLoading(false);
    }, 700);
  }, [fixtureId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Chargement compositions...</Text>
      </View>
    );
  }

  const team = data[activeTeam];

  const handlePlayerPress = (player) => {
    navigation.navigate('Player', { playerId: player.id, playerName: player.name });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* ── Header ── */}
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>COMPOSITIONS</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Sélecteur équipe */}
        <View style={styles.teamSelector}>
          {['home', 'away'].map((key) => (
            <TouchableOpacity
              key={key}
              style={[styles.teamTab, activeTeam === key && styles.teamTabActive]}
              onPress={() => setActiveTeam(key)}
              activeOpacity={0.8}
            >
              <Text style={styles.teamTabFlag}>{data[key].team.flag}</Text>
              <Text style={[styles.teamTabName, activeTeam === key && styles.teamTabNameActive]}>
                {data[key].team.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Terrain ── */}
        <LineupView lineup={team} onPlayerPress={handlePlayerPress} />

        {/* ── Remplaçants ── */}
        <View style={styles.subsSection}>
          <View style={styles.subsSectionHeader}>
            <View style={styles.subsSectionLine} />
            <Text style={styles.subsSectionTitle}>REMPLAÇANTS</Text>
            <View style={styles.subsSectionLine} />
          </View>

          <View style={styles.subsList}>
            {team.substitutes.map((player) => (
              <SubstituteRow
                key={player.id}
                player={player}
                onPress={handlePlayerPress}
              />
            ))}
          </View>
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
    flex: 1, backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center', gap: spacing.md,
  },
  loadingText: { color: colors.textSecondary, fontSize: typography.body },

  safeHeader: { backgroundColor: colors.surface, paddingBottom: spacing.sm },
  headerTop: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  backBtn: {
    width: 40, height: 40, justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.surfaceLight, borderRadius: radius.full,
  },
  backArrow: { color: colors.white, fontSize: 28, lineHeight: 32 },
  headerTitle: {
    color: colors.white, fontSize: 12,
    fontWeight: '800', letterSpacing: 2,
  },

  // Sélecteur
  teamSelector: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: 3,
    gap: 3,
  },
  teamTab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: spacing.sm, gap: spacing.xs,
    borderRadius: radius.sm,
  },
  teamTabActive: { backgroundColor: colors.primary },
  teamTabFlag: { fontSize: 16 },
  teamTabName: {
    color: colors.textMuted, fontSize: 11,
    fontWeight: '700', flexShrink: 1,
  },
  teamTabNameActive: { color: colors.white },

  scroll: { flex: 1 },
  scrollContent: { padding: spacing.md, gap: spacing.lg },

  // Remplaçants
  subsSection: { gap: spacing.sm },
  subsSectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
  },
  subsSectionLine: { flex: 1, height: 1, backgroundColor: colors.border },
  subsSectionTitle: {
    color: colors.primary, fontSize: 11,
    fontWeight: '800', letterSpacing: 2,
  },
  subsList: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
  },
  subRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  subNumber: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  subNumberText: { color: colors.textSecondary, fontSize: 11, fontWeight: '700' },
  subName: {
    flex: 1, color: colors.textPrimary,
    fontSize: typography.body, fontWeight: '500',
  },
  subPosition: {
    color: colors.primary, fontSize: 11,
    fontWeight: '700',
    backgroundColor: 'rgba(227,30,36,0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
});

export default LineupScreen;