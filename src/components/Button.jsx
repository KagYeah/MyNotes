import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  func, string, number, shape, bool,
} from 'prop-types';
import { LinearGradient } from 'expo-linear-gradient';

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

  function getProps(obj, defaults) {
    const normalizedObj = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== undefined && obj[key] !== null) {
        normalizedObj[key] = obj[key];
      } else if (defaults[key] !== undefined && defaults[key] !== null) {
        normalizedObj[key] = defaults[key];
      }
    });

    return normalizedObj;
  }

  if (linearGradient) {
    const properties = getProps({
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
  label: string.isRequired,
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
  style: null,
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
