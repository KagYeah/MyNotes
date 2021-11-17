import React, { useRef, useState } from 'react';
import {
  StyleSheet, TextInput, TouchableOpacity,
} from 'react-native';
import {
  bool, func, shape, string,
} from 'prop-types';

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
          Math.max(400, event.nativeEvent.contentSize.height),
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
    backgroundColor: '#fff',
    opacity: 0.8,
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
    borderBottomWidth: 1,
  },
  body: {
    color: '#000',
    fontSize: 16,
  },
});
