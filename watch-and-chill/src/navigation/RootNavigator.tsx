import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, View } from 'react-native';
import { useConsent } from '../context/ConsentContext';
import ConsentScreen from '../screens/ConsentScreen';
import CreateScreen from '../screens/CreateScreen';
import FeedModalScreen from '../screens/FeedModalScreen';
import PostScreen from '../screens/PostScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import SharedVideoScreen, { getSharedVideoId } from '../screens/SharedVideoScreen';
import TermsScreen from '../screens/TermsScreen';
import { colors } from '../theme/colors';
import MainTabs from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    border: colors.border,
    primary: colors.primary,
    text: colors.text,
  },
};

const legalScreenOptions = {
  headerShown: true,
  headerTintColor: colors.text,
  headerStyle: { backgroundColor: colors.surface },
  headerShadowVisible: false,
} as const;

function getInitialRouteName(hasAccepted: boolean): keyof RootStackParamList {
  if (!hasAccepted) return 'Consent';
  if (Platform.OS === 'web' && getSharedVideoId()) return 'SharedVideo';
  return 'MainTabs';
}

export default function RootNavigator() {
  const { isLoading, hasAccepted } = useConsent();

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={getInitialRouteName(hasAccepted)}>
        <Stack.Screen name="Consent" component={ConsentScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="SharedVideo" component={SharedVideoScreen} />
        <Stack.Screen name="Feed" component={FeedModalScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Create" component={CreateScreen} options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="Post" component={PostScreen} options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="Terms" component={TermsScreen} options={{ ...legalScreenOptions, title: 'Regulamin' }} />
        <Stack.Screen
          name="Privacy"
          component={PrivacyScreen}
          options={{ ...legalScreenOptions, title: 'Polityka Prywatności' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
