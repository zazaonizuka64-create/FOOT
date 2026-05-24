import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors, typography, spacing, radius } from '../theme/colors';

const SCREEN_W = Dimensions.get('window').width;
const PITCH_W = SCREEN_W - spacing.md * 2;
const PITCH_H = PITCH_W * 1.45;

// ─── Positions normalisées par formation [x%, y%] ─────────────────────────────
// x=0 gauche, x=100 droite | y=0 bas (défense), y=100 haut (attaque)
const FORMATIONS = {
  '4-3-3': [
    // Gardien
    [50, 5],
    // Défenseurs
    [15, 22], [38, 22], [62, 22], [85, 22],
    // Milieux
    [25, 48], [50, 48], [75, 48],
    // Attaquants
    [20, 74], [50, 78], [80, 74],
  ],
  '4-4-2': [
    [50, 5],
    [15, 22], [38, 22], [62, 22], [85, 22],
    [15, 50], [38, 50], [62, 50], [85, 50],
    [35, 76], [65, 76],
  ],
  '4-2-3-1': [
    [50, 5],
    [15, 22], [38, 22], [62, 22], [85, 22],
    [35, 42], [65, 42],
    [18, 62], [50, 65], [82, 62],
    [50, 82],
  ],
  '3-5-2': [
    [50, 5],
    [25, 22], [50, 22], [75, 22],
    [10, 48], [30, 50], [50, 50], [70, 50], [90, 48],
    [35, 76], [65, 76],
  ],
  '5-3-2': [
    [50, 5],
    [8, 28], [28, 22], [50, 20], [72, 22], [92, 28],
    [25, 52], [50, 52], [75, 52],
    [35, 76], [65, 76],
  ],
};

// ─── PlayerDot ────────────────────────────────────────────────────────────────
const PlayerDot = ({ player, x, y, onPress }) => {
  const left = (x / 100) * PITCH_W - 28;
  const top  = (1 - y / 100) * PITCH_H - 28;

  return (
    <TouchableOpacity
      style={[styles.playerDot, { left, top }]}
      onPress={() => onPress && onPress(player)}
      activeOpacity={0.8}
    >
      <View style={[styles.dot, player.captain && styles.dotCaptain]}>
        <Text style={styles.dotNumber}>{player.number ?? '?'}</Text>
      </View>
      <Text style={styles.dotName} numberOfLines={1}>
        {player.name?.split(' ').pop() ?? ''}
      </Text>
      {player.captain && <Text style={styles.captainBadge}>C</Text>}
    </TouchableOpacity>
  );
};

// ─── LineupView ───────────────────────────────────────────────────────────────
const LineupView = ({ lineup = {}, onPlayerPress }) => {
  const formation = lineup.formation ?? '4-3-3';
  const starters  = lineup.startXI ?? [];
  const positions = FORMATIONS[formation] ?? FORMATIONS['4-3-3'];

  return (
    <View style={styles.wrapper}>
      {/* ── Terrain ── */}
      <View style={styles.pitch}>
        {/* Lignes terrain */}
        <View style={styles.centerLine} />
        <View style={styles.centerCircle} />
        <View style={styles.penaltyTop} />
        <View style={styles.penaltyBottom} />
        <View style={styles.goalTop} />
        <View style={styles.goalBottom} />

        {/* Badge formation */}
        <View style={styles.formationBadge}>
          <Text style={styles.formationText}>{formation}</Text>
        </View>

        {/* Joueurs */}
        {starters.map((player, i) => {
          const pos = positions[i] ?? [50, 50];
          return (
            <PlayerDot
              key={player.id ?? i}
              player={player}
              x={pos[0]}
              y={pos[1]}
              onPress={onPlayerPress}
            />
          );
        })}
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },

  pitch: {
    width: PITCH_W,
    height: PITCH_H,
    backgroundColor: '#2D7A3A',
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    position: 'relative',
    overflow: 'hidden',
  },

  // Lignes
  centerLine: {
    position: 'absolute',
    left: 0, right: 0,
    top: '50%',
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  centerCircle: {
    position: 'absolute',
    width: PITCH_W * 0.28,
    height: PITCH_W * 0.28,
    borderRadius: PITCH_W * 0.14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -(PITCH_W * 0.14) },
      { translateY: -(PITCH_W * 0.14) },
    ],
  },
  penaltyTop: {
    position: 'absolute',
    top: 0, left: '20%', right: '20%',
    height: '15%',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    borderTopWidth: 0,
  },
  penaltyBottom: {
    position: 'absolute',
    bottom: 0, left: '20%', right: '20%',
    height: '15%',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    borderBottomWidth: 0,
  },
  goalTop: {
    position: 'absolute',
    top: 0, left: '36%', right: '36%',
    height: '5%',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    borderTopWidth: 0,
  },
  goalBottom: {
    position: 'absolute',
    bottom: 0, left: '36%', right: '36%',
    height: '5%',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    borderBottomWidth: 0,
  },

  formationBadge: {
    position: 'absolute',
    top: spacing.sm, right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  formationText: { color: colors.white, fontSize: 10, fontWeight: '700' },

  // Joueur
  playerDot: {
    position: 'absolute',
    width: 56,
    alignItems: 'center',
  },
  dot: {
    width: 32, height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  dotCaptain: {
    backgroundColor: colors.primaryDark,
    borderColor: '#FFD700',
    borderWidth: 2.5,
  },
  dotNumber: { color: colors.white, fontSize: 11, fontWeight: '900' },
  dotName: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    maxWidth: 56,
  },
  captainBadge: {
    position: 'absolute',
    top: -6, right: 0,
    backgroundColor: '#FFD700',
    color: '#000',
    fontSize: 8,
    fontWeight: '900',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
  },
});

export default LineupView;