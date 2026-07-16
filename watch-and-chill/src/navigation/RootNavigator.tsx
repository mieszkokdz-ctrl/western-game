import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateScreen from '../screens/CreateScreen';
import FeedModalScreen from '../screens/FeedModalScreen';
import PostScreen from '../screens/PostScreen';
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

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Feed" component={FeedModalScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Create" component={CreateScreen} options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="Post" component={PostScreen} options={{ presentation: 'fullScreenModal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
