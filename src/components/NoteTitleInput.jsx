import React, { useContext, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import {
  bool, func, shape, string,
} from 'prop-types';

import { ThemeContext } from '../contexts';
import { appStyles } from '../style';

export default function NoteTitleInput(props) {
  const { theme } = useContext(ThemeContext);
  const {
    autoFocus, onChangeText, placeholder, style, value,
  } = props;
  const [inputHeight, setInputHeight] = useState(0);

  return (
    <View style={styles(theme).container}>
      <TextInput
        autoFocus={autoFocus}
        multiline
        onChangeText={onChangeText}
        onContentSizeChange={(event) => setInputHeight(
          Math.min(appStyles(theme).noteTitleInput.maxHeight, event.nativeEvent.contentSize.height),
        )}
        placeholder={placeholder}
        style={[styles(theme).title, { height: inputHeight }, style]}
        value={value}
      />
    </View>
  );
}

NoteTitleInput.propTypes = {
  autoFocus: bool,
  onChangeText: func.isRequired,
  placeholder: string,
  style: shape(),
  value: string.isRequired,
};

NoteTitleInput.defaultProps = {
  autoFocus: false,
  style: null,
  placeholder: 'タイトル',
};

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: appStyles(theme).noteTitleInput.backgroundColor,
    borderBottomColor: appStyles(theme).noteTitleInput.borderBottomColor,
    borderBottomWidth: appStyles(theme).noteTitleInput.borderBottomWidth,
    opacity: appStyles(theme).noteTitleInput.opacity,
    paddingHorizontal: appStyles(theme).noteTitleInput.paddingHorizontal,
    paddingVertical: appStyles(theme).noteTitleInput.paddingVertical,
    width: '100%',
  },
  title: {
    paddingTop: 0,
    color: appStyles(theme).noteTitleInput.color,
    fontSize: appStyles(theme).noteTitleInput.fontSize,
  },
});
