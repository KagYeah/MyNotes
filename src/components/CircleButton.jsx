import React from 'react';
import {
  element, func, number, oneOfType, shape, string,
} from 'prop-types';

import Button from './Button';
import { appStyles } from '../style';

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
      height={size}
      width={size}
      color={appStyles.circleButton.color}
      fontSize={fontSize}
      fontWeight={fontWeight}
      linearGradient
      options={{ colors: appStyles.circleButton.gradientColors }}
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
