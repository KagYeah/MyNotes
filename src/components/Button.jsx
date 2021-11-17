import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import {
  bool, element, func, number, oneOfType, shape, string,
} from 'prop-types';
import { LinearGradient } from 'expo-linear-gradient';

import { normalizeObj } from '../helpers';

export default function Button(props) {
  const {
    label, onPress, style,
    backgroundColor, borderRadius, height, width,
    color, fontSize, fontWeight,
    linearGradient, options,
  } = props;

  let labelComponent = label;

  if (typeof label === 'string') {
    labelComponent = (
      <Text
        style={{
          color, fontSize, fontWeight,
        }}
      >
        {label}
      </Text>
    );
  }

  if (linearGradient) {
    const properties = normalizeObj({
      colors: options.colors,
      locations: options.locations,
      start: options.start,
      end: options.end,
    }, {
      colors: ['#fff', '#000'],
    });

    labelComponent = (
      <LinearGradient
        {...properties}
        style={[
          styles.lineaerGradient,
          {
            borderRadius,
            height,
            width,
          },
        ]}
      >
        {labelComponent}
      </LinearGradient>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        style,
        {
          backgroundColor,
          borderRadius,
          height,
          width,
        },
      ]}
      onPress={onPress}
    >
      {labelComponent}
    </TouchableOpacity>
  );
}

Button.propTypes = {
  label: oneOfType([string, element]).isRequired,
  onPress: func.isRequired,
  style: shape(),
  backgroundColor: string,
  borderRadius: number,
  height: number,
  width: number,
  color: string,
  fontSize: number,
  fontWeight: string,
  linearGradient: bool,
  options: shape(),
};

Button.defaultProps = {
  style: {},
  backgroundColor: '#fff',
  borderRadius: 8,
  height: 50,
  width: 68,
  color: '#000',
  fontSize: 18,
  fontWeight: 'normal',
  linearGradient: false,
  options: {},
};

const styles = StyleSheet.create({
  lineaerGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
});
