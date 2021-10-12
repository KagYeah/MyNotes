import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { element, oneOfType, string } from 'prop-types';

import { appStyles } from '../style';

export default function AppBar(props) {
  const { title, left, right } = props;
  let titleComponent = title;

  if (typeof title === 'string') {
    titleComponent = <Text style={styles.title}>{title}</Text>;
  }

  return (
    <LinearGradient colors={appStyles.appbar.gradientColors} style={styles.container}>
      <View style={styles.inner}>{titleComponent}</View>
      <View style={styles.left}>{left}</View>
      <View style={styles.right}>{right}</View>
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

const styles = StyleSheet.create({
  container: {
    height: appStyles.appbar.height,
    justifyContent: 'flex-end',
    width: '100%',
    zIndex: 10,
  },
  inner: {
    alignItems: 'center',
    marginBottom: appStyles.appbar.paddingBottom,
  },
  title: {
    color: appStyles.appbarTitle.color,
    fontSize: appStyles.appbarTitle.fontSize,
    fontWeight: 'bold',
  },
  left: {
    bottom: 0,
    left: appStyles.appbar.paddingHorizontal,
    position: 'absolute',
  },
  right: {
    bottom: 0,
    position: 'absolute',
    right: appStyles.appbar.paddingHorizontal,
  },
});
