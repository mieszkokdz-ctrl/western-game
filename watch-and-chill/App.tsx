import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LikesProvider } from './src/context/LikesContext';
import { UserVideosProvider } from './src/context/UserVideosContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <UserVideosProvider>
        <LikesProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </LikesProvider>
      </UserVideosProvider>
    </SafeAreaProvider>
  );
}
