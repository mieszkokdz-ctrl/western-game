import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BlockedUsersProvider } from './src/context/BlockedUsersContext';
import { ConsentProvider } from './src/context/ConsentContext';
import { LikesProvider } from './src/context/LikesContext';
import { ReportsProvider } from './src/context/ReportsContext';
import { UserVideosProvider } from './src/context/UserVideosContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ConsentProvider>
        <UserVideosProvider>
          <LikesProvider>
            <BlockedUsersProvider>
              <ReportsProvider>
                <StatusBar style="light" />
                <RootNavigator />
              </ReportsProvider>
            </BlockedUsersProvider>
          </LikesProvider>
        </UserVideosProvider>
      </ConsentProvider>
    </SafeAreaProvider>
  );
}
