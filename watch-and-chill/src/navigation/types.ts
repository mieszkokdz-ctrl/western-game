import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  CreateTab: undefined;
  Inbox: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Feed: { initialId: string };
  Create: undefined;
  Post: { uri: string };
};
