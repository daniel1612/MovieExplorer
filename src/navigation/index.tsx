import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MovieListScreen from '../screens/MovieListScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';
import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      MovieList: '',
      MovieDetail: 'show/:id', // myapp://show/123
    },
  },
};

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MovieList"
        component={MovieListScreen}
        options={{ title: 'Movie Explorer' }}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetailScreen}
        options={{ title: 'Details' }}
      />
    </Stack.Navigator>
  );
}
