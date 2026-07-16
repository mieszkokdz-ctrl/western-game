import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WatchlistProvider } from './src/context/WatchlistContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <WatchlistProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </WatchlistProvider>
    </SafeAreaProvider>
  );
}
