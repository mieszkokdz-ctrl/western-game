import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BlockedUsersProvider } from './src/context/BlockedUsersContext';
import { CommentsProvider } from './src/context/CommentsContext';
import { ConsentProvider } from './src/context/ConsentContext';
import { LikesProvider } from './src/context/LikesContext';
import { ReportsProvider } from './src/context/ReportsContext';
import { SharesProvider } from './src/context/SharesContext';
import { UserProfileProvider } from './src/context/UserProfileContext';
import { UserVideosProvider } from './src/context/UserVideosContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ConsentProvider>
        <UserProfileProvider>
          <UserVideosProvider>
            <LikesProvider>
              <BlockedUsersProvider>
                <ReportsProvider>
                  <CommentsProvider>
                    <SharesProvider>
                      <StatusBar style="light" />
                      <RootNavigator />
                    </SharesProvider>
                  </CommentsProvider>
                </ReportsProvider>
              </BlockedUsersProvider>
            </LikesProvider>
          </UserVideosProvider>
        </UserProfileProvider>
      </ConsentProvider>
    </SafeAreaProvider>
  );
}
