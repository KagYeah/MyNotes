import React, { useRef, useState } from 'react';
import {
  StyleSheet, TextInput, TouchableOpacity,
} from 'react-native';
import {
  bool, func, shape, string,
} from 'prop-types';

import { appStyles } from '../style';

export default function NoteBodyInput(props) {
  const {
    autoFocus, onChangeText, placeholder, style, value,
  } = props;
  const [inputHeight, setInputHeight] = useState(0);
  const inputRef = useRef();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => inputRef.current.focus()}
      style={[styles.container, { height: inputHeight }]}
    >
      <TextInput
        autoFocus={autoFocus}
        multiline
        onChangeText={onChangeText}
        onContentSizeChange={(event) => setInputHeight(
          Math.max(appStyles.noteBodyInput.minHeight, event.nativeEvent.contentSize.height),
        )}
        placeholder={placeholder}
        scrollEnabled={false}
        style={[styles.body, style]}
        ref={inputRef}
        value={value}
      />
    </TouchableOpacity>
  );
}

NoteBodyInput.propTypes = {
  autoFocus: bool,
  onChangeText: func.isRequired,
  placeholder: string,
  style: shape(),
  value: string.isRequired,
};

NoteBodyInput.defaultProps = {
  autoFocus: false,
  placeholder: 'テキスト',
  style: null,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appStyles.noteBodyInput.backgroundColor,
    borderBottomColor: appStyles.noteBodyInput.borderBottomColor,
    borderBottomWidth: appStyles.noteBodyInput.borderBottomWidth,
    // if you set opacity, edit appStyles.noteBodyInput.opacity in src/style/index.jsx
    // opacity: appStyles.noteBodyInput.opacity,
    paddingHorizontal: appStyles.noteBodyInput.paddingHorizontal,
    paddingVertical: appStyles.noteBodyInput.paddingVertical,
    width: '100%',
  },
  body: {
    color: appStyles.noteBodyInput.color,
    fontSize: appStyles.noteBodyInput.fontSize,
  },
});
