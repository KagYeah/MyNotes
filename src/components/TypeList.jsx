import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { shape } from 'prop-types';
import { StackActions, useNavigation } from '@react-navigation/native';

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';
import ListItem from './ListItem';

export default function TypeList(props) {
  const navigation = useNavigation();
  const { style } = props;
  const { theme } = useContext(GlobalContext);
  const gradientColors = appTheme[theme].gradientColors1;
  const textColor = appTheme[theme].colorOnGradientColors1;

  return (
    <ScrollView style={[styles.container, style]}>
      <ListItem
        title={<Text style={[styles.text, { color: textColor }]}>メモ</Text>}
        onPress={() => {
          navigation.dispatch(StackActions.replace('MemoCreate'));
        }}
        style={styles.listItem}
        linearGradient
        options={{ colors: gradientColors }}
      />
      <ListItem
        title={<Text style={[styles.text, { color: textColor }]}>タスク</Text>}
        onPress={() => {
          navigation.dispatch(StackActions.replace('TaskCreate'));
        }}
        style={styles.listItem}
        linearGradient
        options={{ colors: gradientColors }}
      />
      <ListItem
        title={<Text style={[styles.text, { color: textColor }]}>予定</Text>}
        onPress={() => {
          navigation.dispatch(StackActions.replace('ScheduleCreate'));
        }}
        style={styles.listItem}
        linearGradient
        options={{ colors: gradientColors }}
      />
    </ScrollView>
  );
}

TypeList.propTypes = {
  style: shape(),
};

TypeList.defaultProps = {
  style: null,
};

const styles = StyleSheet.create({
  container: {
  },
  text: {
    alignSelf: 'center',
    fontSize: 18,
  },
  listItem: {
    height: 48,
    opacity: 1,
  },
});
