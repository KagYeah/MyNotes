import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import {
  bool, func, shape, string,
} from 'prop-types';

import { appStyles } from '../style';

export default function NoteTitleInput(props) {
  const {
    autoFocus, onChangeText, placeholder, style, value,
  } = props;
  const [inputHeight, setInputHeight] = useState(0);

  return (
    <View style={styles.container}>
      <TextInput
        autoFocus={autoFocus}
        multiline
        onChangeText={onChangeText}
        onContentSizeChange={(event) => setInputHeight(
          Math.min(appStyles.noteTitleInput.maxHeight, event.nativeEvent.contentSize.height),
        )}
        placeholder={placeholder}
        style={[styles.title, { height: inputHeight }, style]}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: appStyles.noteTitleInput.backgroundColor,
    borderBottomColor: appStyles.noteTitleInput.borderBottomColor,
    borderBottomWidth: appStyles.noteTitleInput.borderBottomWidth,
    opacity: appStyles.noteTitleInput.opacity,
    paddingHorizontal: appStyles.noteTitleInput.paddingHorizontal,
    paddingVertical: appStyles.noteTitleInput.paddingVertical,
    width: '100%',
  },
  title: {
    color: appStyles.noteTitleInput.color,
    fontSize: appStyles.noteTitleInput.fontSize,
  },
});
