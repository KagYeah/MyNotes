import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { element, oneOfType, string } from 'prop-types';

import { ThemeContext } from '../contexts';
import { appStyles } from '../style';

export default function ListHeader(props) {
  const { theme } = useContext(ThemeContext);
  const { left, right } = props;
  let leftComponent = left;
  let rightComponent = right;

  if (typeof left === 'string') {
    leftComponent = <Text style={styles(theme).text}>{left}</Text>;
  }

  if (typeof right === 'string') {
    rightComponent = <Text style={styles(theme).text}>{right}</Text>;
  }

  return (
    <LinearGradient
      colors={appStyles(theme).listHeader.gradientColors}
      style={styles(theme).container}
    >
      {left && <View style={styles(theme).left}>{leftComponent}</View>}
      {right && <View style={styles(theme).right}>{rightComponent}</View>}
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

const styles = (theme) => StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: appStyles(theme).listHeader.height,
    justifyContent: 'space-between',
    paddingHorizontal: appStyles(theme).listHeader.paddingHorizontal,
    paddingVertical: appStyles(theme).listHeader.paddingVertical,
  },
  left: {
    alignItems: 'center',
  },
  right: {
    alignItems: 'center',
    width: appStyles(theme).listHeaderRight.width,
  },
  text: {
    fontSize: appStyles(theme).listHeader.fontSize,
    fontWeight: appStyles(theme).listHeader.fontWeight,
  },
});
