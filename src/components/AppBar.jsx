import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { element, oneOfType, string } from 'prop-types';

import { ThemeContext } from '../contexts';
import { appStyles } from '../style';

export default function AppBar(props) {
  const { theme } = useContext(ThemeContext);
  const { title, left, right } = props;
  let titleComponent = title;

  if (typeof title === 'string') {
    titleComponent = <Text style={styles(theme).title}>{title}</Text>;
  }

  return (
    <LinearGradient colors={appStyles(theme).appbar.gradientColors} style={styles(theme).container}>
      <View style={styles(theme).inner}>{titleComponent}</View>
      <View style={styles(theme).left}>{left}</View>
      <View style={styles(theme).right}>{right}</View>
    </LinearGradient>
  );
}

AppBar.propTypes = {
  title: oneOfType([string, element]).isRequired,
  left: element,
  right: element,
};

AppBar.defaultProps = {
  left: null,
  right: null,
};

const styles = (theme) => StyleSheet.create({
  container: {
    height: appStyles(theme).appbar.height,
    justifyContent: 'flex-end',
    width: '100%',
    zIndex: appStyles(theme).appbar.zIndex,
  },
  inner: {
    alignItems: 'center',
    marginBottom: appStyles(theme).appbar.paddingBottom,
  },
  title: {
    color: appStyles(theme).appbarTitle.color,
    fontSize: appStyles(theme).appbarTitle.fontSize,
    fontWeight: 'bold',
  },
  left: {
    bottom: 0,
    left: appStyles(theme).appbar.paddingHorizontal,
    position: 'absolute',
  },
  right: {
    bottom: 0,
    position: 'absolute',
    right: appStyles(theme).appbar.paddingHorizontal,
  },
});
