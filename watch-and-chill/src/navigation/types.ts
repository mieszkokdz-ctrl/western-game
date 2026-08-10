import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  CreateTab: undefined;
  LiveTab: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Consent: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Feed: { initialId: string };
  SharedVideo: undefined;
  RecordChoice: undefined;
  Create: undefined;
  LiveBroadcast: undefined;
  LiveViewer: undefined;
  Post: { uri: string };
  Terms: undefined;
  Privacy: undefined;
};
