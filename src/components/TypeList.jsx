import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { shape } from 'prop-types';

import ListItem from './ListItem';
import { appStyles } from '../style';

// if you change the number of ListItem, edit appStyles.typeListItem.count
export default function TypeList(props) {
  const { style } = props;

  return (
    <ScrollView style={[styles.container, style]}>
      <ListItem
        title={<Text style={styles.text}>メモ</Text>}
        onPress={() => {}}
        style={{ opacity: 1, height: 48 }}
        linearGradient
        options={{ colors: appStyles.typeListItem.gradientColors }}
      />
      <ListItem
        title={<Text style={styles.text}>タスク</Text>}
        onPress={() => {}}
        style={{ opacity: 1, height: 48 }}
        linearGradient
        options={{ colors: appStyles.typeListItem.gradientColors }}
      />
      <ListItem
        title={<Text style={styles.text}>予定</Text>}
        onPress={() => {}}
        style={{ opacity: 1, height: 48 }}
        linearGradient
        options={{ colors: appStyles.typeListItem.gradientColors }}
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
    color: appStyles.typeListItem.color,
    fontSize: appStyles.typeListItem.fontSize,
  },
});
