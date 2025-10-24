import React from 'react';
import { Text, View, useColorScheme, StyleSheet } from 'react-native';
import { s } from '../theme/spacing';
import { colors } from '../theme/colors';

export default function Chip({ label }: { label: string }) {
  const scheme = useColorScheme();
  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor:
            scheme === 'dark' ? colors.chipBgDark : colors.chipBg,
        },
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: s.sm,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: s.sm,
    marginBottom: s.sm,
  },
  text: { fontSize: 16, fontWeight: '600' },
});
