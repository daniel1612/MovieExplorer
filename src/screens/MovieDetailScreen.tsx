import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { TvShow, fetchShowById } from '../api/tvmaze';
import { stripHtml } from '../utils/html';
import { s } from '../theme/spacing';
import Chip from '../components/Chip';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetail'>;

export default function MovieDetailScreen({ route }: Props) {
  const { id } = route.params;
  const [data, setData] = useState<TvShow | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const scheme = useColorScheme();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const show = await fetchShowById(id);
        if (mounted) setData(show);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }
  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: s.md }}>Error: {error || 'Unknown'}</Text>
        <Text>Try reopening the link or navigating from the list.</Text>
      </View>
    );
  }

  const img = data.image?.original || data.image?.medium;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: s.xxl }}>
      {img ? (
        <Image source={{ uri: img }} style={styles.hero} resizeMode="cover" />
      ) : (
        <View style={[styles.hero, { backgroundColor: '#ddd' }]} />
      )}

      <View style={{ padding: s.lg }}>
        <Text
          style={[styles.title, { color: scheme === 'dark' ? '#fff' : '#111' }]}
        >
          {data.name}
        </Text>

        <Text style={styles.meta}>
          {data.rating?.average
            ? `Rating: ${data.rating.average}`
            : 'No rating'}
        </Text>

        {!!data.genres?.length && (
          <View style={styles.chips}>
            {data.genres.map(g => (
              <Chip key={g} label={g} />
            ))}
          </View>
        )}

        {!!data.summary && (
          <>
            <Text style={styles.section}>Summary</Text>
            <Text style={styles.body}>{stripHtml(data.summary)}</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hero: { width: '100%', height: 280 },
  title: { fontSize: 26, fontWeight: '700' },
  meta: {
    marginTop: 4,
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: 16,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginTop: s.md },
  section: {
    marginTop: s.xl,
    marginBottom: s.sm,
    fontSize: 30,
    fontWeight: '700',
  },
  body: { lineHeight: 24, fontSize: 18 },
});
