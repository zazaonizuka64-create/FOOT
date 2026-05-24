import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

// Screens
import HomeScreen from '../screens/HomeScreen';
import MatchesScreen from '../screens/MatchesScreen';
import StandingsScreen from '../screens/StandingsScreen';
import PlayerScreen from '../screens/PlayerScreen';
import LineupScreen from '../screens/LineupScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const MatchesStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();

// Icônes emoji légères
const TabIcon = ({ emoji, focused }) => (
  <Text style={[styles.icon, focused && styles.iconActive]}>{emoji}</Text>
);

// ─── Stacks ──────────────────────────────────────────────────────────────────

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    <HomeStack.Screen name="Standings" component={StandingsScreen} />
    <HomeStack.Screen name="Player" component={PlayerScreen} />
    <HomeStack.Screen name="Lineup" component={LineupScreen} />
  </HomeStack.Navigator>
);

const MatchesStackNavigator = () => (
  <MatchesStack.Navigator screenOptions={{ headerShown: false }}>
    <MatchesStack.Screen name="MatchesMain" component={MatchesScreen} />
    <MatchesStack.Screen name="Lineup" component={LineupScreen} />
    <MatchesStack.Screen name="Player" component={PlayerScreen} />
  </MatchesStack.Navigator>
);

const SearchStackNavigator = () => (
  <SearchStack.Navigator screenOptions={{ headerShown: false }}>
    <SearchStack.Screen name="SearchMain" component={HomeScreen} />
    <SearchStack.Screen name="Player" component={PlayerScreen} />
    <SearchStack.Screen name="Standings" component={StandingsScreen} />
  </SearchStack.Navigator>
);

// ─── Tab Navigator principal ──────────────────────────────────────────────────

const AppNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: styles.tabLabel,
    }}
  >
    <Tab.Screen
      name="Accueil"
      component={HomeStackNavigator}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon emoji="⚽" focused={focused} />,
        tabBarLabel: 'Accueil',
      }}
    />
    <Tab.Screen
      name="Matchs"
      component={MatchesStackNavigator}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon emoji="📅" focused={focused} />,
        tabBarLabel: 'Matchs',
      }}
    />
    <Tab.Screen
      name="Recherche"
      component={SearchStackNavigator}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" focused={focused} />,
        tabBarLabel: 'Recherche',
      }}
    />
  </Tab.Navigator>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
});

export default AppNavigator;