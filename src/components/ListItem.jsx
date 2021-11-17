import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import {
  bool, element, func, oneOfType, shape, string,
} from 'prop-types';
import { LinearGradient } from 'expo-linear-gradient';

import { normalizeObj } from '../helpers';

export default function ListItem(props) {
  const {
    title, onPress, style, linearGradient, options,
  } = props;

  let component = title;

  if (typeof title === 'string') {
    const properties = normalizeObj({
      color: style.color,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
    });
    component = <Text style={properties}>{title}</Text>;
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

    component = (
      <LinearGradient
        {...properties}
        style={[
          {
            height: 72,
            justifyContent: 'center',
            paddingHorizontal: 24,
            paddingVertical: 8,
          },
          style,
        ]}
      >
        {component}
      </LinearGradient>
    );
  }

  if (onPress) {
    const properties = normalizeObj({
      activeOpacity: options.activeOpacity,
      onPress,
    });

    component = (
      <TouchableOpacity
        {...properties}
        style={!linearGradient ? [
          {
            height: 72,
            justifyContent: 'center',
            paddingHorizontal: 24,
            paddingVertical: 8,
          },
          style,
        ] : style}
      >
        {component}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.container, style]}>{component}</View>;
}

ListItem.propTypes = {
  title: oneOfType([string, element]).isRequired,
  onPress: func,
  style: shape(),
  linearGradient: bool,
  options: shape(),
};

ListItem.defaultProps = {
  onPress: null,
  style: null,
  linearGradient: false,
  options: {},
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    opacity: 0.8,
    justifyContent: 'center',
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
    borderBottomWidth: 1,
  },
});
