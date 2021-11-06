import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ThemeContext } from '../contexts';
import { appStyles } from '../style';

export default function CalendarDayLabel() {
  const { theme } = useContext(ThemeContext);
  const labels = ['日', '月', '火', '水', '木', '金', '土'];
  const keys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const labelComponents = [];

  labels.forEach((label, index) => {
    labelComponents.push((
      <View style={styles(theme).labelContainer} key={keys[index]}>
        <Text style={styles(theme).label}>{label}</Text>
      </View>
    ));
  });

  return <View style={styles(theme).container}>{labelComponents}</View>;
}

const styles = (theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  labelContainer: {
    alignItems: 'center',
    height: appStyles(theme).calendar.dateHeight / 2,
    width: appStyles(theme).calendar.dateWidth,
  },
  label: {
    lineHeight: appStyles(theme).calendar.dateHeight / 2,
  },
});
