import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  CreateTab: undefined;
  Inbox: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Consent: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Feed: { initialId: string };
  SharedVideo: undefined;
  Create: undefined;
  Post: { uri: string };
  Terms: undefined;
  Privacy: undefined;
};
