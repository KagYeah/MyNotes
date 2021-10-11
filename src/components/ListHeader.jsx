import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { element, oneOfType, string } from 'prop-types';
import { appStyles } from '../style';

export default function ListHeader(props) {
  const { left, right } = props;
  let leftComponent = left;
  let rightComponent = right;

  if (typeof left === 'string') {
    leftComponent = <Text style={styles.text}>{left}</Text>;
  }

  if (typeof right === 'string') {
    rightComponent = <Text style={styles.text}>{right}</Text>;
  }

  return (
    <LinearGradient colors={appStyles.listHeader.gradientColors} style={styles.container}>
      {left && <View style={styles.left}>{leftComponent}</View>}
      {right && <View style={styles.right}>{rightComponent}</View>}
    </LinearGradient>
  );
}

ListHeader.propTypes = {
  left: oneOfType([string, element]),
  right: oneOfType([string, element]),
};

ListHeader.defaultProps = {
  left: null,
  right: null,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: appStyles.listHeader.height,
    justifyContent: 'space-between',
    paddingHorizontal: appStyles.listHeader.paddingHorizontal,
    paddingVertical: appStyles.listHeader.paddingVertical,
  },
  left: {
    alignItems: 'center',
  },
  right: {
    alignItems: 'center',
    width: appStyles.listHeaderRight.width,
  },
  text: {
    fontSize: appStyles.listHeader.fontSize,
    fontWeight: appStyles.listHeader.fontWeight,
  },
});
