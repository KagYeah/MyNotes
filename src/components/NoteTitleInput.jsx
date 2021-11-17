import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import {
  bool, func, shape, string,
} from 'prop-types';

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
          Math.min(96, event.nativeEvent.contentSize.height),
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
    width: '100%',
    backgroundColor: '#fff',
    opacity: 0.8,
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
    borderBottomWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    paddingTop: 0,
    color: '#000',
    fontSize: 18,
  },
});
