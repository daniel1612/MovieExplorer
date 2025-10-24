import React from 'react';
import { TextInput, View, StyleSheet, useColorScheme } from 'react-native';
import { s } from '../theme/spacing';

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search shows...',
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
}) {
  const scheme = useColorScheme();
  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: scheme === 'dark' ? '#151515' : '#f5f5f5' },
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: s.lg,
    marginTop: s.md,
    marginBottom: s.md,
    borderRadius: 12,
    paddingHorizontal: s.md,
    paddingVertical: 10,
  },
  input: { fontSize: 16 },
});
