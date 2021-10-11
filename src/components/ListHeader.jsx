import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { element, oneOfType, string } from 'prop-types';

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
    <LinearGradient colors={['rgba(238, 238, 255, 0.9)', 'rgba(227, 227, 237, 0.9)']} style={styles.container}>
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
    justifyContent: 'flex-start',
  },
  right: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '20%',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
