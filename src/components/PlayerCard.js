import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '../theme/colors';

// ─── PlayerCard ───────────────────────────────────────────────────────────────
// Props :
//   player  : { id, name, number, position, nationality, club, marketValue, rating }
//   onPress : (player) => void
//   variant : 'default' | 'compact' | 'lineup'
// ─────────────────────────────────────────────────────────────────────────────

const POSITION_COLORS = {
  G:  '#FF9800',
  D:  '#2196F3',
  M:  '#4CAF50',
  A:  colors.primary,
};

const PlayerCard = ({ player = {}, onPress, variant = 'default' }) => {
  const posColor = POSITION_COLORS[player.position] ?? colors.textMuted;

  if (variant === 'compact') {
    return (
      <TouchableOpacity
        style={styles.compactCard}
        onPress={() => onPress?.(player)}
        activeOpacity={0.75}
      >
        <View style={[styles.compactAvatar, { borderColor: posColor }]}>
          <Text style={styles.compactNumber}>{player.number ?? '?'}</Text>
        </View>
        <View style={styles.compactInfo}>
          <Text style={styles.compactName} numberOfLines={1}>{player.name ?? '—'}</Text>
          <Text style={styles.compactSub}>{player.club ?? player.nationality ?? ''}</Text>
        </View>
        <View style={[styles.posBadge, { backgroundColor: posColor + '22', borderColor: posColor }]}>
          <Text style={[styles.posText, { color: posColor }]}>{player.position ?? '?'}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'lineup') {
    return (
      <TouchableOpacity
        style={styles.lineupCard}
        onPress={() => onPress?.(player)}
        activeOpacity={0.75}
      >
        <View style={[styles.lineupDot, { backgroundColor: posColor }]}>
          <Text style={styles.lineupNumber}>{player.number ?? '?'}</Text>
        </View>
        <Text style={styles.lineupName} numberOfLines={1}>
          {player.name?.split(' ').pop() ?? '—'}
        </Text>
      </TouchableOpacity>
    );
  }

  // Default : carte complète
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(player)}
      activeOpacity={0.75}
    >
      {/* Accent gauche coloré par poste */}
      <View style={[styles.accent, { backgroundColor: posColor }]} />

      {/* Avatar */}
      <View style={[styles.avatar, { borderColor: posColor }]}>
        <Text style={styles.avatarEmoji}>👤</Text>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{player.number ?? '?'}</Text>
        </View>
      </View>

      {/* Infos */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{player.name ?? '—'}</Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{player.club ?? ''}</Text>
          {player.nationality ? (
            <Text style={styles.metaDot}> · </Text>
          ) : null}
          <Text style={styles.metaText}>{player.nationality ?? ''}</Text>
        </View>
      </View>

      {/* Droite : poste + valeur */}
      <View style={styles.right}>
        <View style={[styles.posBadge, { backgroundColor: posColor + '22', borderColor: posColor }]}>
          <Text style={[styles.posText, { color: posColor }]}>{player.position ?? '?'}</Text>
        </View>
        {player.marketValue ? (
          <Text style={styles.marketValue}>{player.marketValue}</Text>
        ) : null}
        {player.rating ? (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>★ {player.rating}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Default card
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    paddingLeft: spacing.md + 4,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
    gap: spacing.sm,
  },
  accent: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
    borderTopLeftRadius: radius.md, borderBottomLeftRadius: radius.md,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.surfaceLight,
    borderWidth: 2,
    justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  avatarEmoji: { fontSize: 22 },
  numberBadge: {
    position: 'absolute', bottom: -3, right: -3,
    backgroundColor: colors.background,
    borderRadius: radius.full, width: 18, height: 18,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  numberText: { color: colors.textSecondary, fontSize: 8, fontWeight: '900' },

  info: { flex: 1, gap: 2 },
  name: { color: colors.textPrimary, fontSize: typography.body, fontWeight: '700' },
  meta: { flexDirection: 'row', alignItems: 'center' },
  metaText: { color: colors.textSecondary, fontSize: typography.small },
  metaDot: { color: colors.textMuted, fontSize: typography.small },

  right: { alignItems: 'flex-end', gap: 4 },
  posBadge: {
    paddingHorizontal: spacing.xs + 2, paddingVertical: 2,
    borderRadius: radius.sm, borderWidth: 1,
  },
  posText: { fontSize: 10, fontWeight: '800' },
  marketValue: { color: colors.primary, fontSize: 12, fontWeight: '900' },
  ratingBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.xs + 2, paddingVertical: 2,
    borderRadius: radius.sm,
  },
  ratingText: { color: '#FFD700', fontSize: 10, fontWeight: '700' },

  // Compact card
  compactCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
    gap: spacing.sm,
    marginBottom: 4,
  },
  compactAvatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1.5,
    justifyContent: 'center', alignItems: 'center',
  },
  compactNumber: { color: colors.white, fontSize: 12, fontWeight: '900' },
  compactInfo: { flex: 1 },
  compactName: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  compactSub: { color: colors.textSecondary, fontSize: 11 },

  // Lineup card
  lineupCard: {
    alignItems: 'center', gap: 3,
  },
  lineupDot: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 2, borderColor: colors.white,
    justifyContent: 'center', alignItems: 'center',
  },
  lineupNumber: { color: colors.white, fontSize: 11, fontWeight: '900' },
  lineupName: {
    color: colors.white, fontSize: 9, fontWeight: '700',
    maxWidth: 56, textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default PlayerCard;