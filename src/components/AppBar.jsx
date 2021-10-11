import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { element, oneOfType, string } from 'prop-types';

export default function AppBar(props) {
  const { title, left, right } = props;
  let titleComponent = title;

  if (typeof title === 'string') {
    titleComponent = <Text style={styles.title}>{title}</Text>;
  }

  return (
    <LinearGradient colors={['#393960', '#000033']} style={styles.container}>
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
    justifyContent: 'flex-end',
    width: '100%',
  },
  inner: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  left: {
    bottom: 0,
    left: 16,
    position: 'absolute',
  },
  right: {
    bottom: 0,
    position: 'absolute',
    right: 16,
  },
});
