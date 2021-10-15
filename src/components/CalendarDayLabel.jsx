import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { appStyles } from '../style';

export default function CalendarDayLabel() {
  const labels = ['日', '月', '火', '水', '木', '金', '土'];
  const keys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const labelComponents = [];

  labels.forEach((label, index) => {
    labelComponents.push((
      <View style={styles.labelContainer} key={keys[index]}>
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
    height: appStyles.calendar.dateHeight / 2,
    width: appStyles.calendar.dateWidth,
  },
  label: {
    lineHeight: appStyles.calendar.dateHeight / 2,
  },
});
