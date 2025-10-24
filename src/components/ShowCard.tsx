import React, { useRef, useMemo } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  useColorScheme,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { s } from '../theme/spacing';
import { colors } from '../theme/colors';
import { TvShow } from '../api/tvmaze';

type Props = {
  show: TvShow;
  onPress: () => void;
  index: number;
  scrollY: Animated.Value;
  headerHeight: number;
  cardHeight: number;
  isFocused: boolean;
};

export default function ShowCard({
  show,
  onPress,
  index,
  scrollY,
  headerHeight,
  cardHeight,
  isFocused,
}: Props) {
  const scheme = useColorScheme();
  const scale = useRef(new Animated.Value(1)).current;

  function pressIn() {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  }
  function pressOut() {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }

  const itemTop = useMemo(
    () => headerHeight + index * cardHeight,
    [headerHeight, index, cardHeight],
  );
  const yOnScreen = Animated.subtract(new Animated.Value(itemTop), scrollY);

  const START = 0;
  const blurOpacity = yOnScreen.interpolate({
    inputRange: [START, START + 60, START + 160],
    outputRange: [0.6, 0.25, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={{ transform: [{ scale }], marginHorizontal: s.lg }}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={[
          styles.card,
          {
            backgroundColor:
              scheme === 'dark' ? colors.cardBgDark : colors.cardBg,
          },
        ]}
      >
        {show.image?.medium ? (
          <Image
            source={{ uri: show.image.medium }}
            style={styles.thumb}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.thumb, { backgroundColor: '#ddd' }]} />
        )}

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {show.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {show.language
              ? `Language: ${show.language}`
              : show.rating?.average
              ? `Rating: ${show.rating.average}`
              : '—'}
          </Text>
        </View>

        {isFocused && (
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { opacity: blurOpacity }]}
          >
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType={scheme === 'dark' ? 'dark' : 'light'}
              blurAmount={8} // היה 14—הורדנו כדי לראות טוב יותר את הפריט
              reducedTransparencyFallbackColor={
                scheme === 'dark' ? '#000' : '#fff'
              }
            />
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: s.lg,
    elevation: 2,
  },
  thumb: { width: '100%', height: 180 },
  info: { padding: s.md },
  title: { fontSize: 16, fontWeight: '600' },
  meta: { marginTop: 4, color: colors.textMuted, fontWeight: '500' },
});
