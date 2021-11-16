import React, { useContext, useState } from 'react';
import {
  Platform,
  StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {
  func, instanceOf, oneOf, string,
} from 'prop-types';

import { GlobalContext } from '../contexts';
import Button from './Button';
import { appStyles } from '../style';
import { date2string } from '../helpers';

export default function DateTimeInput(props) {
  const { theme } = useContext(GlobalContext);
  const {
    label, mode, onChange, value,
  } = props;
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles(theme).container}
      >
        <Text style={styles(theme).text}>{label}</Text>
        {showPicker && Platform.OS === 'ios'
          ? (
            <Button
              label="OK"
              onPress={() => setShowPicker(false)}
              backgroundColor={styles(theme).container.backgroundColor}
              height={styles(theme).container.height - styles(theme).container.paddingVertical}
            />
          ) : (
            <Text style={styles(theme).text}>{date2string(value, mode, true)}</Text>
          )}
      </TouchableOpacity>

      {showPicker ? (
        <RNDateTimePicker
          value={value}
          mode={mode}
          is24Hour
          display={mode === 'date' && Platform.OS === 'android' ? 'calendar' : 'spinner'}
          locale="ja-JP"
          style={styles(theme).picker}
          onChange={(event, selectedValue) => {
            setShowPicker(Platform.OS === 'ios');
            onChange(selectedValue);
          }}
        />
      ) : null}
    </>
  );
}

DateTimeInput.propTypes = {
  label: string.isRequired,
  mode: oneOf(['date', 'time']).isRequired,
  onChange: func,
  value: instanceOf(Date).isRequired,
};

DateTimeInput.defaultProps = {
  onChange: () => {},
};

const styles = (theme) => StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: appStyles(theme).datetimeInput.backgroundColor,
    borderBottomColor: appStyles(theme).datetimeInput.borderBottomColor,
    borderBottomWidth: appStyles(theme).datetimeInput.borderBottomWidth,
    flexDirection: 'row',
    height: appStyles(theme).datetimeInput.height,
    justifyContent: 'space-between',
    paddingHorizontal: appStyles(theme).datetimeInput.paddingHorizontal,
    paddingVertical: appStyles(theme).datetimeInput.paddingVertical,
    width: '100%',
  },
  text: {
    color: appStyles(theme).datetimeInput.color,
    fontSize: appStyles(theme).datetimeInput.fontSize,
  },
  picker: {
    backgroundColor: appStyles(theme).datetimePicker.backgroundColor,
  },
});
