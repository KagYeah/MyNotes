import React, { useContext } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import {
  bool, element, func, oneOfType, shape, string,
} from 'prop-types';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemeContext } from '../contexts';
import { appStyles } from '../style';
import { normalizeObj } from '../helpers';

export default function ListItem(props) {
  const { theme } = useContext(ThemeContext);
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
        style={{
          paddingHorizontal: appStyles(theme).listItem.paddingHorizontal,
          paddingVertical: appStyles(theme).listItem.paddingVertical,
        }}
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
        style={!linearGradient ? {
          paddingHorizontal: appStyles(theme).listItem.paddingHorizontal,
          paddingVertical: appStyles(theme).listItem.paddingVertical,
        } : null}
      >
        {component}
      </TouchableOpacity>
    );
  }

  return <View style={[styles(theme).container, style]}>{component}</View>;
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

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: appStyles(theme).listItem.backgroundColor,
    borderBottomColor: appStyles(theme).listItem.borderBottomColor,
    borderBottomWidth: 1,
    height: appStyles(theme).listItem.height,
    justifyContent: 'center',
    opacity: appStyles(theme).listItem.opacity,
    width: '100%',
  },
});
