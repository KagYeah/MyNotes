import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CalendarDayLabel() {
  const keys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const labels = ['日', '月', '火', '水', '木', '金', '土'];
  const labelComponents = [];

  labels.forEach((label, index) => {
    labelComponents.push((
      <View key={keys[index]} style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
    ));
  });

  return <View style={styles.container}>{labelComponents}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  labelContainer: {
    alignItems: 'center',
    height: 28,
    width: 48,
  },
  label: {
    fontSize: 18,
    lineHeight: 28,
  },
});
