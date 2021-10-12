import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import {
  bool, element, func, oneOfType, shape, string,
} from 'prop-types';
import { LinearGradient } from 'expo-linear-gradient';

import { appStyles } from '../style';
import { normalizeObj } from '../helpers';

export default function ListItem(props) {
  const {
    title, onPress, style, linearGradient, options,
  } = props;
  let component = title;

  if (typeof title === 'string') {
    component = <Text>{title}</Text>;
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
        style={[styles.container, style]}
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
    backgroundColor: appStyles.listItem.backgroundColor,
    borderBottomColor: appStyles.listItem.borderBottomColor,
    borderBottomWidth: 1,
    height: appStyles.listItem.height,
    justifyContent: 'center',
    opacity: appStyles.listItem.opacity,
    paddingHorizontal: appStyles.listItem.paddingHorizontal,
    paddingVertical: appStyles.listItem.paddingVertical,
    width: '100%',
  },
});
