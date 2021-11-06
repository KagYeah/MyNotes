import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { bool, func, shape } from 'prop-types';

import { ThemeContext } from '../contexts';
import { appStyles } from '../style';

export default function CheckBox(props) {
  const { theme } = useContext(ThemeContext);
  const { checked, onPress, style } = props;
  const [_checked, setChecked] = useState(checked);

  useEffect(() => {
    setChecked(checked);
  }, [checked]);

  return (
    <TouchableOpacity
      onPress={() => {
        setChecked(!_checked);
        onPress();
      }}
      style={[styles(theme).container, style]}
    >
      {_checked
        ? <Text style={styles(theme).iconChecked}>[*]</Text>
        : <Text style={styles(theme).iconUnchecked}>[  ]</Text>}
    </TouchableOpacity>
  );
}

CheckBox.propTypes = {
  checked: bool,
  onPress: func,
  style: shape(),
};

CheckBox.defaultProps = {
  checked: false,
  onPress: () => {},
  style: {},
};

const styles = (theme) => StyleSheet.create({
  container: {
    padding: 8,
  },
  iconChecked: {
    color: appStyles(theme).checkbox.checkedColor,
    fontSize: appStyles(theme).checkbox.fontSize,
  },
  iconUnchecked: {
    color: appStyles(theme).checkbox.uncheckedColor,
    fontSize: appStyles(theme).checkbox.fontSize,
  },
});
