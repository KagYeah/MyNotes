import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import {
  bool, element, func, oneOfType, shape, string,
} from 'prop-types';
import { LinearGradient } from 'expo-linear-gradient';

export default function ListItem(props) {
  const {
    title, onPress, style, linearGradient, options,
  } = props;
  let component = title;

  if (typeof title === 'string') {
    component = <Text>{title}</Text>;
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
    component = (
      <LinearGradient
        {...properties}
        style={[styles.container, style]}
      >
        {component}
      </LinearGradient>
    );
  }

  if (onPress) {
    const properties = getProps({
      activeOpacity: options.activeOpacity,
      onPress,
    }, {
      activeOpacity: null,
    });
    component = (
      <TouchableOpacity
        {...properties}
        style={!linearGradient ? [styles.container, style] : style}
      >
        {component}
      </TouchableOpacity>
    );
  }

  if (!linearGradient && !onPress) {
    component = <View style={[styles.container, style]}>{component}</View>;
  }

  return component;
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
    backgroundColor: '#fff',
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
    borderBottomWidth: 1,
    height: 72,
    justifyContent: 'center',
    opacity: 0.9,
    paddingVertical: 8,
    paddingHorizontal: 24,
    width: '100%',
  },
});
