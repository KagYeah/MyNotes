import React, { useContext, useRef, useState } from 'react';
import {
  StyleSheet, TextInput, TouchableOpacity,
} from 'react-native';
import {
  bool, func, shape, string,
} from 'prop-types';

import { ThemeContext } from '../contexts';
import { appStyles } from '../style';

export default function NoteBodyInput(props) {
  const { theme } = useContext(ThemeContext);
  const {
    autoFocus, onChangeText, placeholder, style, value,
  } = props;
  const [inputHeight, setInputHeight] = useState(0);
  const inputRef = useRef();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => inputRef.current.focus()}
      style={[styles(theme).container, { height: inputHeight }]}
    >
      <TextInput
        autoFocus={autoFocus}
        multiline
        onChangeText={onChangeText}
        onContentSizeChange={(event) => setInputHeight(
          Math.max(appStyles(theme).noteBodyInput.minHeight, event.nativeEvent.contentSize.height),
        )}
        placeholder={placeholder}
        scrollEnabled={false}
        style={[styles(theme).body, style]}
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

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: appStyles(theme).noteBodyInput.backgroundColor,
    borderBottomColor: appStyles(theme).noteBodyInput.borderBottomColor,
    borderBottomWidth: appStyles(theme).noteBodyInput.borderBottomWidth,
    // if you set opacity, edit appStyles(theme).noteBodyInput.opacity in src/style/index.jsx
    // opacity: appStyles(theme).noteBodyInput.opacity,
    paddingHorizontal: appStyles(theme).noteBodyInput.paddingHorizontal,
    paddingVertical: appStyles(theme).noteBodyInput.paddingVertical,
    width: '100%',
  },
  body: {
    color: appStyles(theme).noteBodyInput.color,
    fontSize: appStyles(theme).noteBodyInput.fontSize,
  },
});
