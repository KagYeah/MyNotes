import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { element, oneOfType, string } from 'prop-types';

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';

export default function ListHeader(props) {
  const { left, right } = props;
  const { theme } = useContext(GlobalContext);
  const gradientColors = appTheme[theme].gradientColors2;
  const textColor = appTheme[theme].colorOnGradientColors2;

  let leftComponent = left;
  let rightComponent = right;

  if (typeof left === 'string') {
    leftComponent = <Text style={[styles.text, { color: textColor }]}>{left}</Text>;
  }

  if (typeof right === 'string') {
    rightComponent = <Text style={[styles.text, { color: textColor }]}>{right}</Text>;
  }

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
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
    height: 48,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  left: {
    alignItems: 'center',
  },
  right: {
    alignItems: 'center',
    width: '20%',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
