import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DiscoverScreen from '../screens/DiscoverScreen';
import HomeScreen from '../screens/HomeScreen';
import InboxScreen from '../screens/InboxScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import type { MainTabParamList, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Partial<Record<keyof MainTabParamList, string>> = {
  Home: '🏠',
  Discover: '🔍',
  Inbox: '📥',
  Profile: '👤',
};

const LABELS: Partial<Record<keyof MainTabParamList, string>> = {
  Home: 'Główna',
  Discover: 'Odkrywaj',
  Inbox: 'Aktywność',
  Profile: 'Profil',
};

function EmptyScreen() {
  return null;
}

function CreateTabButton() {
  return (
    <View style={styles.createButtonWrap} pointerEvents="none">
      <View style={styles.createButton}>
        <Text style={styles.createButtonText}>+</Text>
      </View>
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarLabel: LABELS[route.name],
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>{ICONS[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen
        name="CreateTab"
        component={EmptyScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => null,
          tabBarButton: props => (
            <TouchableOpacity onPress={props.onPress} activeOpacity={0.8} style={props.style} testID="tab-create">
              <CreateTabButton />
            </TouchableOpacity>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            (navigation.getParent() as NativeStackNavigationProp<RootStackParamList> | undefined)?.navigate(
              'Create'
            );
          },
        })}
      />
      <Tab.Screen name="Inbox" component={InboxScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  createButtonWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    width: 46,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  createButtonText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: -2,
  },
});
