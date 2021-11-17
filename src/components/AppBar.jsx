import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { element, oneOfType, string } from 'prop-types';

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';

export default function AppBar(props) {
  const { title, left, right } = props;
  const { theme } = useContext(GlobalContext);

  let titleComponent = title;

  if (typeof title === 'string') {
    titleComponent = (
      <Text
        style={[
          styles.title,
          { color: appTheme[theme].colorOnGradientColors1 },
        ]}
      >
        {title}
      </Text>
    );
  }

  return (
    <LinearGradient colors={appTheme[theme].gradientColors1} style={styles.container}>
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
    height: 104,
    width: '100%',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  inner: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  left: {
    position: 'absolute',
    bottom: 0,
    left: 16,
  },
  right: {
    position: 'absolute',
    bottom: 0,
    right: 16,
  },
});
