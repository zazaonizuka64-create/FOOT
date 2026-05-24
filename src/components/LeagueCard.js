import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LeagueCard = ({ league }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{league?.name ?? 'League'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: '#1A1A1A', borderRadius: 8, marginBottom: 8 },
  text: { color: '#FFFFFF' },
});

export default LeagueCard;
