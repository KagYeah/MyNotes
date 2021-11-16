import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { shape } from 'prop-types';
import { StackActions, useNavigation } from '@react-navigation/native';

import { GlobalContext } from '../contexts';
import ListItem from './ListItem';
import { appStyles } from '../style';

// if you change the number of ListItem, edit appStyles(theme).typeListItem.count
export default function TypeList(props) {
  const { theme } = useContext(GlobalContext);
  const navigation = useNavigation();
  const { style } = props;

  return (
    <ScrollView style={[styles(theme).container, style]}>
      <ListItem
        title={<Text style={styles(theme).text}>メモ</Text>}
        onPress={() => {
          navigation.dispatch(StackActions.replace('MemoCreate'));
        }}
        style={styles(theme).listItem}
        linearGradient
        options={{ colors: appStyles(theme).typeListItem.gradientColors }}
      />
      <ListItem
        title={<Text style={styles(theme).text}>タスク</Text>}
        onPress={() => {
          navigation.dispatch(StackActions.replace('TaskCreate'));
        }}
        style={styles(theme).listItem}
        linearGradient
        options={{ colors: appStyles(theme).typeListItem.gradientColors }}
      />
      <ListItem
        title={<Text style={styles(theme).text}>予定</Text>}
        onPress={() => {
          navigation.dispatch(StackActions.replace('ScheduleCreate'));
        }}
        style={styles(theme).listItem}
        linearGradient
        options={{ colors: appStyles(theme).typeListItem.gradientColors }}
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

const styles = (theme) => StyleSheet.create({
  container: {
  },
  text: {
    alignSelf: 'center',
    color: appStyles(theme).typeListItem.color,
    fontSize: appStyles(theme).typeListItem.fontSize,
  },
  listItem: {
    opacity: appStyles(theme).typeListItem.opacity,
    height: appStyles(theme).typeListItem.height,
  },
});
