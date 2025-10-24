import React from 'react';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import RootNavigator, {linking} from './src/navigation';

export default function App() {
  const scheme = useColorScheme();
  return (
    <NavigationContainer linking={linking} theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}
