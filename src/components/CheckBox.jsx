import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { bool, func, shape } from 'prop-types';

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
    color: '#0f0',
    fontSize: 24,
  },
  iconUnchecked: {
    color: '#000',
    fontSize: 24,
  },
});
