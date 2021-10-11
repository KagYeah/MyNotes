import React from 'react';
import {
  element, func, number, oneOfType, shape, string,
} from 'prop-types';

import Button from './Button';

export default function CircleButton(props) {
  const {
    label, onPress, style, size, fontSize, fontWeight,
  } = props;

  return (
    <Button
      label={label}
      onPress={onPress}
      style={style}
      borderRadius={size / 2}
      padding={0}
      height={size}
      width={size}
      color="#fff"
      fontSize={fontSize}
      fontWeight={fontWeight}
      linearGradient
      options={{ colors: ['#393960', '#000033'] }}
    />
  );
}

CircleButton.propTypes = {
  label: oneOfType([string, element]).isRequired,
  onPress: func.isRequired,
  style: shape(),
  size: number,
  fontSize: number,
  fontWeight: string,
};

CircleButton.defaultProps = {
  style: {},
  size: 48,
  fontSize: 24,
  fontWeight: 'normal',
};
