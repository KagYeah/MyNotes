import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { bool, func, shape } from 'prop-types';

import { appStyles } from '../style';

export default function CheckBox(props) {
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
      style={[styles.container, style]}
    >
      {_checked
        ? <Text style={styles.iconChecked}>[*]</Text>
        : <Text style={styles.iconUnchecked}>[  ]</Text>}
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

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  iconChecked: {
    color: appStyles.checkbox.checkedColor,
    fontSize: appStyles.checkbox.fontSize,
  },
  iconUnchecked: {
    color: appStyles.checkbox.uncheckedColor,
    fontSize: appStyles.checkbox.fontSize,
  },
});
