import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useFilteredShows, useShows } from '../hooks/useShows';
import ShowCard from '../components/ShowCard';
import SearchBar from '../components/SearchBar';
import { s } from '../theme/spacing';
import { useIsFocused } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieList'>;

const { width } = Dimensions.get('window');
const GLOW_SIZE = width * 0.8;

const HEADER_HEIGHT = 260;
const CARD_HEIGHT = 270;

export default function MovieListScreen({ navigation }: Props) {
  const isFocused = useIsFocused();
  const scheme = useColorScheme();
  const { data, loading, error, reload } = useShows();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    if (query.length === 0) {
      setDebouncedQuery('');
      return;
    }
    const t = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useFilteredShows(data, debouncedQuery);

  const scrollY = useRef(new Animated.Value(0)).current;

  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const translate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10],
  });
  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1.05],
  });

  const titleText = useMemo(() => {
    if (debouncedQuery) {
      return filtered.length > 0
        ? `Results for “${debouncedQuery}”`
        : `No results for “${debouncedQuery}”`;
    }
    return 'All Shows';
  }, [debouncedQuery, filtered.length]);

  const subtitleText = useMemo(() => {
    return `${filtered.length} ${filtered.length === 1 ? 'Item' : 'Items'}`;
  }, [filtered.length]);

  const header = (
    <View style={{ marginBottom: s.lg }}>
      <View style={{ height: 120, justifyContent: 'center' }}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.heroGlow,
            {
              backgroundColor: scheme === 'dark' ? '#3b82f6' : '#60a5fa',
              transform: [{ translateX: translate }, { scale }],
              opacity: 0.25,
            },
          ]}
        />
        <Text
          style={[
            styles.heroTitle,
            { color: scheme === 'dark' ? '#fff' : '#111' },
          ]}
        >
          {titleText}
        </Text>
        <Text
          style={[
            styles.heroSub,
            { color: scheme === 'dark' ? '#ddd' : '#555' },
          ]}
        >
          {subtitleText}
        </Text>
      </View>

      <SearchBar value={query} onChangeText={setQuery} />
    </View>
  );

  if (loading && !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading shows…</Text>
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: s.md }}>Error: {error}</Text>
        <Text onPress={reload} style={{ color: '#3b82f6' }}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ListHeaderComponent={header}
        data={filtered}
        keyExtractor={item => String(item.id)}
        removeClippedSubviews
        contentContainerStyle={{ paddingBottom: s.xxl }}
        renderItem={({ item, index }) => (
          <ShowCard
            show={item}
            onPress={() => navigation.navigate('MovieDetail', { id: item.id })}
            index={index}
            scrollY={scrollY}
            headerHeight={HEADER_HEIGHT}
            cardHeight={CARD_HEIGHT}
            isFocused={isFocused}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={reload} />
        }
        ListEmptyComponent={
          <View style={{ padding: s.lg }}>
            <Text>No results found.</Text>
          </View>
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: CARD_HEIGHT,
          offset: HEADER_HEIGHT + CARD_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heroGlow: {
    position: 'absolute',
    alignSelf: 'center',
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
    top: -GLOW_SIZE * 0.5,
  },
  heroTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  heroSub: { fontSize: 13, textAlign: 'center', marginTop: 6 },
});
